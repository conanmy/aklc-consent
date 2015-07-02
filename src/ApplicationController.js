sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v2/ODataModel",
    "openui5/ckeditor/CKEditorToolbar",
    "sap/m/BusyDialog",
], function(Object, ResourceModel, ODataModel, CKEditorToolbar, BusyDialog) {
    "use strict";
    // This class is a helper class which is instantiated by each S3 controller. It is used to handle the approval/rejection dialog.
    return Object.extend("scenario.xmlview.ApplicationController", {

        _oComponent: null, // the Component (scenario.xmlview.Component)
        _oResourceBundle: null, // the resource bundle used by this app
        _oModel: null, // the oData model used by this App
        _oInitBusyDialog: null, //Busy Dialog

        /**
         * [constructor description]
         * @param  {[type]} oComponent [description]
         * @return {[type]}            [description]
         */
        constructor: function(oComponent) {
            this._oInitBusyDialog = new BusyDialog();
            // this._oInitBusyDialog.open();
            this._oComponent = oComponent;

            var oComponentConfig = this._oComponent.getMetadata().getConfig();
            var oServiceConfig = oComponentConfig.serviceConfig;
            var sServiceUrl = oServiceConfig.serviceUrl;

            // always use absolute paths relative to our own component
            // (relative paths will fail if running in the Fiori Launchpad)
            var sRootPath = jQuery.sap.getModulePath("scenario.xmlview");

            // set i18n model
            var oI18nModel = new sap.ui.model.resource.ResourceModel({
                bundleUrl: sRootPath + "/" + oComponentConfig.resourceBundle
            });
            this._oComponent.setModel(oI18nModel, "i18n");
            this._oResourceBundle = oI18nModel.getResourceBundle();

            CKEditorToolbar.myToolbar = [
                ['Source'],
                ['Cut', 'Copy', 'Paste', 'PasteText'],
                ['Undo', 'Redo'],
                ['Bold', 'Italic', 'Underline'],
                ['BulletedList', 'NumberedList', 'Blockquote']
            ];

            // set data model
            this._oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
                json: true,
                defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
                useBatch: true,
                defaultCountMode: "Inline",
                loadMetadataAsync: true
            });


            this._oComponent.setModel(this._oModel);
        },

        init: function() {
            this._oRouter = this._oComponent.getRouter();
            this._oRouter.initialize();
        }


    });

}, /* bExport= */ true);