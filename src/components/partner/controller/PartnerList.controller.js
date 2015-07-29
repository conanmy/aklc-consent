sap.ui.define(
	["aklc/cm/controller/BaseController", "sap/ui/model/json/JSONModel"],
	function(BaseController, JSONModel) {
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

		getViolationData: function() {
			var partnerFunctions = this._oModel.getProperty("/PartnerFunctions");
			var partners = this._oModel.getProperty("/AssignedPartners");

			var partnerCount = {};
			for (var i = 0, partner; partner = partners[i++]; ) {
				if (partnerCount[partner.partnerFunctionCode]) {
					partnerCount[partner.partnerFunctionCode] ++;
				} else {
					partnerCount[partner.partnerFunctionCode] = 0;
				}
			}

			var violationData = {
				toFill: [],
			    exceeded: []
			};
			for (var i = 0, func; func = partnerFunctions[i++]; ) {
				var count = 0;
				if (parnerCount[func.partnerFunctionCode]) {
					count = parnerCount[func.partnerFunctionCode];
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

		checkPartnerNumber: function() {
			var violationData = this.getViolationData();
			return (violationData.toFill.length + violationData.exceeded.length) === 0;
		}
	});
});
