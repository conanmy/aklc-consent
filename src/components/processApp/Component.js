sap.ui.define([
    "sap/ui/core/UIComponent",
    "./ApplicationController",
    "./Router"
], function(UIComponent, ApplicationController) {
    "use strict";
    var oApplicationController = null;
    return UIComponent.extend("aklc.cm.components.processApp.Component", {

        metadata: {
            "rootView": "aklc.cm.components.processApp.view.Main",
            "includes": ["../../css/ThreePanelViewer.css", "../../css/VerticalNavigationBar.css", "../../css/FormFixer.css"],
            "dependencies": {
                "minUI5Version": "1.28.0",
                "libs": []
            },

            "config": {
                "resourceBundle": "i18n/i18n.properties",
                "serviceConfig": {
                    "name": "namehere",
                    "serviceUrl": "here/goes/your/serviceUrl/"
                }
            },

            "routing": {
                "config": {
                    "routerClass": "aklc.cm.components.processApp.Router"
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

        /**
         * [exit description]
         * @return {[type]} [description]
         */
        exit: function() {
            oApplicationController.exit();
            oApplicationController = null;
        },

        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function() {
            oApplicationController = new ApplicationController(this);
            UIComponent.prototype.init.apply(this, arguments);
            oApplicationController.init();
        },

        /**
         * [getApplicationController description]
         * @return {[type]} [description]
         */
        getApplicationController: function() {
            return oApplicationController;
        }

    });

});
