sap.ui.require([
		"sap/ui/test/Opa5",
		"test/integration/components/Common"
	],
	function(Opa5, Common) {
		"use strict";

		var baseViewPath = "aklc.cm.components.partner.view.",
			sAppControl = "ProcessViewer";

		Opa5.createPageObjects({
			onPartnerStep: {
				baseClass: Common,
				///ACTIONS///
				actions: {

				},
				///ASSERTIONS///
				assertions: {
					iShouldSeeThePartnerList: function() {
						return this.waitFor({
							viewName: baseViewPath + "PartnerList",
							id: "partnerList",
							success: function(partnerList) {
								QUnit.ok(partnerList, "Found the partnerList.");
							},
							errorMessage: "cannot see partnerList"
						});
					}
				}
			}
		});
	});
