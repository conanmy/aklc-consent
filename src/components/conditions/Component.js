jQuery.sap.registerModulePath("openui5", [jQuery.sap.getModulePath("aklc.cm"), "library/openui5"].join("/"));
sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/UIComponent',
    ],
    function(jQuery, UIComponent) {
        "use strict";


        // new Component
        var Component = UIComponent.extend("aklc.cm.components.conditions.Component", {

            metadata: {
                rootView: "aklc.cm.components.conditions.view.Main",
                dependencies: {
                    version: "1.8",
                    libs: ["sap.ui.core", "openui5.ckeditor"]
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

            openui5.ckeditor.CKEditorToolbar.myToolbar = [
                ['Source'],
                ['Cut', 'Copy', 'Paste', 'PasteText'],
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['BulletedList', 'NumberedList', 'Blockquote']
            ];


            UIComponent.prototype.init.apply(this);
        };

        return Component;
    });
