jQuery.sap.registerModulePath("openui5", [jQuery.sap.getModulePath("scenario.xmlview"), "library/openui5"].join("/"));

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v2/ODataModel",
    "openui5/ckeditor/CKEditorToolbar",
    "scenario/xmlview/Router",
], function(UIComponent, ResourceModel, ODataModel, CKEditorToolbar) {
    "use strict";

    return UIComponent.extend("scenario.xmlview.Component", {

        metadata: {
            "rootView": "scenario.xmlview.view.Main",
            "includes": ["css/ThreePanelViewer.css", "css/VerticalNavigationBar.css", "css/FormFixer.css"],
            "dependencies": {
                "minUI5Version": "1.28.0",
                "libs": []
            },

            "config": {
                "i18nBundle": "scenario.xmlview.i18n.i18n",
                "serviceUrl": "here/goes/your/serviceUrl/"
            },

            "routing": {
                "config": {
                    "routerClass": "scenario.xmlview.Router"
                },
                "routes": [{
                    "pattern": "",
                    "name": "empty"
                }, {
                    "pattern": "process/{processkey}/step/{stepkey}",
                    "name": "process",
                }]
            }
        },

        init: function() {
            CKEditorToolbar.myToolbar = [
                ['Source'],
                ['Cut', 'Copy', 'Paste', 'PasteText'],
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['BulletedList', 'NumberedList', 'Blockquote']
            ];

            var oModel = new ODataModel(this.getMetadata().getConfig().serviceUrl, {
                useBatch: false
            });
            this.setModel(oModel);

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }

    });

});
