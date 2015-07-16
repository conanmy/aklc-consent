sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("aklc.cm.components.partner.controller.Main", {
        _oViewRegistry: [],
        _basePath: "aklc.cm.components.partner.view.",

        onInit: function() {
            BaseController.prototype.onInit.apply(this);

            var that = this;
            var container = that.getView().byId("splitContainer");
            container.addContent(that._getView(that._basePath + "SelectList"));
            that.getEventBus().subscribe(
                'SelectList',
                'selected',
                function(sChannel, sEventId, oParams) {
                    container.removeAllContent();
                    var nameList = that._getView(that._basePath + "NameSelectList");
                    nameList.bindElement(oParams.path);
                    container.addContent(nameList);
                }
            );

            that.getEventBus().subscribe(
                "NameSelectList",
                "goBack",
                function() {
                    container.removeAllContent();
                    container.addContent(
                        that._getView(that._basePath + "SelectList")
                    );
                }
            );

            that.getEventBus().subscribe(
                "PartnerList",
                "selected",
                function(sChannel, sEventId, oParams) {
                    var path = oParams.path;
                    var codeMark = "PartnerFunctionCode=";
                    var PartnerFunctionCode = path.substring(
                        path.indexOf(codeMark) + codeMark.length,
                        path.indexOf(",PartnerNumber")
                    ) - 0;

                    container.removeAllContent();
                    var nameList = that._getView(that._basePath + "NameSelectList");
                    nameList.bindElement(
                        "/PartnerFunctions(" + PartnerFunctionCode + ")"
                    );
                    container.addContent(nameList);
                    
                    nameList.byId("partnerObject").bindElement(
                        path + "/Partners"
                    );
                    nameList.byId("partnerDates").bindElement(path);
                    nameList.byId("partnerDetails").setVisible(true);
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
        },

        onCheckValid: function(sChannel, sEvent, oData){
            if (this.getView().byId("splitContainer").getContent()[0].sViewName
                === this._basePath + "NameSelectList") {
                if (window.confirm("Your current editing will be discarded.")) {
                    oData.WhenValid.resolve();
                } else {
                    jQuery.sap.log.info("Dynamic View - validation errors");
                }
            } else {
                oData.WhenValid.resolve();
            }
        }
    });
});
