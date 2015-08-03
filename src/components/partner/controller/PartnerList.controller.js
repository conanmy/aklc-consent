sap.ui.define(
	["aklc/cm/library/common/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
	function(BaseController, JSONModel, MessageBox) {
		"use strict";
		return BaseController.extend("aklc.cm.components.partner.controller.PartnerList", {
			sCollection: "AssignedPartners",
			sExpand: "PartnerRelations",
			sProcesKey: "",
			onInit: function(oEvent) {
				BaseController.prototype.onInit.apply(this);
				this.oList = this.getView().byId("partnerList");
				this.getEventBus().subscribe("NameSelectList", "onCreate", this.onCreateEntry, this);
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
			 */
			bindView: function(oContext) {
				if (!oContext) {
					return false;
				}

				this.getView().setBindingContext(oContext);
				this.bindList();
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
				this.getEventBus().publish("PartnerList", "selected", {
					path: itemPath
				});
			},

			/**
			 * [onCreateEntry description]
			 * @param  {[type]} sChannel [description]
			 * @param  {[type]} sEvent   [description]
			 * @param  {[type]} oData    [description]
			 */
			onCreateEntry: function(sChannel, sEvent, oData) {
				var oProperties = jQuery.extend({}, oData);
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
				oModel.remove(itemPath);
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

			checkPartnerNumber: function() {
				var violationData = this.getViolationData();
				return (violationData.toFill.length + violationData.exceeded.length) === 0;
			},

			onCheckValid: function(sChannel, sEvent, oData) {
				return false;
			}
		});
	});
