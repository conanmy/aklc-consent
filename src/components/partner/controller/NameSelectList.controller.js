sap.ui.define(["aklc/cm/controller/BaseController", "sap/m/MessageBox"],
	function(BaseController, MessageBox) {
		"use strict";
		return BaseController.extend("aklc.cm.components.partner.controller.NameSelectList", {
			sCollection: "/Partners",
			sExpand: "PartnerRelations",
			selectedPath: null,

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
					ValidTo: new Date(ValidTo),
					Mandatory: false,
					Readonly: false,
					Unassigned: false
				};
				oModel.create(
					"/AssignedPartners", partnerData
				);

				this.goBack();
			},

			reset: function() {
				this.getView().byId("partnerDetails").unbindElement();
				this.getView().byId("partnerDetails").setVisible(false);
				this.getView().byId("nameSelectSection").setVisible(true);
				this.oList.removeSelections();
			}
		});
	});
