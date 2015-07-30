sap.ui.define(["aklc/cm/library/common/controller/BaseController"], function(BaseController) {
	"use strict";
	return BaseController.extend("aklc.cm.components.partner.controller.SelectList", {
		onInit: function(evt) {
			BaseController.prototype.onInit.apply(this);
			this.targetList = this.getView().byId("selectList");
		},

		onSearch: function(oEvt) {

			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter(
					"Description",
					sap.ui.model.FilterOperator.Contains,
					sQuery
				);
				aFilters.push(filter);
			}

			// update list binding
			var binding = this.targetList.getBinding("items");
			binding.filter(aFilters, "Application");
		},

		onSelectionChange: function(oEvt) {

			var listItem = oEvt.mParameters.listItem;
			var itemPath = listItem.getBindingContextPath();
			this.getEventBus().publish(
				"SelectList",
				"selected", {
					path: itemPath
				}
			);
			this.targetList.removeSelections();
		}
	});
});
