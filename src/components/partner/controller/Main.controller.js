sap.ui.define(["aklc/cm/library/common/controller/BaseController", "sap/m/MessageBox"], function(BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("aklc.cm.components.partner.controller.Main", {
		_oViewRegistry: [],
		sProcesKey: "",
		_basePath: "aklc.cm.components.partner.view.",

		onInit: function() {
			BaseController.prototype.onInit.apply(this);

			this.container = this.getView().byId("splitContainer");
			this.container.addContent(this._getView(this._basePath + "SelectList"));

			this.addSubscriptions();
		},

		addSubscriptions: function() {
			var that = this;
			that.getEventBus().subscribe(
				"SelectList",
				"selected",
				function(sChannel, sEventId, oParams) {
					that.container.removeAllContent();
					var nameList = that._getView(that._basePath + "NameSelectList");
					nameList.bindElement(oParams.path);
					that.container.addContent(nameList);

					if (nameList.getController().firstUpdated) {
						that.handleNameSelectListRestriction(oParams.path);
					}
				}
			);

			that.getEventBus().subscribe(
				"SelectList",
				"firstupdate",
				that.handleSelectListRestriction.bind(this)
			);

			that.getEventBus().subscribe(
				"NameSelectList",
				"goBack",
				function() {
					that.container.removeAllContent();
					that.container.addContent(
						that._getView(that._basePath + "SelectList")
					);
				}
			);

			that.getEventBus().subscribe(
				"NameSelectList",
				"firstupdate",
				function(sChannel, sEvent, oParams) {
					that.handleNameSelectListRestriction(oParams.path);
				}
			);

			that.getEventBus().subscribe(
				"PartnerList",
				"selected",
				function(sChannel, sEventId, oParams) {
					that.handlePartnerSelected(oParams.path);
					that.handleNameSelectListRestriction(oParams.path);
				}
			);

			that.getEventBus().subscribe(
				"PartnerList",
				"changed",
				that.handleSelectListRestriction.bind(this)
			);
		},

		/**
		 * handlePartnerSelected
		 * @param  {string} assignedPartnerPath
		 */
		handlePartnerSelected: function(assignedPartnerPath) {
			var partner = this._oModel.getProperty(assignedPartnerPath);
			var nameList = this._getView(this._basePath + "NameSelectList");

			var nameListController = nameList.getController();
			if (nameListController) {
				nameListController.reset();
			}

			if (!this.isInNameSelectList()) {
				this.container.removeAllContent();
				this.container.addContent(nameList);
			}

			nameList.bindElement(
				"/PartnerFunctions(" + partner.PartnerFunctionCode + ")"
			);
			if (!partner.Unassigned) {
				nameList.byId("partnerDetails").bindElement(assignedPartnerPath);
				nameList.byId("partnerDetails").setVisible(true);
				if (partner.Readonly) {
					nameList.byId("nameSelectSection").setVisible(false);
				}
			}
		},

		handleSelectListRestriction: function() {
			var that = this;
			var partners = that.getAssignedPartners();
			var functionMap = {};
			for (var i = 0; i < partners.length; i++) {
				if (partners[i].Unassigned) {
					functionMap[partners[i].PartnerFunctionCode] = true;
				}
			}
			that._getView(that._basePath + "SelectList")
				.byId('selectList').getAggregation('items')
				.map(function(item) {
					that.setItemInactive(item, !!functionMap[
						that._oModel.getProperty(
							item.getBindingContext().sPath
						).PartnerFunctionCode
					]);
				});
		},

		/**
		 * handleNameSelectListRestriction
		 * @param  {string} functionPath
		 */
		handleNameSelectListRestriction: function(functionPath) {
			var that = this;
			var targetFunctionCode = that._oModel.getProperty(functionPath).PartnerFunctionCode;
			var partners = that.getAssignedPartners();
			var partnerMap = {};
			for (var i = 0; i < partners.length; i++) {
				if (partners[i].PartnerFunctionCode === targetFunctionCode) {
					partnerMap[partners[i].PartnerNumber] = true;
				}
			}
			that._getView(that._basePath + "NameSelectList")
				.byId('nameSelectList').getAggregation('items')
				.map(function(item) {
					that.setItemInactive(item, !!partnerMap[
						that._oModel.getProperty(
							item.getBindingContext().sPath
						).PartnerNumber
					]);
				});
		},

		/**
		 * setItemInactive
		 * @param {Obejct} item     listItem
		 * @param {boolean} inactive
		 */
		setItemInactive: function(item, inactive) {
			if (inactive) {
				item.setType(sap.m.ListType.Inactive);
				item.addStyleClass("inactive-list-item");
			} else {
				item.setType(sap.m.ListType.Active);
				item.removeStyleClass("inactive-list-item");
			}
		},

		_getView: function(sStepViewName) {
			//TODO: refactor to application controller
			if (this._oViewRegistry[sStepViewName]) {
				return this._oViewRegistry[sStepViewName];
			}
			var oViewData = {
				oComponent: this.getComponent()
			};

			//HACK - something destroys owner
			if (!sap.ui.base.ManagedObject._sOwnerId) {
				sap.ui.base.ManagedObject._sOwnerId = oViewData.oComponent.getId();
			}
			var oView = sap.ui.view({
				type: sap.ui.core.mvc.ViewType.XML,
				viewName: sStepViewName,
				viewData: oViewData
			});

			this._oViewRegistry[sStepViewName] = oView;

			return oView;
		},

		/**
		 * check if the right column is in name select list
		 * @return {Boolean}
		 */
		isInNameSelectList: function() {
			return this.getView().byId("splitContainer").getContent()[0].sViewName
				=== (this._basePath + "NameSelectList");
		},

		/**
		 * On Context change need to get Assigned Partners relative to process
		 * @param  {[type]} sChannel [description]
		 * @param  {[type]} sEvent   [description]
		 * @param  {[type]} oData    [description]
		 */
		onContextChanged: function(sChannel, sEvent, oData) {
			this.sProcesKey = this._oModel.getProperty("ProcessKey", oData.context);
		},

		/**
		 * getTodoData
		 * @return {Object}
		 */
		getTodoData: function() {
			return this.calculateTodoData(
				this.getPartnerFunctions(),
				this.getAssignedPartners()
			);
		},

		/**
		 * calculate todo data, get to fill and exceeded
		 * @param  {Array} partnerFunctions
		 * @param  {Array} partners
		 * @return {Object}
		 */
		calculateTodoData: function(partnerFunctions, partners) {
			var partnerCount = {};
			for (var i = 0; i < partners.length; i++) {
				var partner = partners[i];
				if (partner.Unassigned !== true) {
					if (partnerCount[partner.PartnerFunctionCode]) {
						partnerCount[partner.PartnerFunctionCode]++;
					} else {
						partnerCount[partner.PartnerFunctionCode] = 1;
					}
				}
			}

			var violationData = {
				toFill: [],
				exceeded: []
			};
			for (var j = 0; j < partnerFunctions.length; j++) {
				var func = partnerFunctions[j];
				var count = 0;
				if (partnerCount[func.PartnerFunctionCode]) {
					count = partnerCount[func.PartnerFunctionCode];
				}
				if (count < func.CountLow) {
					violationData.toFill.push(func);
				}
				if (count > func.CountHigh) {
					violationData.exceeded.push(func);
				}
			}

			return violationData;
		},

		getAssignedPartners: function() {
			var that = this;
			return that._oModel.getProperty(
				"AssignedPartners",
				that._oModel.getContext(
					this._oModel.createKey("/Process", {ProcessKey: this.sProcesKey})
				)
			).map(function (path) {
				return that._oModel.getProperty("/" + path);
			});
		},

		getPartnerFunctions: function() {
		    var that = this;
			return that._getView(that._basePath + "SelectList").byId("selectList")
				.mBindingInfos.items.binding.getContexts()
				.map(function (value, path) {
					return that._oModel.getProperty(value.sPath);
				});
		},

		/**
		 * check partners we have, whether obeying the countlow and counthigh restriction
		 * @return {boolean}
		 */
		checkPartner: function() {
			var todoData = this.getTodoData();
			return (todoData.toFill.length + todoData.exceeded.length) === 0;
		},

		onCheckValid: function(sChannel, sEvent, oData) {
			var todoData = this.getTodoData();
			var messageManager = sap.ui.getCore().getMessageManager();
			var sPath = 'step/partner';
			messageManager.removeMessages(this._oModel.getMessagesByPath(sPath) || []);
			if ((todoData.toFill.length + todoData.exceeded.length) !== 0) {
				var toFillInfo = "You need to fill in another ";
				for (var key in todoData.toFill) {
					toFillInfo = toFillInfo + todoData.toFill[key].Description + " ";
				}
				messageManager.addMessages(
					new sap.ui.core.message.Message({
						message: toFillInfo,
						type: sap.ui.core.MessageType.Error,
						target: sPath,
						processor: this._oModel
					})
				);
			} else {
				oData.WhenValid.resolve();
			}
		}
	});
});
