sap.ui.define([
	"sap/ui/base/Object"
], function (Ui5Object) {
	return Ui5Object.extend("aklc.cm.test.integration.AllJourneys", {
		start: function (oConfig) {
			oConfig = oConfig || {};

			jQuery.sap.require("sap.ui.qunit.qunit-css");
			jQuery.sap.require("sap.ui.thirdparty.qunit");
			jQuery.sap.require("sap.ui.qunit.qunit-junit");
			jQuery.sap.require("sap.ui.test.opaQunit");
			jQuery.sap.require("sap.ui.test.Opa5");

			jQuery.sap.require("aklc.cm.test.integration.common");

		}
	});
});