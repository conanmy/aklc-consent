sap.ui.require(
	[
		"sap/ui/test/Opa5",
		"aklc/cm/test/integration/Common"
	],
	function(Opa5) {
		"use strict";

		QUnit.module("Process View Journey");

		opaTest("Should see the process viewer", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp();

			//Actions
			When.iLookAtTheScreen();

			// Assertions
			Then.iShouldSeeAnEmptyHash();
		});
	});
