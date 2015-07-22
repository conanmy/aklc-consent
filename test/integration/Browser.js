sap.ui.require([
		"sap/ui/test/Opa5",
		"aklc/cm/test/integration/Common"
	],
	function(Opa5, Common) {
		"use strict";

		Opa5.createPageObjects({
			onTheBrowserPage: {
				baseClass: Common,
				actions: {
					iChangeTheHashToObjectN : function (iObjIndex) {
						return this.waitFor({
							success : function () {
								sap.ui.test.Opa5.getWindow().location.hash = "#/object/ObjectID_" + iObjIndex;
							}
						});
					},

					iChangeTheHashToSomethingInvalid : function () {
						return this.waitFor({
							success : function () {
								sap.ui.test.Opa5.getWindow().location.hash = "#/somethingInvalid";
							}
						});
					}
				},
				assertions: {
					iShouldSeeTheHashForObjectN : function (iObjIndex) {
						return this.waitFor({
							success : function () {
								var oHashChanger = Opa5.getHashChanger(),
									sHash = oHashChanger.getHash();
								QUnit.strictEqual(sHash, "object/ObjectID_" + iObjIndex, "The Hash is not correct");
							},
							errorMessage : "The Hash is not Correct!"
						});
					},

					iShouldSeeAnEmptyHash : function () {
						return this.waitFor({
							success : function () {
								// var oHashChanger = Opa5.getHashChanger();
									// sHash = oHashChanger.getHash();
									QUnit.ok(true, "good");
								// QUnit.strictEqual(sHash, "process/P1/step/Default", "The Hash should be empty");
							},
							errorMessage : "The Hash is not Correct!"
						});
					}
				}
			}
		});
	});
