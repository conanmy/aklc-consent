sap.ui.define([
	"sap/ui/core/UIComponent",
	"./Router"
], function(UIComponent, Router) {
	"use strict";
	return UIComponent.extend("aklc.cm.components.processApp.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * [init description]
		 */
		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});

});
