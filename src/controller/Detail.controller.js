sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.Detail", {
        _aInputFields: null,
        _aMandatoryFields: null,
        onInit: function() {
            BaseController.prototype.onInit.apply(this);
            sap.ui.getCore().attachValidationError(function(evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("Error");
                }
            });
            sap.ui.getCore().attachValidationSuccess(function(evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("None");
                }
            });

            this.whenThereIsData = function(oElementBinding) {
                var sPath = oElementBinding.getPath(),
                    oModel = oElementBinding.getModel();

                return new Promise(function(fnSuccess, fnReject) {
                    //Check if the data is already on the client
                    if (!oModel.getProperty(sPath)) {
                        // Check that the object specified actually was found.
                        oElementBinding.attachEventOnce("dataReceived", function() {
                            var oData = oModel.getProperty(sPath);
                            if (!oData) {
                                fnReject();
                            } else {
                                fnSuccess(sPath);
                            }
                        }, this);
                    } else {
                        fnSuccess(sPath);
                    }
                });
            };
        },

        onBeforeRendering: function() {
            this.whenThereIsData(this._oView.getBindingContext()).then(
                function(sPath) {
                    if (this._oModel.oMetadata.isLoaded()) {
                        this._getData(false);
                    }
                }.bind(this)
            );
        },

        _getData: function(bRefresh) {
            var oContext = this._oView.getBindingContext();
            var sPath = oContext.getPath();
            var oParams = {
                expand: "Fields/Lookup"
            };
            var fnCallback = this._bindView.bind(this);

            this._oModel.createBindingContext(sPath, null, oParams, fnCallback, bRefresh);

        },

        _bindView: function(oContext) {
            if (!oContext) {
                return;
            }

            if (this.bAlready) {
                return;
            }

            this._oForm = this._oView.byId("DETAIL_FORM");
            var oData = oContext.getObject();

            this.bAlready = true;

            this._aInputFields = [];
            this._aMandatoryFields = [];

            oData.Fields.__list.forEach(function(sPath, index) {
                var oContainer = this._createFormContainer(this._oModel.getContext('/' + sPath));
                this._oForm.insertFormContainer(oContainer, index);
            }.bind(this));
        },


        /**
         * [_getMandatoryFields description]
         * @return {[type]} [description]
         */
        _getMandatoryFields: function() {
            return this._aMandatoryFields;
        },

        /**
         * [onInputChange description]
         * @param  {[type]} oEvent [description]
         * @return {[type]}        [description]
         */
        onInputChange: function(oEvent) {
            var oField = oEvent.getSource();
            this._fieldChange(oField);
        },

        /**
         * [_fieldChange description]
         * @param  {[type]} oControl [description]
         * @return {[type]}          [description]
         */
        _fieldChange: function(oControl) {
            this._setDirty();

            // Removes previous error state
            if (oControl.setValueState) {
                oControl.setValueState(sap.ui.core.ValueState.None);
            }

        },

        /**
         * [_setDirty description]
         */
        _setDirty: function() {

        },

        /**
         * [_getInputFields description]
         * @return {[type]} [description]
         */
        _getInputFields: function() {
            return this._aInputFields;
        },

        /**
         * [_resetValueStates description]
         * @return {[type]} [description]
         */
        _resetValueStates: function() {
            this._aInputFields.forEach(function(oControl) {
                oControl.setValueState(sap.ui.core.ValueState.None);
            });
        },

        /**
         * [_fieldWithErrorState description]
         * @return {[type]} [description]
         */
        _fieldWithErrorState: function() {
            this._aInputFields.some(function(oControl) {
                return (oControl.getValueState() === sap.ui.core.ValueState.Error);
            });
        },

        /**
         * [_checkAndMarkEmptyMandatoryFields description]
         * @return {[type]} [description]
         */
        _checkAndMarkEmptyMandatoryFields: function() {
            var bErrors = false;
            // Check that inputs are not empty or space.
            // This does not happen during data binding because this is only triggered by changes.
            this._aMandatoryFields.forEach(function(oControl) {
                if (!oControl.getValue() || oControl.getValue().trim() === "") {
                    bErrors = true;
                    oControl.setValueState(sap.ui.core.ValueState.Error);
                }
            });

            return bErrors;
        },

        /**
         * [createFormElements description]
         * @param  {[type]} sId      [description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        _createFormContainer: function(oContext) {
            var oData = oContext.getObject();
            var sValuePath = oContext.getPath() + "/Value";
            var sLookupPath = oContext.getPath() + "/Lookup";
            var oControl;
            var oTemplate = new sap.ui.core.Item({
                key: "{Key}",
                text: "{Value}"
            });
            var oLayoutData = new sap.ui.layout.GridData({
                span: "L8 M8 S12"
            });

            var oLabel = new sap.m.Label({
                text: oData.Label,
                required: oData.Required
            });

            switch (oData.Type) {
                case "checkbox":
                    oControl = new sap.m.Switch({
                        id: oData.Attribute,
                        change: this.onInputChange.bind(this),
                        state: {
                            path: sValuePath
                        },
                        layoutData: oLayoutData
                    });
                    break;
                case "combo":
                    oControl = new sap.m.ComboBox({
                        id: oData.Attribute,
                        selectionChange: this.onInputChange.bind(this),
                        selectedKey: {
                            path: sValuePath
                        },
                        items: {
                            path: sLookupPath,
                            template: oTemplate
                        },
                        placeholder: oData.Placeholder,
                        layoutData: oLayoutData
                    });
                    break;
                case "multi_combo":
                    oControl = new sap.m.MultiComboBox({
                        id: oData.Attribute,
                        selectionChange: this.onInputChange.bind(this),
                        selectedKeys: {
                            path: sValuePath
                        },
                        items: {
                            path: sLookupPath,
                            template: oTemplate
                        },
                        placeholder: oData.Placeholder,
                        layoutData: oLayoutData
                    });
                    break;
                case "input":
                    oControl = new sap.m.Input({
                        id: oData.Attribute,
                        value: {
                            path: sValuePath
                        },
                        change: this.onInputChange.bind(this),
                        placeholder: oData.Placeholder,
                        layoutData: oLayoutData
                    });
                    break;
            }


            this._aInputFields.push(oControl);
            if (oData.Required) {
                this._aMandatoryFields.push(oControl);
            }

            return new sap.ui.layout.form.FormContainer({
                formElements: new sap.ui.layout.form.FormElement({
                    fields: [oLabel, oControl],
                })
            });

        },

        onTest: function(oEvent) {
            this._checkAndMarkEmptyMandatoryFields();
        },

        handleContinue: function(evt) {
            // collect input controls
            var view = this.getView();
            var inputs = [
                view.byId("EXISTING_DWELLINGS")
            ];

            // check that inputs are not empty
            // this does not happen during data binding as this is only triggered by changes
            jQuery.each(inputs, function(i, input) {
                if (!input.getValue()) {
                    input.setValueState("Error");
                }
            });

            // check states of inputs
            var canContinue = true;
            jQuery.each(inputs, function(i, input) {
                if (input.getValueState() === "Error") {
                    canContinue = false;
                    return false;
                }
            });

            // output result
            if (canContinue) {
                sap.m.MessageToast.show("The input is correct. You could now continue to the next screen.");
            } else {
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.alert("Complete your input first.");
            }
        },

        /**
         * This is a custom model type for validating email
         */
        typeEmail: sap.ui.model.SimpleType.extend("email", {
            formatValue: function(oValue) {
                return oValue;
            },
            parseValue: function(oValue) {
                //parsing step takes place before validating step, value can be altered
                return oValue;
            },
            validateValue: function(oValue) {
                // The following Regex is NOT a completely correct one and only used for demonstration purposes.
                // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
                var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(mailregex)) {
                    throw new sap.ui.model.ValidateException("'" + oValue + "' is not a valid email address");
                }
            }
        })
    });
});
