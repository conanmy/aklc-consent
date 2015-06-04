/*!
 * ${copyright}
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, ResourceModel, ODataModel) {
    "use strict";

    return UIComponent.extend("scenario.xmlview.Component", {

        metadata: {
            "rootView": "scenario.xmlview.view.App",
            "dependencies": {
                "minUI5Version": "1.28.0",
                "libs": ["sap.ui.core", "sap.m", "sap.ui.layout"]
            },

            "config": {
                "i18nBundle": "scenario.xmlview.i18n.i18n",
                "serviceUrl": "here/goes/your/serviceUrl/"
            }
        },

        createContent: function() {
            var oModel = new ODataModel(this.getMetadata().getConfig().serviceUrl, {
                useBatch: false
            });
            this.setModel(oModel);
            var oLayout =new sap.ui.layout.VerticalLayout();

            // in callback handler map OData to JSon Model - Workaround till know more
            var handler = function(oEvent) {
                var mapCallback = function(oContext) {
                    var oData = jQuery.extend({}, oContext.getObject());
                    var aLookup = oData.Lookup.__list;
                    oData.Path = oContext.getPath();
                    oData.Lookup = aLookup.map(function(sPath) {
                        return oModel.getContext('/' + sPath).getObject();
                    });
                    return oData;
                };

                oBinding.detachChange(handler);

                //map fields collection to json format
                var aFields = oEvent.oSource.getContexts().map(mapCallback);
                var oViewModel = new sap.ui.model.json.JSONModel({
                    Fields: aFields
                });

                // Create view passing the JSON Model
                var oDetailView = sap.ui.view({
                    preprocessors: {
                        xml: {
                            models: {
                                vm: oViewModel
                            }
                        }
                    },
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "scenario.xmlview.view.Detail"
                });
                oDetailView.setModel(oModel);
                // oLayout.addItem(oDetailView);
                oLayout.addContent(oDetailView);
            };

            // Call OData service to get the Fields entity with Lookup Value inlined
            var oBinding = oModel.bindList("/Fields", null, null, null, {
                expand: "Lookup"
            }).initialize();
            oBinding.attachRefresh(function() {
                oBinding.getContexts();
            });
            oBinding.attachChange(handler);

            return oLayout;
        }


    });

});
