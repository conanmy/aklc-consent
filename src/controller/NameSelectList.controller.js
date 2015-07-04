sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.NameSelectList", {
        onInit: function(oEvent) {},

        onSearch: function(oEvent) {

            // add filter for search
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new sap.ui.model.Filter(
                    "FirstName",
                    sap.ui.model.FilterOperator.Contains,
                    sQuery
                );
                aFilters.push(filter);
            }

            // update list binding
            var list = this.getView().byId("idList");
            var binding = list.getBinding("items");
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
        }
    });
});