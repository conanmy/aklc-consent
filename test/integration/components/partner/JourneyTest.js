sap.ui.require(
	[
		"sap/ui/test/Opa5"
	],
	function(Opa5) {
		"use strict";

		QUnit.module("Partner involved");
		opaTest("Should see partner list", function(Given, When, Then) {
			// Arrange
			Given.onPartnerStep.iStartTheAppWithDelay("#/process/P2/step/PARTNERS", "5000");

			//Act
			When.onPartnerStep.iLookAtTheScreen();

			// Assertions
			Then.onPartnerStep.iShouldSeeThePartnerList();
		});

	});
