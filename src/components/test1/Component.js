sap.ui.define([
		"sap/ui/core/UIComponent"
	],
	function(UIComponent) {
		"use strict";

		var Component = UIComponent.extend("aklc.cm.components.test1.Component", {
			metadata: {
				manifest: "json",
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
			}
		});

		Component.prototype.init = function() {
			var oComponentData = this.getComponentData();
			if (oComponentData) {
				this._oEventBus = oComponentData.eventBus;
				this.setModel(oComponentData.model);
			}

			UIComponent.prototype.init.apply(this);

		};

		return Component;
	});
