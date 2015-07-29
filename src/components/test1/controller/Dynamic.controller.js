sap.ui.define(["aklc/cm/controller/BaseController"], function(BaseController) {
	"use strict";
	return BaseController.extend("aklc.cm.components.test1.controller.Dynamic", {
		_aInputFields: null,
		_aMandatoryFields: null,
		_oForm: null, // Form control
		onInit: function() {
			BaseController.prototype.onInit.apply(this);

			this._oBundle = this.getComponent().getModel("i18n").getResourceBundle();
			this._oMessageManager = sap.ui.getCore().getMessageManager();
		},

		/**
		 * [onContextChanged description]
		 * @param  {[type]} sChannel [description]
		 * @param  {[type]} sEvent   [description]
		 * @param  {[type]} oData    [description]
		 */
		onContextChanged: function(sChannel, sEvent, oData) {
			this.getData(oData.context).then(this.createFormContent.bind(this));
		},

		/**
		 * [getData description]
		 * @param  {[type]} oContext context
		 * @return {object} promise
		 */
		getData: function(oContext) {
			return new Promise(function(fnResolve, fnReject) {
				// use separate binding with filters to avoid rerendering on changes
				var oFilter = new sap.ui.model.Filter("StepKey", "EQ", this._oModel.getProperty("StepKey", oContext));
				var oBinding = this._oModel.bindList("/Fields", null, null, [oFilter], {
					expand: "Lookup"
				}).initialize();

				var fnCallback = function() {
					oBinding.detachChange(fnCallback);
					fnResolve(oBinding);
				};

				oBinding.attachChange(fnCallback);
				oBinding.getContexts();
			}.bind(this));
		},

		/**
		 * [createFormContent description]
		 * @param  {[type]} oBinding [description]
		 */
		createFormContent: function(oBinding) {
			if (this.bAlready || !oBinding) {
				return;
			}

			this.bAlready = true;

			this._oForm = this._oView.byId("DETAIL_FORM");

			this._aInputFields = [];
			this._aMandatoryFields = [];

			oBinding.getContexts().forEach(function(oContext, index) {
				var oContainer = this.createFormContainer(oContext);
				this._oForm.insertFormContainer(oContainer, index);
			}.bind(this));
		},

		/**
		 * [onCheckValid description]
		 * @param  {[type]} sChannel [description]
		 * @param  {[type]} sEvent   [description]
		 * @param  {[type]} oData    [description]
		 */
		onCheckValid: function(sChannel, sEvent, oData) {
			if (!this.checkAndMarkEmptyMandatoryFields()) {
				oData.WhenValid.resolve();
			} else {
				jQuery.sap.log.info("Dynamic View - validation errors");
			}
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
		 * @param  {object} oEvent [description]
		 */
		onInputChange: function(oEvent) {
			var oField = oEvent.getSource();
			this.fieldChange(oField);
		},

		/**
		 * [fieldChange description]
		 * @param  {object} oControl field that was changed
		 */
		fieldChange: function(oControl) {
			var sPath = oControl.getBindingContext().getPath() + "/Value";
			var aMessage = this._oModel.getMessagesByPath(sPath);
			var bHasValue = this.fieldHasValue(oControl);
			var bIsMandatory = (this.getMandatoryFields().indexOf(oControl) !== -1);

			// remove message if exists
			if (bHasValue && aMessage) {
				this._oMessageManager.removeMessages(aMessage);
			}

			// add message if mandatory and no value
			if (!bHasValue && !aMessage && bIsMandatory) {
				this.addMandatoryMessage(oControl);
			}
		},

		/**
		 * [getInputFields description]
		 * @return {[type]} [description]
		 */
		getInputFields: function() {
			return this._aInputFields;
		},

		/**
		 * check that the controls value is not initial
		 * @param  {object} oControl [description]
		 * @return {boolean}          has value
		 */
		fieldHasValue: function(oControl) {
			switch (oControl.getMetadata().getName()) {
				case "sap.m.ComboBox":
					if (oControl.getSelectedKey()) {
						return true;
					}
					break;
				case "sap.m.Input":
					if (oControl.getValue() && oControl.getValue().trim() !== "") {
						return true;
					}
					break;
				case "sap.m.MultiComboBox":
					if (oControl.getSelectedKeys().length > 0) {
						return true;
					}
					break;
				default:
					return true;
			}
		},

		addMandatoryMessage: function(oControl) {
			var sFieldLabel = this._oModel.getProperty("Label", oControl.getBindingContext());
			var sTargetId = oControl.getBindingContext().getPath() + "/Value";

			if (!this._oModel.getMessagesByPath(sTargetId)) {
				this._oMessageManager.addMessages(
					new sap.ui.core.message.Message({
						message: this._oBundle.getText("MANDATORY_FIELD", [sFieldLabel]),
						type: sap.ui.core.MessageType.Error,
						target: sTargetId,
						processor: this._oModel
					})
				);
			}
		},

		/**
		 * Check that inputs are not empty or space.
		 * @return {boolean} errors occured
		 */
		checkAndMarkEmptyMandatoryFields: function() {
			var bErrors = false;

			this._aMandatoryFields.forEach(function(oControl) {
				if (!this.fieldHasValue(oControl)) {
					bErrors = true;
					this.addMandatoryMessage(oControl);
				}
			}.bind(this));

			return bErrors;
		},

		/**
		 * create new form container
		 * @param  {[type]} oContext [description]
		 * @return {object} form container
		 */
		createFormContainer: function(oContext) {
			var oData = this._oModel.getProperty(null, oContext);
			var sValuePath = "Value";
			var sLookupPath = "Lookup";
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
						liveChange: this.onInputChange.bind(this),
						placeholder: oData.Placeholder,
						layoutData: oLayoutData
					});
					break;
				default:
					break;
			}
			sap.ui.getCore().getMessageManager().registerObject(oControl, true);
			this._aInputFields.push(oControl);
			if (oData.Required) {
				this._aMandatoryFields.push(oControl);
			}

			return new sap.ui.layout.form.FormContainer({
				formElements: new sap.ui.layout.form.FormElement({
					fields: [oLabel, oControl]
				}).setBindingContext(oContext)
			});
		}
	});
});
