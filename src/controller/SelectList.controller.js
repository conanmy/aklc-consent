sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.SelectList", {
        onInit: function(evt) {},

        onSearch: function(oEvt) {

            // add filter for search
            var aFilters = [];
            var sQuery = oEvt.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new sap.ui.model.Filter("Function", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            // update list binding
            var list = this.getView().byId("idList");
            var binding = list.getBinding("items");
            binding.filter(aFilters, "Application");
        },

        onSelectionChange: function(oEvt) {

            var oList = oEvt.getSource();
            var oLabel = this.getView().byId("idFilterLabel");
            var oInfoToolbar = this.getView().byId("idInfoToolbar");

            // With the 'getSelectedContexts' function you can access the context paths
            // of all list items that have been selected, regardless of any current
            // filter on the aggregation binding.
            var aContexts = oList.getSelectedContexts(true);

            // update UI
            var bSelected = (aContexts && aContexts.length > 0);
            var sText = (bSelected) ? aContexts.length + " selected" : null;
            oInfoToolbar.setVisible(bSelected);
            oLabel.setText(sText);
        }
    });
});