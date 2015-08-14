sap.ui.define(
	["aklc/cm/library/common/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
	function(BaseController, JSONModel, MessageBox) {
		"use strict";
		return BaseController.extend("aklc.cm.components.partner.controller.PartnerList", {
			sCollection: "AssignedPartners",
			// sExpand: "PartnerRelations",
			sProcesKey: "",
			currentSelection: {
				path: null,
				active: false
			},
			onInit: function(oEvent) {
				var that = this;
				BaseController.prototype.onInit.apply(that);
				that.oList = that.getView().byId("partnerList");
				that._triggeredCheck = false;

				that.getEventBus().subscribe(
					"NameSelectList",
					"save",
					that.onSave,
					that
				);
				that.getEventBus().subscribe(
					"NameSelectList",
					"goBack",
					function() {
						that.currentSelection.active = false;
					}
				);
			},

			/**
			 * On Context change need to get Assigned Partners relative to process
			 * @param  {[type]} sChannel [description]
			 * @param  {[type]} sEvent   [description]
			 * @param  {[type]} oData    [description]
			 */
			onContextChanged: function(sChannel, sEvent, oData) {
				this.sProcesKey = this._oModel.getProperty("ProcessKey", oData.context);
				this.sPath = this._oModel.createKey("/Process", {
					ProcessKey: this.sProcesKey
				});
				this.getData();
			},

			/**
			 * get Data
			 */
			getData: function() {
				var fnCallback = this.bindView.bind(this);
				var oParams = {
					expand: this.sCollection
				};

				this._oModel.createBindingContext(this.sPath, null, oParams, fnCallback);
			},

			/**
			 * call back from getdata, passes a context for the data, this should be bound to view
			 * @param  {Object} oContext newly create data context
			 * @return false
			 */
			bindView: function(oContext) {
				if (!oContext) {
					return false;
				}

				this.getView().setBindingContext(oContext);
				// this.bindList();
			},

			/**
			 * bindlist again to get new values
			 */
			bindList: function() {
				if (!this.oTemplate) {
					this.oTemplate = this.oList.getItems()[0].clone();
				}

				var oParams = {
					expand: "Partners,PartnerFunctions",
					operationMode: "Client"
				};
				this._oModel.sDefaultOperationMode = "Client";
				this.oList.bindItems(this.sCollection, this.oTemplate, null, null, oParams);
				this._oModel.sDefaultOperationMode = "Server";
			},

			/**
			 * [onListItemPress description]
			 * @param  {[type]} oEvent [description]
			 */
			onListItemPress: function(oEvent) {
				var itemPath = oEvent.oSource.getBindingContextPath();
				this.currentSelection.path = itemPath;
				this.currentSelection.active = true;

				this.getEventBus().publish("PartnerList", "selected", {
					path: itemPath
				});
			},

			/**
			 * on name select list saves
			 * @param  {[type]} sChannel
			 * @param  {[type]} sEvent
			 * @param  {[type]} newPartner new partner data
			 */
			onSave: function(sChannel, sEvent, newPartner) {
				if (this.currentSelection.active) {
					this.updatePartner(newPartner);
				} else {
					this.createPartner(newPartner);
				}

				this.getEventBus().publish(
					"PartnerList",
					"changed"
				);
			},

			/**
			 * updatePartner
			 * @param  {Object} newPartner
			 */
			updatePartner: function(newPartner) {
				var currentPartner = this._oModel.getProperty(
					this.currentSelection.path
				);
				// set the reference partner
				newPartner.Partners = {};
				newPartner.Partners.__ref = this._oModel.createKey("Partners", {
					PartnerNumber: newPartner.PartnerNumber
				});
				newPartner.Unassigned = false;
				this._oModel.setProperty(
					this.currentSelection.path,
					jQuery.extend(
						currentPartner,
						newPartner
					)
				);
				this._oModel.updateBindings();
			},

			/**
			 * createPartner
			 * @param  {Object} newPartner
			 */
			createPartner: function(newPartner) {
				var oProperties = jQuery.extend({}, newPartner);
				oProperties.Guid = this.Formatter.newGuid();
				oProperties.ProcessKey = this.sProcesKey;
				oProperties.Mandatory = false;
				oProperties.Readonly = false;
				oProperties.Unassigned = false;

				// get guid for new entry
				var sPath = this._oModel.createKey(this.sCollection, {
					Guid: oProperties.Guid
				});

				// set the reference partner
				oProperties.Partners = {};
				oProperties.Partners.__ref = this._oModel.createKey("Partners", {
					PartnerNumber: oProperties.PartnerNumber
				});

				// set the reference partner function
				oProperties.PartnerFunctions = {};
				oProperties.PartnerFunctions.__ref = this._oModel.createKey("PartnerFunctions", {
					PartnerFunctionCode: oProperties.PartnerFunctionCode
				});

				// create entry
				var oContext = this._oModel.createEntry(
					sPath, {
						properties: oProperties
					}
				);

				// add new entry to list
				var aList = this._oModel.getProperty(this.sPath).AssignedPartners.__list;
				aList.push(oContext.getPath().split("/")[1]);
				this.bindList();
			},

			handleDelete: function(oEvent) {
				var oModel = oEvent.getSource().getBindingContext().oModel;
				var itemPath = oEvent.getParameters().listItem.getBindingContextPath();
				var item = oModel.getProperty(itemPath);
				if (!!item.__metadata.created) {
					var oContext = oEvent.getParameters().listItem.getBindingContext();
					oModel.deleteCreatedEntry(oContext);
					this.getData();
				} else {
					oModel.remove(itemPath);
				}
			},

			handleIconTabBarSelect: function(oEvent) {
				var oBinding = this.getView().byId("partnerList").getBinding("items");
				var sKey = oEvent.getParameter("selectedKey");
				var oFilter = null;

				if (sKey === "Active") {
					oFilter = new sap.ui.model.Filter("ValidTo", "GE", new Date());
					oBinding.filter([oFilter]);
				} else if (sKey === "Historic") {
					oFilter = new sap.ui.model.Filter("ValidTo", "LT", new Date());
					oBinding.filter([oFilter]);
				} else {
					oBinding.filter([]);
				}
			},

			onUpdateFinished: function() {
				if (this._triggeredCheck) {
					this.checkUnassigned();
				}
			},

			checkUnassigned: function() {
				var that = this;
				that._triggeredCheck = true;

				this.getView().byId('partnerList').getAggregation('items')
					.map(function(item) {
						if (that._oModel.getProperty(
							item.getBindingContext().sPath
						).Unassigned === true) {
							item.addStyleClass("inerror-list-item");
						} else {
							item.removeStyleClass("inerror-list-item");
						}
					});
			},

			onCheckValid: function(sChannel, sEvent, oData) {
				return false;
			}
		});
	});
