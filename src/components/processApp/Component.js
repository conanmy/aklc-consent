sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/thirdparty/URI",
	"./Router",
	"sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, URI, Router, ODataModel) {
	"use strict";
	return UIComponent.extend("aklc.cm.components.processApp.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * [init description]
		 */
		init: function() {
			var oMetadata = this.getMetadata();
			var oAppManifest = oMetadata.getManifestEntry("sap.app", true);
			var oUI5Manifest = oMetadata.getManifestEntry("sap.ui5", true);
			var oModel = new ODataModel(
				oAppManifest.dataSources.processApi.uri,
				oUI5Manifest.models[""].settings);
			this.setModel(oModel);
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		/**
		 * retrofitted from 1.30 no bower yet
		 * TODO - remove after upgrade
		 */
		initComponentModels1: function() {
			jQuery.sap.log.error("Component INITMODELS");
			this._mManifestModels = {};
			// retrieve the merged sap.app and sap.ui5 sections of the manifest
			// to create the models for the component + inherited ones
			var oMetadata = this.getMetadata();
			var oAppManifest = oMetadata.getManifestEntry("sap.app", true);
			var oUI5Manifest = oMetadata.getManifestEntry("sap.ui5", true);

			var mModelConfigs = oUI5Manifest.models;
			if (!mModelConfigs) {
				// skipping model creation because of missing sap.ui5 models manifest entry
				return;
			}

			jQuery.sap.log.error("Component INITMODELS2");
			var mergeDefinitionSource = function(mDefinitions, mDefinitionSource, mSourceData, oSource) {
				if (mSourceData) {
					for (var sName in mDefinitions) {
						if (!mDefinitionSource[sName] && mSourceData[sName]) {
							mDefinitionSource[sName] = oSource;
						}
					}
				}
			};

			// optional dataSources from "sap.app" manifest
			var mDataSources = oAppManifest.dataSources || {};

			// identify where the dataSources/models have been orginally defined
			var mModelSource = {};
			var mDataSourcesSource = {};
			var oMeta = oMetadata;
			// while (oMeta && oMeta instanceof ComponentMetadata) {

			var mCurrentDataSources = oMeta.getManifestEntry("sap.app").dataSources;
			mergeDefinitionSource(mDataSources, mDataSourcesSource, mCurrentDataSources, oMeta);

			var mCurrentModelConfigs = oMeta.getManifestEntry("sap.ui5").models;
			mergeDefinitionSource(mModelConfigs, mModelSource, mCurrentModelConfigs, oMeta);

			oMeta = oMeta.getParent();
			// }

			// read current URI params to mix them into model URI
			// var oUriParams = jQuery.sap.getUriParameters();

			// create a model for each ["sap.ui5"]["models"] entry
			for (var sModelName in mModelConfigs) {

				var oModelConfig = mModelConfigs[sModelName];
				// var bIsDataSourceUri = false;
				jQuery.sap.log.error("Component INITMODELS2 " + oModelConfig.type);
				// normalize dataSource shorthand, e.g.
				// "myModel": "myDataSource" => "myModel": { dataSource: "myDataSource" }
				if (typeof oModelConfig === "string") {
					oModelConfig = {
						dataSource: oModelConfig
					};
				}

				// check for referenced dataSource entry and read out settings/uri/type
				// if not already provided in model config
				if (oModelConfig.dataSource) {

					var oDataSource = mDataSources && mDataSources[oModelConfig.dataSource];
					if (typeof oDataSource === "object") {

						// default type is OData
						if (oDataSource.type === undefined) {
							oDataSource.type = "OData";
						}

						// read out type and translate to model class
						// (only if no model type was set to allow overriding)
						if (!oModelConfig.type) {
							switch (oDataSource.type) {
								case "OData":
									oModelConfig.type = "sap.ui.model.odata.v2.ODataModel";
									break;
								case "JSON":
									oModelConfig.type = "sap.ui.model.json.JSONModel";
									break;
								case "XML":
									oModelConfig.type = "sap.ui.model.xml.XMLModel";
									break;
								default:
									// for custom dataSource types, the class should already be specified in the sap.ui5 models config
							}
						}

						// use dataSource uri if it isn't already defined in model config
						if (!oModelConfig.uri) {
							oModelConfig.uri = oDataSource.uri;
							// bIsDataSourceUri = true;
						}

						// read out OData annotations and create ODataModel settings for it
						if (oDataSource.type === "OData" && oDataSource.settings && oDataSource.settings.annotations) {
							var aAnnotations = oDataSource.settings.annotations;

							for (var i = 0; i < aAnnotations.length; i++) {
								var oAnnotation = mDataSources[aAnnotations[i]];

								// dataSource entry should be defined!
								if (!oAnnotation) {
									jQuery.sap.log.error("Component Manifest: ODataAnnotation \"" + aAnnotations[i] + "\" for dataSource \"" + oModelConfig.dataSource + "\" could not be found in manifest", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
									continue;
								}

								// type should be ODataAnnotation!
								if (oAnnotation.type !== "ODataAnnotation") {
									jQuery.sap.log.error("Component Manifest: dataSource \"" + aAnnotations[i] + "\" was expected to have type \"ODataAnnotation\" but was \"" + oAnnotation.type + "\"", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
									continue;
								}

								// uri is required!
								if (!oAnnotation.uri) {
									jQuery.sap.log.error("Component Manifest: Missing \"uri\" for ODataAnnotation \"" + aAnnotations[i] + "\"", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
									continue;
								}

								// resolve relative to component
								var oAnnotationUri = mDataSourcesSource[aAnnotations[i]]._resolveUri(new URI(oAnnotation.uri)).toString();

								// add uri to annotationURI array in settings (this parameter applies for ODataModel v1 & v2)
								oModelConfig.settings = oModelConfig.settings || {};
								oModelConfig.settings.annotationURI = oModelConfig.settings.annotationURI || [];
								oModelConfig.settings.annotationURI.push(oAnnotationUri);
							}
						}

					} else {
						jQuery.sap.log.error("Component Manifest: dataSource \"" + oModelConfig.dataSource + "\" for model \"" + sModelName + "\" not found or invalid", "[\"sap.app\"][\"dataSources\"][\"" + oModelConfig.dataSource + "\"]", this);
					}
				}

				// model type is required!
				if (!oModelConfig.type) {
					jQuery.sap.log.error("Component Manifest: Missing \"type\" for model \"" + sModelName + "\"", "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
					continue;
				}

				// load model class and log error message if it couldn"t be loaded.
				// error gets catched to continue creating the other models and not breaking the execution here
				try {
					jQuery.sap.require(oModelConfig.type);
				} catch (oError) {
					jQuery.sap.log.error("Component Manifest: Class \"" + oModelConfig.type + "\" for model \"" + sModelName + "\" could not be loaded. " + oError, "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
					continue;
				}

				// get model class object
				var ModelClass = jQuery.sap.getObject(oModelConfig.type);
				if (!ModelClass) {
					// this could be the case if the required module doesn"t register itself in the defined namespace
					jQuery.sap.log.error("Component Manifest: Class \"" + oModelConfig.type + "\" for model \"" + sModelName + "\" could not be found", "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
					continue;
				}

				// set mode of old ODataModel to "json" (default is xml).
				// as the automatic model creation is a new feature, this is not incompatible here
				if (oModelConfig.type === "sap.ui.model.odata.ODataModel" &&
					(!oModelConfig.settings || oModelConfig.settings.json === undefined)) {
					// do not overwrite the flag if it was explicitly defined!

					oModelConfig.settings = oModelConfig.settings || {};
					oModelConfig.settings.json = true;
				}

				// adopt model uri
				if (oModelConfig.uri) {

					// parse model URI to be able to modify it
					var oUri = new URI(oModelConfig.uri);

					// resolve URI relative to component which defined it
					// var oUriSourceComponent = (bIsDataSourceUri) ? mDataSourcesSource[oModelConfig.dataSource] : mModelSource[sModelName];
					// oUri = oUriSourceComponent._resolveUri(oUri);

					// inherit sap-specific parameters from document (only if "sap.app/dataSources" reference is defined)
					// if (oModelConfig.dataSource) {
					//     addSapUriParams(oUriParams, oUri);
					// }

					oModelConfig.uri = oUri.toString();
				}

				// set model specific "uri" property names which should be used to map "uri" to model specific constructor
				// (only if it wasn"t specified before)
				if (oModelConfig.uriSettingName === undefined) {
					switch (oModelConfig.type) {
						case "sap.ui.model.odata.ODataModel":
						case "sap.ui.model.odata.v2.ODataModel":
							oModelConfig.uriSettingName = "serviceUrl";
							break;
						case "sap.ui.model.resource.ResourceModel":
							oModelConfig.uriSettingName = "bundleUrl";
							break;
						default:
							// default "undefined" is already set in this case
					}
				}

				// include "uri" property in "settings" object, depending on "uriSettingName"
				if (oModelConfig.uri) {
					if (oModelConfig.uriSettingName !== undefined) {
						oModelConfig.settings = oModelConfig.settings || {};

						// do not override the property if it's already defined!
						if (!oModelConfig.settings[oModelConfig.uriSettingName]) {
							oModelConfig.settings[oModelConfig.uriSettingName] = oModelConfig.uri;
						}

					} else if (oModelConfig.settings) {
						// shift settings to 2nd argument if no "uriSettingName" was specified
						oModelConfig.settings = [oModelConfig.uri, oModelConfig.settings];
					} else {
						// only use 1st argument with "uri" string if there are no settings
						oModelConfig.settings = [oModelConfig.uri];
					}
				}

				// normalize settings object to array
				if (oModelConfig.settings && !jQuery.isArray(oModelConfig.settings)) {
					oModelConfig.settings = [oModelConfig.settings];
				}
				jQuery.sap.log.error("Component INITMODELS3 " + oModelConfig.type);
				// create arguments array with leading "null" value so that it can be passed to the apply function
				var aArgs = [null].concat(oModelConfig.settings || []);

				// create factory function by calling "Model.bind" with the provided arguments
				var Factory = ModelClass.bind.apply(ModelClass, aArgs);
				jQuery.sap.log.error("Component INITMODELS3.1 " + oModelConfig.type);
				// the factory will create the model with the arguments above
				var oModel = new Factory();
				// var oModel = new ODataModel(aArgs);
				jQuery.sap.log.error("Component INITMODELS4 " + oModelConfig.type);
				// keep the model instance to be able to destroy the created models on component destroy
				this._mManifestModels[sModelName] = oModel;

				// apply the model to the component with provided name ("" as key means unnamed model)
				this.setModel(oModel, sModelName || undefined);

			}

		}

	});

});
