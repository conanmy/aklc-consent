sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.NameSelectList", {
        sCollection: "/Partners",
        sExpand: "PartnerRelations",
        
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
            oBinding.filter(aFilters); //, "Application");
        },

        onSelectionChange: function(oEvent) {

            var oItem = oEvent.getParameters().listItem;
            var sPath = oItem.getBindingContextPath();
            this.oView.oViewData.oComponent.getEventBus().publish(
                "NameSelectList",
                "selected",
                {path: sPath}
            );
            this.oList.removeSelections();
        },

        goBack: function() {
            this.oView.oViewData.oComponent.getEventBus().publish(
                "NameSelectList",
                "backButtonPressed"
            );
        }
    });
});