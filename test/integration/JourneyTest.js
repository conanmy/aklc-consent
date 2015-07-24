sap.ui.require(
	[
		"sap/ui/test/Opa5"
	],
	function(Opa5) {
		"use strict";

		QUnit.module("Process View Initialization");
		opaTest("Should see a global busy indication while loading the metadata", function(Given, When, Then) {
			// Arrange
			Given.onTheAppPage.iStartTheAppWithDelay("#/process/P0/step/STEP1", "5000");

			//Act
			When.onTheAppPage.iLookAtTheScreen();

			// Assertions
			Then.onTheAppPage.iShouldSeeTheProcessViewer().
			and.iShouldSeeTheBusyIndicator().
			and.iShouldBeOnProcessStep("P0", "STEP1");
		});

		QUnit.module("Process View Action Navigation");
		opaTest("Should navigate to the second step", function(Given, When, Then) {

			//Act
			When.onTheAppPage.iPressNextAction();

			// Assert
			Then.onTheAppPage.iShouldBeOnProcessStep("P0", "STEP2");
		});

		opaTest("Should navigate back to the first step", function(Given, When, Then) {

			//Act
			When.onTheAppPage.iPressPreviousAction();

			// Assert
			Then.onTheAppPage.iShouldBeOnProcessStep("P0", "STEP1");
		});

		opaTest("Should navigate to the third step", function(Given, When, Then) {

			//Act
			When.onTheAppPage.iPressOnNavBarIcon();

			// Assert
			Then.onTheAppPage.iShouldBeOnProcessStep("P0", "STEP3").
			and.iTeardownMyAppFrame();
		});


	});
