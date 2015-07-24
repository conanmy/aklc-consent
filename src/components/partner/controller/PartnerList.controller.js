sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
	"use strict";
	return BaseController.extend("aklc.cm.components.partner.controller.PartnerList", {
		onListItemPress: function(oEvent) {
			var itemPath = oEvent.oSource.getBindingContextPath();
			this.getEventBus().publish(
				"PartnerList",
				"selected", {
					path: itemPath
				}
			);
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

		/**
		 * onCheckValid
		 * we need to return false when validation not needed for this part
		 * but needed for other parts of the module.
		 * as in baseController the default action is resolve
		 * so the promise will be resolved if any part is default
		 */
		onCheckValid: function(sChannel, sEvent, oData) {
			return false;
		}
	});
});
