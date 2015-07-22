sap.ui.define([
	"sap/ui/base/Object",
	"aklc/cm/test/integration/Common"
], function(Ui5Object, Common) {
	"use strict";
	return Ui5Object.extend("aklc.cm.test.integration.AllJourneys", {
		start: function(oConfig) {
			oConfig = oConfig || {};

			jQuery.sap.require("sap.ui.qunit.qunit-css");
			jQuery.sap.require("sap.ui.thirdparty.qunit");
			jQuery.sap.require("sap.ui.qunit.qunit-junit");
			jQuery.sap.require("sap.ui.test.opaQunit");
			jQuery.sap.require("sap.ui.test.Opa5");

			jQuery.sap.require("aklc.cm.test.integration.Common");
			jQuery.sap.require("aklc.cm.test.integration.Browser");
			jQuery.sap.require("aklc.cm.test.integration.JourneyTest");
			// jQuery.sap.require("aklc.cm.test.integration.components.partner.main");

			var x = new Common(oConfig);

			sap.ui.test.Opa5.extendConfig({
				actions: x,
				arrangements: x,
				assertions: x
			});
		}
	});
});
