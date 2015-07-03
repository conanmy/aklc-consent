sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.NameSelectList", {
        onInit: function(evt) {},

        onSearch: function(oEvt) {

            // add filter for search
            var aFilters = [];
            var sQuery = oEvt.getSource().getValue();
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

        onSelectionChange: function(oEvt) {

            var listItem = oEvt.mParameters.listItem;
            var itemPath = listItem.getBindingContextPath();
            this.oView.oViewData.oComponent.getEventBus().publish(
                'NameSelectList',
                'selected',
                {path: itemPath}
            );
        }
    });
});