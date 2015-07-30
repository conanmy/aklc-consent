sap.ui.define(["aklc/cm/library/common/controller/BaseController", "sap/m/MessageBox"],
	function(BaseController, MessageBox) {
		"use strict";
		return BaseController.extend("aklc.cm.components.partner.controller.NameSelectList", {
			sCollection: "/Partners",
			sExpand: "PartnerRelations",
			selectedPath: null, // mark selected item in PartnerRelation
			currentBindingPath: null, // mark selected item in AssignedPartners

			onInit: function(oEvent) {
				BaseController.prototype.onInit.apply(this);
				this.oList = this.getView().byId("nameSelectList");

				this.oValidFrom = this.getView().byId("DPValidFrom");
				this.oValidTo = this.getView().byId("DPValidTo");
				this._oToday = new Date();
				this._oForever = new Date(this.oValidTo._oMaxDate._oInnerDate);
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
				this.oValidFrom.setDateValue(this._oToday);
				this.oValidTo.setDateValue(this._oForever);
			},

			goBack: function() {
				this.oView.oViewData.oComponent.getEventBus().publish(
					"NameSelectList",
					"goBack"
				);
				this.reset();
			},

			onSave: function() {
				var partnerRelation = this._oModel.getProperty(this.selectedPath);

				// var ValidFrom = this.getView().byId("DPValidFrom").getValue();
				// var ValidTo = this.getView().byId("DPValidTo").getValue();
				if (!this.oValidTo.getValue() || !this.oValidFrom.getValue()) {
					MessageBox.alert("You should select the valid dates.");
					return false;
				}

				var partnerData = {
					PartnerNumber: partnerRelation.PartnerNumber,
					PartnerFunctionCode: partnerRelation.PartnerFunctionCode,
					ValidFrom: this.oValidFrom.getDateValue(),
					ValidTo: this.oValidTo.getDateValue()
				};
				if (!this.currentBindingPath) {
					this.getEventBus().publish("NameSelectList", "onCreate", partnerData);
					// partnerData.Mandatory = false;
					// partnerData.Readonly = false;
					// partnerData.Unassigned = false;
					// var sPath = this._oModel.createKey("/AssignedPartners", {
					// 	Guid: this.Formatter.newGuid()
					// });
					// this._oModel.createEntry(
					// 	sPath, {
					// 		properties: partnerData
					// 	}
					// );
				} else {
					partnerData.Unassigned = false;
					this._oModel.update(
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
