sap.ui.define([
	"sap/ui/base/Object"
], function(Ui5Object) {
	"use strict";
	return Ui5Object.extend("aklc.cm.test.integration.AllJourneys", {
		start: function(oConfig) {
			oConfig = oConfig || {};

			jQuery.sap.require("sap.ui.qunit.qunit-css");
			jQuery.sap.require("sap.ui.thirdparty.qunit");
			jQuery.sap.require("sap.ui.test.opaQunit");
			jQuery.sap.require("sap.ui.test.Opa5");

			// common functionality
			jQuery.sap.require("aklc.cm.test.integration.components.Common");

			// components
			jQuery.sap.require("aklc.cm.test.integration.components.ProcessApp");

			// journeys
			jQuery.sap.require("aklc.cm.test.integration.JourneyTest");
		}
	});
});
