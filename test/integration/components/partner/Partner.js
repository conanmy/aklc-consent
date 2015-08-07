sap.ui.require([
		"sap/ui/test/Opa5",
		"test/integration/components/Common"
	],
	function(Opa5, Common) {
		"use strict";

		var baseViewPath = "aklc.cm.components.partner.view.";

		Opa5.createPageObjects({
			onPartnerStep: {
				baseClass: Common,
				///ACTIONS///
				actions: {
					iPressOnSelectListItem: function() {
						return this.waitFor({
							viewName: baseViewPath + "SelectList",
							controlType: "sap.m.StandardListItem",
							success: function(aItems) {
								aItems[0].$().trigger("tap");
							},
							errorMessage: "Did not find the icon"
						});
					}
				},
				///ASSERTIONS///
				assertions: {
					iShouldSeeThePartnerList: function() {
						return this.waitFor({
							viewName: baseViewPath + "PartnerList",
							controlType: "aklc.cm.components.partner.controls.PartnerObjectListItem",
							success: function(partnerList) {
								QUnit.ok(partnerList.length > 0, "Found the partnerList with content.");
							},
							errorMessage: "cannot see partnerList"
						});
					},
					iShouldSeeTheSelectList: function() {
						return this.waitFor({
							viewName: baseViewPath + "SelectList",
							controlType: "sap.m.StandardListItem",
							success: function(selectList) {
								QUnit.ok(selectList.length > 0, "Found the selectList with content.");
							},
							errorMessage: "cannot see selectList"
						});
					},
					iShouldSeeTheNameSelectList: function() {
						return this.waitFor({
							viewName: baseViewPath + "NameSelectList",
							controlType: "sap.m.StandardListItem",
							success: function(nameSelectList) {
								QUnit.ok(nameSelectList.length > 0, "Found the nameSelectList with content.");
							},
							errorMessage: "cannot see nameSelectList"
						});
					}
				}
			}
		});
	});
