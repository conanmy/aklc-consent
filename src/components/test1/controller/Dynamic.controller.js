sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("aklc.cm.components.test1.controller.Dynamic", {
        _aInputFields: null,
        _aMandatoryFields: null,
        onInit: function() {
            BaseController.prototype.onInit.apply(this);
        },

        /**
         * [onContextChanged description]
         * @param  {[type]} sChannel [description]
         * @param  {[type]} sEvent   [description]
         * @param  {[type]} oData    [description]
         * @return {[type]}          [description]
         */
        onContextChanged: function(sChannel, sEvent, oData) {
            this.getData(true, oData.context.getPath());
        },

        /**
         * [getData description]
         * @param  {[type]} bRefresh [description]
         * @param  {[type]} sPath    [description]
         * @return {[type]}          [description]
         */
        getData: function(bRefresh, sPath) {
            // var oContext = this._oView.getBindingContext();
            // var sPath = oContext.getPath();
            var oParams = {
                expand: "Fields/Lookup"
            };
            var fnCallback = this.bindView.bind(this);

            this._oModel.createBindingContext(sPath, null, oParams, fnCallback, bRefresh);

        },

        /**
         * [bindView description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        bindView: function(oContext) {
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
                var oContainer = this.createFormContainer(this._oModel.getContext('/' + sPath));
                this._oForm.insertFormContainer(oContainer, index);
            }.bind(this));
        },


        /**
         * [getMandatoryFields description]
         * @return {[type]} [description]
         */
        getMandatoryFields: function() {
            return this._aMandatoryFields;
        },

        /**
         * [onInputChange description]
         * @param  {[type]} oEvent [description]
         * @return {[type]}        [description]
         */
        onInputChange: function(oEvent) {
            var oField = oEvent.getSource();
            this.fieldChange(oField);
        },

        /**
         * [fieldChange description]
         * @param  {[type]} oControl [description]
         * @return {[type]}          [description]
         */
        fieldChange: function(oControl) {
            this.setDirty();

            // Removes previous error state
            if (oControl.setValueState) {
                oControl.setValueState(sap.ui.core.ValueState.None);
            }

        },

        /**
         * [setDirty description]
         */
        setDirty: function() {

        },

        /**
         * [getInputFields description]
         * @return {[type]} [description]
         */
        getInputFields: function() {
            return this._aInputFields;
        },

        /**
         * [_resetValueStates description]
         * @return {[type]} [description]
         */
        resetValueStates: function() {
            this._aInputFields.forEach(function(oControl) {
                oControl.setValueState(sap.ui.core.ValueState.None);
            });
        },

        /**
         * [_fieldWithErrorState description]
         * @return {[type]} [description]
         */
        fieldWithErrorState: function() {
            this._aInputFields.some(function(oControl) {
                return (oControl.getValueState() === sap.ui.core.ValueState.Error);
            });
        },

        /**
         * [_checkAndMarkEmptyMandatoryFields description]
         * @return {[type]} [description]
         */
        checkAndMarkEmptyMandatoryFields: function() {
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
        createFormContainer: function(oContext) {
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
            this.checkAndMarkEmptyMandatoryFields();
        }
    });
});
