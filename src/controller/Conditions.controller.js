sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.Conditions", {
        saveIt: function(oEvent) {
            var targetContext = oEvent.getSource().getBindingContext();
            targetContext.oModel.submitChanges();
        }
    });
});
