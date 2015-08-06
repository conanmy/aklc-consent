sap.ui.define(["aklc/cm/library/common/controller/BaseController", "sap/m/MessageBox"], function(BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("aklc.cm.components.partner.controller.Main", {
		_oViewRegistry: [],
		sProcesKey: "",
		_basePath: "aklc.cm.components.partner.view.",

		onInit: function() {
			BaseController.prototype.onInit.apply(this);

			var that = this;
			var container = that.getView().byId("splitContainer");
			container.addContent(that._getView(that._basePath + "SelectList"));
			that.getEventBus().subscribe(
				"SelectList",
				"selected",
				function(sChannel, sEventId, oParams) {
					container.removeAllContent();
					var nameList = that._getView(that._basePath + "NameSelectList");
					nameList.bindElement(oParams.path);
					container.addContent(nameList);
				}
			);

			that.getEventBus().subscribe(
				"NameSelectList",
				"goBack",
				function() {
					container.removeAllContent();
					container.addContent(
						that._getView(that._basePath + "SelectList")
					);
				}
			);

			that.getEventBus().subscribe(
				"PartnerList",
				"selected",
				function(sChannel, sEventId, oParams) {
					var path = oParams.path;
					var partner = that._oModel.getProperty(path);
					var nameList = that._getView(that._basePath + "NameSelectList");

					var nameListController = nameList.getController();
					if (nameListController) {
						nameListController.reset();
					}

					if (!that.isInNameSelectList()) {
						container.removeAllContent();
						container.addContent(nameList);
					}

					nameList.bindElement(
						"/PartnerFunctions(" + partner.PartnerFunctionCode + ")"
					);
					if (!partner.Unassigned) {
						nameList.byId("partnerDetails").bindElement(path);
						nameList.byId("partnerDetails").setVisible(true);
						if (partner.Readonly) {
							nameList.byId("nameSelectSection").setVisible(false);
						}
					}
				}
			);
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
			return this.getView().byId("splitContainer").getContent()[0].sViewName === (this._basePath + "NameSelectList");
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
