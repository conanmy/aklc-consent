sap.ui.define([
        'sap/ui/core/UIComponent'
    ],
    function(UIComponent) {
        "use strict";

        var Component = UIComponent.extend("aklc.cm.components.partner.Component", {

            metadata: {
                rootView: "aklc.cm.components.partner.view.Main",
                dependencies: {
                    version: "1.8",
                    libs: ["sap.ui.core"]
                },
                includes: ["css/PageFixer.css"],
                properties: {
                    componentData: "",
                    eventBusSubscription: {
                        name: "eventBusSubscription",
                        type: "object",
                        defaultValue: {
                            channel: "partner",
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
