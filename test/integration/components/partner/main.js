sap.ui.define([], function() {

	module("Controls by id");

	opaTest("Should find a control with id selectList", function(Given, When, Then) {

		Given.iStartMyAppInAFrame("./components/partner/index.html");

		When.waitFor({
			viewName: "aklc.cm.components.partner.controller.SelectList",
			id: "selectList",
			success: function(aLists) {
				ok(true, "Found the list: " + aLists[0]);
			},
			errorMessage: "Did not find the list"
		});

		Then.iTeardownMyAppFrame();
	});
});
