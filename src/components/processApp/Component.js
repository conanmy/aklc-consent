sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/thirdparty/URI",
	"./Router",
	"sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, URI, Router, ODataModel) {
	"use strict";
	return UIComponent.extend("aklc.cm.components.processApp.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * [init description]
		 */
		init: function() {
			// PhantomJS didnt like the retrofitted model logic
			var oMetadata = this.getMetadata();
			var oAppManifest = oMetadata.getManifestEntry("sap.app", true);
			var oUI5Manifest = oMetadata.getManifestEntry("sap.ui5", true);

			var oModel = new ODataModel(
				oAppManifest.dataSources.processApi.uri,
				oUI5Manifest.models[""].settings);
			this.setModel(oModel);

			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});

});
