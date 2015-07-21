sap.ui.define(["aklc/cm/controller/BaseController", "sap/m/MessageBox"], function(BaseController, MessageBox) {
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
                    var nameList = that._getView(that._basePath + "NameSelectList");
                    if (!that.isInNameSelectList()) {
                        container.removeAllContent();
                        container.addContent(nameList);
                    }
                    nameList.bindElement(
                        "/PartnerFunctions(" + that._getPartnerFunctionCode(path) + ")"
                    );
                    nameList.byId("partnerObject").bindElement(
                        path + "/Partners"
                    );
                    nameList.byId("partnerDates").bindElement(path);
                    nameList.byId("partnerDetails").setVisible(true);
                }
            );
        },

        /**
         * get function code from path
         * @param  {string} path given path of the selected assigned partner
         * @return {number} function code
         */
        _getPartnerFunctionCode: function(path) {
            var codeMark = "PartnerFunctionCode=";
            return path.substring(
                path.indexOf(codeMark) + codeMark.length,
                path.indexOf(",PartnerNumber")
            ) - 0;
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

        /**
         * check if the right column is in name select list
         * @return {Boolean}
         */
        isInNameSelectList: function() {
            return this.getView().byId("splitContainer").getContent()[0].sViewName
                === (this._basePath + "NameSelectList");
        },
        
        onCheckValid: function(sChannel, sEvent, oData){
            if (this.isInNameSelectList()) {
                MessageBox.confirm("Your current editing will be discarded.", {
                    onClose: function(oAction) {
                        if (oAction === "OK") {
                            oData.WhenValid.resolve();
                        } else {
                            jQuery.sap.log.info("Partners - validation errors");
                        }
                    }
                });
            } else {
                oData.WhenValid.resolve();
            }
        }
    });
});
