sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("aklc.cm.components.partner.controller.PartnerList", {
        onListItemPress: function(oEvent) {
            var itemPath = oEvent.oSource.getBindingContextPath();
            this.getOwnerComponent().getEventBus().publish(
                "PartnerList",
                "selected",
                {
                    path: itemPath
                }
            );
        },
        handleDelete: function(oEvent) {
            var oModel = oEvent.getSource().getBindingContext().oModel;
            var itemPath = oEvent.getParameters().listItem.getBindingContextPath();
            oModel.remove(itemPath);
        }
    });
});
