sap.ui.define([
		"sap/ui/test/Opa5"
	],
	function(Opa5) {
		"use strict";

		return Opa5.extend("aklc.cm.test.integration.Common", {
			constructor: function(oConfig) {
				Opa5.apply(this, arguments);
				this._oConfig = oConfig;
			},

			_getFrameUrl: function(sHash, sUrlParameters) {
				sHash = sHash || "";
				var sUrl = jQuery.sap.getResourcePath("aklc/cm/app/test", ".html");

				sUrlParameters = "?" + (sUrlParameters ? sUrlParameters + "&" : "");
				return sUrl + sUrlParameters + sHash;
			},

			iStartTheApp: function(sHash) {
				this.iStartMyAppInAFrame(this._getFrameUrl(sHash));
			},

			iStartTheAppWithDelay: function(sHash, iDelay) {
				this.iStartMyAppInAFrame(this._getFrameUrl(sHash, "serverDelay=" + iDelay));
			},

			iLookAtTheScreen: function() {
				return this;
			},

			iShouldSeeProcessViewer: function() {
				return this.waitFor({
					id: "__xmlview0--TI",
					success: function(oProcessViewer) {
						ok(true, "good");
					},
					errorMessage: "bad"
				});
			},

			iShouldSeeAnEmptyHash: function() {
				return this.waitFor({
					success: function() {
						ok(true, "good");
						// var oHashChanger = Opa5.getHashChanger(),
						// 	sHash = oHashChanger.getHash();
						// QUnit.strictEqual(sHash, "process/P1/step/Default", "The Hash should be empty");
					},
					errorMessage: "The Hash is not Correct!"
				});
			}

		});
	});
