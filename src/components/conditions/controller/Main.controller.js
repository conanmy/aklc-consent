sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
	"use strict";
	return BaseController.extend("aklc.cm.components.conditions.controller.Main", {
		saveIt: function(oEvent) {
			var targetContext = oEvent.getSource().getBindingContext();
			targetContext.oModel.submitChanges();
		}
	});
});
