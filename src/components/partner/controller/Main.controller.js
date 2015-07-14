sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("aklc.cm.components.partner.controller.Main", {
        _oViewRegistry: [],

        onInit: function() {
            var that = this;
            var container = that.getView().byId("splitContainer");
            var basePath = "aklc.cm.components.partner.view.";
            container.addContent(that._getView(basePath + "SelectList"));
            that.getOwnerComponent().getEventBus().subscribe(
                'SelectList',
                'selected',
                function(sChannel, sEventId, oParams) {
                    container.removeAllContent();
                    var nameList = that._getView(basePath + "NameSelectList");
                    nameList.bindElement(oParams.path);
                    container.addContent(nameList);
                }
            );

            that.getOwnerComponent().getEventBus().subscribe(
                "NameSelectList",
                "goBack",
                function() {
                    container.removeAllContent();
                    container.addContent(
                        that._getView(basePath + "SelectList")
                    );
                }
            );

            that.getOwnerComponent().getEventBus().subscribe(
                "PartnerList",
                "selected",
                function(sChannel, sEventId, oParams) {
                    var nameList = that._getView(basePath + "NameSelectList");
                    var path = oParams.path;
                    var numberMark = "PartnerNumber=";
                    var codeMark = "PartnerFunctionCode=";
                    var PartnerNumber = path.substring(
                        path.indexOf(numberMark) + numberMark.length,
                        path.indexOf(")")
                    ) - 0;
                    var PartnerFunctionCode = path.substring(
                        path.indexOf(codeMark) + codeMark.length,
                        path.indexOf(",PartnerNumber")
                    ) - 0;
                    nameList.bindElement(
                        "/PartnerFunctions(" + PartnerFunctionCode + ")"
                    );
                    container.removeAllContent();
                    container.addContent(nameList);
                    var partnerObject = nameList.byId("partnerObject");
                    // partnerObject.bindElement(
                        // "/PartnerRelations(PartnerNumber="
                            // + PartnerNumber + ",PartnerFunctionCode="
                            // + PartnerFunctionCode + ")/Partners"
                    // );
                    partnerObject.setVisible(true);
                }
            );
        },

        _getView: function(sStepViewName) {
            //TODO: refactor to application controller
            if (this._oViewRegistry[sStepViewName]) {
                return this._oViewRegistry[sStepViewName];
            }
            var oViewData = {
                oComponent: this.getComponent()
            };

            var oView = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: sStepViewName,
                viewData: oViewData
            });

            this._oViewRegistry[sStepViewName] = oView;

            return oView;
        }
    });
});