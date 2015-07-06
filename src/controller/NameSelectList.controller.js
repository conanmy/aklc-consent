sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.NameSelectList", {
        onInit: function(oEvent) {
            this.targetList = this.getView().byId("nameSelectList");
        },

        onSearch: function(oEvent) {

            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new sap.ui.model.Filter(
                    "Partners/FirstName",
                    sap.ui.model.FilterOperator.Contains,
                    sQuery
                );
                aFilters.push(filter);
            }

            // update list binding
            var binding = this.targetList.getBinding("items");
            binding.filter(aFilters, "Application");
        },

        onSelectionChange: function(oEvent) {

            var listItem = oEvent.getParameters().listItem;
            var itemPath = listItem.getBindingContextPath();
            this.oView.oViewData.oComponent.getEventBus().publish(
                'NameSelectList',
                'selected',
                {path: itemPath}
            );
            this.targetList.removeSelections();
        }
    });
});