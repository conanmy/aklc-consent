sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("aklc.cm.controller.PartnerList", {
        onListItemPress: function(oEvent) {},
        handleDelete: function(oEvent) {
            var oModel = oEvent.getSource().getBindingContext().oModel;
            var itemPath = oEvent.getParameters().listItem.getBindingContextPath();
            oModel.remove(itemPath);
        }
    });
});
