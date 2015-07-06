sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.SelectList", {
        onInit: function(evt) {
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
            this.oView.oViewData.oComponent.getEventBus().publish(
                'SelectList',
                'selected',
                {path: itemPath}
            );
            this.targetList.removeSelections();
        }
    });
});