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

			// 		var oMetadata = this.getMetadata();
			// var oAppManifest = oMetadata.getManifestEntry("sap.app", true);
			// var oUI5Manifest = oMetadata.getManifestEntry("sap.ui5", true);
			// var oModel = new ODataModel(
			// 	oAppManifest.dataSources.processApi.uri,
			// 	oUI5Manifest.models[""].settings);
			// this.setModel(oModel);
			// UIComponent.prototype.init.apply(this, arguments);
			// this.getRouter().initialize();
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});

});
