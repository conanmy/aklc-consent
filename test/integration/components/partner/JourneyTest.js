sap.ui.require(
	[
		"sap/ui/test/Opa5"
	],
	function(Opa5) {
		"use strict";

		QUnit.module("Partners Involved Initial Screen");
		opaTest("Should see partner list and select list", function(Given, When, Then) {
			// Arrange
			Given.onPartnerStep.iStartTheAppWithDelay("#/process/P2/step/PARTNERS", "5000");

			//Act
			When.onPartnerStep.iLookAtTheScreen();

			// Assertions
			Then.onPartnerStep.iShouldSeeThePartnerList()
			.and.iShouldSeeTheSelectList();
		});

		QUnit.module("Add a partner");
		opaTest("Should see name list after selecting", function(Given, When, Then) {
			//Act
			When.onPartnerStep.iPressOnSelectListItem();

			// Assertions
			Then.onPartnerStep.iShouldSeeTheNameSelectList();
		});

	});
