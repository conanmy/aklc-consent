sap.ui.define([
		"sap/ui/core/UIComponent"
	],
	function(UIComponent) {
		"use strict";

		var Component = UIComponent.extend("aklc.cm.components.test1.Component", {
			"metadata": {
				// manifest: "json",
				"rootView": "aklc.cm.components.test1.view.Main",
				"dependencies": {
					"includes": ["css/FormFixer.css"],
					"libs": ["sap.m",
						"sap.ui.layout",
						"sap.ui.commons",
						"sap.ui.ux3"
					],
					"components": []
				},
				"config": {
					"resourceBundle": "i18n/i18n.properties"
				},
				"properties": { //TODO manifest property bag
					"componentData": {},
					"eventBusSubscription": {
						"name": "eventBusSubscription",
						"type": "object",
						"defaultValue": {
							"channel": "test1",
							"events": {
								"contextChanged": "contextChanged",
								"checkValid": "checkValid"
							}
						}
					}
				}
			},

			init: function() {
				var mConfig = this.getMetadata().getConfig();
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: [this.getRootPath(), mConfig.resourceBundle].join("/")
				});

				this.setModel(i18nModel, "i18n");

				var oComponentData = this.getComponentData();
				if (oComponentData) {
					this._oEventBus = oComponentData.eventBus;
					this.setModel(oComponentData.model);
				}

				UIComponent.prototype.init.apply(this);

			},

			getRootPath: function() {
				if (!this.rootPath) {
					this.rootPath = jQuery.sap.getModulePath("aklc.cm.components.test1");
				}
				return this.rootPath;
			}
		});

		return Component;
	});
