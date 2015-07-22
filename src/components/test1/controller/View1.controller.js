sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
	"use strict";
	return BaseController.extend("aklc.cm.components.test1.controller.View1", {
		onInit: function() {
			BaseController.prototype.onInit.apply(this);
		},

		onContextChanged: function(sChannel, sEvent, oData) {
			this.getView().setBindingContext(oData.context);
		},

		onCheckValid: function(sChannel, sEvent, oData) {
			return false;
		}
	});
});
