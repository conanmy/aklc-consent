sap.ui.define([
		"sap/ui/core/UIComponent"
	],
	function(UIComponent) {
		"use strict";
		var Component = UIComponent.extend("aklc.cm.components.test.Component", {

			metadata: {
				rootView: "aklc.cm.components.test.view.Main",
				dependencies: {
					version: "1.8",
					libs: ["sap.ui.core"]
				},
				properties: {
					componentData: "",
					eventBusSubscription: {
						name: "eventBusSubscription",
						type: "object",
						defaultValue: {
							channel: "test",
							events: {
								contextChanged: "contextChanged",
								checkValid: "checkValid"
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
