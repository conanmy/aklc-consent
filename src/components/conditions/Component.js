sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/UIComponent',
        'sap/ui/commons/Button'
    ],
    function(jQuery, UIComponent, Button) {
        "use strict";


        // new Component
        var Component = UIComponent.extend("aklc.cm.components.conditions.Component", {

            metadata: {
                rootView: "aklc.cm.components.conditions.view.Main",
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
                            channel: "conditions",
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
