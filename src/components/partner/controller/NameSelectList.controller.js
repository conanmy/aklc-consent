sap.ui.define(["aklc/cm/controller/BaseController", "sap/m/MessageBox"],
	function(BaseController, MessageBox) {
		"use strict";
		return BaseController.extend("aklc.cm.components.partner.controller.NameSelectList", {
			sCollection: "/Partners",
			sExpand: "PartnerRelations",
			selectedPath: null,  // mark selected item in PartnerRelation
			currentBindingPath: null,  // mark selected item in AssignedPartners

			onInit: function(oEvent) {
				this.oList = this.getView().byId("nameSelectList");
			},

			onSearch: function(oEvent) {

				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var oFilter = new sap.ui.model.Filter(
						"Partners/FirstName",
						sap.ui.model.FilterOperator.Contains,
						sQuery
					);
					aFilters.push(oFilter);
				}

				// update list binding
				var oBinding = this.oList.getBinding("items");
				oBinding.filter(aFilters);
			},

			onSelectionChange: function(oEvent) {

				var listItem = oEvent.getParameters().listItem;
				var itemPath = listItem.getBindingContextPath();
				this.selectedPath = itemPath;

				this.getView().byId("partnerDetails").bindElement(itemPath).setVisible(true);
			},

			goBack: function() {
				this.oView.oViewData.oComponent.getEventBus().publish(
					"NameSelectList",
					"goBack"
				);
				this.reset();
			},

			onSave: function() {
				var oModel = this.getView().getModel();
				var partnerRelation = oModel.getProperty(this.selectedPath);

				var ValidFrom = this.getView().byId("DPValidFrom").getValue();
				var ValidTo = this.getView().byId("DPValidTo").getValue();
				if (!ValidTo || !ValidFrom) {
					MessageBox.alert("You should select the valid dates.");
					return false;
				}

				var partnerData = {
					PartnerNumber: partnerRelation.PartnerNumber,
					PartnerFunctionCode: partnerRelation.PartnerFunctionCode,
					ProcessKey: "P1",
					ValidFrom: new Date(ValidFrom),
					ValidTo: new Date(ValidTo)
				};
				if (!this.currentBindingPath) {
					partnerData.Mandatory = false;
					partnerData.Readonly = false;
					partnerData.Unassigned = false;
					var newGuid = function() {
						return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
							var r = Math.random() * 16 | 0,
							v = c === 'x' ? r : (r & 0x3 | 0x8);
							return v.toString(16);
						});
					};
					var sPath = oModel.createKey("/AssignedPartners", {Guid: newGuid()});
					oModel.createEntry(
						sPath, {
							properties: partnerData
						}
					);
				} else {
					partnerData.Unassigned = false;
					oModel.update(
						this.currentBindingPath, partnerData
					);
				}

				this.goBack();
			},

			reset: function() {
				this.getView().byId("partnerDetails").unbindElement();
				this.getView().byId("partnerDetails").setVisible(false);
				this.getView().byId("nameSelectSection").setVisible(true);
				this.oList.removeSelections();
				this.currentBindingPath = null;
			}
		});
	});
