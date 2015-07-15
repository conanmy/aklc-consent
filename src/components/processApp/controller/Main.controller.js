sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/ComponentContainer", "sap/ui/model/json/JSONModel"],
    function(Controller, ComponentContainer, JSONModel) {
        "use strict";
        return Controller.extend("aklc.cm.components.processApp.controller.Main", {
            _sProceessCollection: "/Process", //Process Collection
            _sStepsCollection: "Steps", //Step Collection
            _sProcessKey: "", //Current Process
            _sStepKey: "", //Current Task
            _oThingInspector: null, //Thing Inspector control
            _bNewProcess: false,
            _oViewModel: null, //View Model

            onInit: function() {
                this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.attachRouteMatched(this.routeMatched.bind(this));
                this._oThingInspector = this.getView().byId("TI");
                this._oModel = this._oComponent.getModel();
                this._oContainer = new ComponentContainer(this.createId("CONTAINTER"));
                this._oViewModel = new JSONModel({});
                this.getView().setModel(this._oViewModel, "vm");
            },

            /**
             * Route Matched
             * @param  {[type]} oEvent [description]
             * @return {[type]}        [description]
             */
            routeMatched: function(oEvent) {
                switch (oEvent.getParameter("name")) {
                    case "empty":
                        return this.onEmptyRoute(oEvent);
                    case "process":
                        return this.onProcessRoute(oEvent);
                    default:
                        return false;
                }
            },

            /**
             * Navigate to step via route
             * @param  {[type]} sProcesKey [description]
             * @param  {[type]} sStepKey   [description]
             */
            navToProcess: function(sProcesKey, sStepKey) {
                this._oRouter.navTo("process", {
                    processkey: sProcesKey,
                    stepkey: sStepKey
                }, true);
            },

            /**
             * On empty route
             * @param  {[type]} oEvent [description]
             * @return {[type]}        [description]
             */
            onEmptyRoute: function(oEvent) {
                //TODO refactor
                this.navToProcess("P1", "Default");
            },

            /**
             * Process rout
             * @param  {[type]} oEvent [description]
             * @return {[type]}        [description]
             */
            onProcessRoute: function(oEvent) {
                var bReload = false;

                var oArguments = oEvent.getParameter("arguments");

                this._sNextStep = undefined;

                // determine if new process
                if (this._sProcessKey !== oArguments.processkey) {
                    (this._sProcessKey = oArguments.processkey);
                    bReload = true;
                    this._bNewProcess = true;
                } else {
                    this._bNewProcess = false;
                }

                if (oArguments.stepkey !== "Default") {
                    this._sStepKey = oArguments.stepkey;
                } else {
                    bReload = true;
                }

                this.getData(bReload);
            },
            /**
             * Retrieve Process entity with Steps Entity Inline
             * @param  {[type]} bReload [description]
             * @return {[type]}         [description]
             */
            getData: function(bReload) {
                this._sPath = this._sProceessCollection + "('" + this._sProcessKey + "')";
                var fnCallback = this.bindView.bind(this);
                var oParams = {
                    expand: this._sStepsCollection
                };
                this.getView().setBusy(true);
                this._oModel.createBindingContext(this._sPath, null, oParams, fnCallback, bReload);
            },

            /**
             * Return context path for step
             * @return {object}          Context
             */
            getStepPathContext: function() {
                var sPath = "/" + this._oModel.createKey(this._sStepsCollection, {
                    ProcessKey: this._sProcessKey,
                    StepKey: this._sStepKey
                });
                return this._oModel.getContext(sPath);
            },

            /**
             * Set the step key selected
             * @param {[type]} sStepKey [description]
             */
            setSelectedFacet: function(sStepKey) {
                var fnFilter = function(oItem) {
                    return oItem.getKey() === sStepKey;
                };
                var oItem = this._oThingInspector.getFacets().filter(fnFilter)[0];
                this._oThingInspector.setSelectedFacet(oItem);
            },

            /**
             * bind view with the new context
             * @param  {object} oContext  
             */
            bindView: function(oContext) {
                this.getView().setBusy(false);
                if (!oContext) {
                    return false; //show error message
                }

                // use view model to render menu - avoid rebindings
                if (this._bNewProcess) {
                    this.newProcess(oContext);
                }

                // set the number of active steps
                this._oThingInspector.setActiveSteps(this.getActiveSteps(oContext));

                // if step key wasnt provided navigate to the active step key
                if (!this._sStepKey) {
                    return this.navToProcess(this._sProcessKey, this.getCurrentKey(oContext));
                }

                this.setSelectedFacet(this._sStepKey);
                this.setContent(this.getStepPathContext());
            },

            /**
             * on process change rebuild icon menu
             * @param  {obj} oContext 
             */
            newProcess: function(oContext) {
                var fnMap = function(obj) {
                    return {
                        Title: obj.Title,
                        StepKey: obj.StepKey,
                        Icon: obj.Icon
                    };
                };

                var aSteps = this._oModel.getProperty(null, oContext, true).Steps.results.map(fnMap);
                this._oViewModel.setData({
                    Steps: aSteps
                });
            },

            /**
             * get the number of currently active steps
             * @param  {object} oContext  
             * @return {integet]}     active steps
             */
            getActiveSteps: function(oContext) {
                var aSteps = this._oModel.getProperty(this._sStepsCollection, oContext);
                var fnFilter = function(sPath) {
                    return this._oModel.getProperty("/" + sPath).Active;
                }.bind(this);

                return aSteps.filter(fnFilter).length;
            },

            /**
             * Get current the key of the current step 
             * @param  {object} oContext  
             * @return {string}          step key
             */
            getCurrentKey: function(oContext) {
                var aSteps = this._oModel.getProperty(this._sStepsCollection, oContext);
                var sDefaultStepPath = "/" + aSteps[0];

                var fnFilter = function(sPath) {
                    return this._oModel.getProperty("/" + sPath).Current;
                }.bind(this);

                var sCurrentStepPath = aSteps.filter(fnFilter)[0] ? "/" + aSteps.filter(fnFilter)[0] : "";
                if (!sCurrentStepPath) {
                    sCurrentStepPath = sDefaultStepPath;
                }

                return this._oModel.getProperty(sCurrentStepPath).StepKey;
            },

            /**
             * [checkValid description]
             * @return {[type]} [description]
             */
            checkValid: function() {
                var oDefer = function() {
                    var result = {};
                    result.promise = new Promise(function(resolve, reject) {
                        result.resolve = resolve;
                        result.reject = reject;
                    });
                    return result;
                };
                var oData = {};
                oData.WhenValid = oDefer();
                this._oComponent.getEventBus().publish(this._oSubscription.channel, this._oSubscription.events.checkValid, oData);
                return oData.WhenValid.promise;
            },

            /**
             * [_submitChanges description]
             * @param  {[type]} fnOnSuccess [description]
             * @param  {[type]} fnOnError   [description]
             * @return {[type]}             [description]
             */
            _submitChanges: function(fnOnSuccess, fnOnError) {
                return new Promise(function(fnResolve, fnReject) {
                    var oContext = this.getStepPathContext();

                    // set current step active
                    if (!oContext.getProperty("Active", oContext)) {
                        this._oModel.setProperty("Active", true, oContext);
                    }

                    if (this._oModel.hasPendingChanges()) {
                        this._oModel.submitChanges({
                            success: fnResolve(fnOnSuccess),
                            error: fnReject(fnOnError)
                        });
                    } else {
                        fnResolve();
                    }
                }.bind(this));
            },

            /**
             * On Facet selected set the applicable content
             */
            onFacetSelected: function(oEvent) {
                // get next step id from event
                this._sNextStep = oEvent.getParameter("key");

   
                var fnOnSuccess = function() {
                    //TODO
                };

                var fnOnError = function(oError) {
                    //TODO
                };

                var fNSubmit = function() {
                    this._submitChanges(fnOnSuccess, fnOnError);
                }.bind(this);

                var fnNav = function() {
                    this.navToProcess(this._sProcessKey, this._sNextStep);
                }.bind(this);


                // trigger validation on step, if successful save and navigate
                this.checkValid().then(fNSubmit).then(fnNav);
            },



            /**
             * Set the facet content based on the selected key
             * @param {[type]} sKey [description]
             */
            setContent: function(oContext) {
                var oStep = this._oModel.getObject(oContext.getPath());
                var sComponentPath = "aklc.cm.components.";

                //remove existing content
                this._oThingInspector.removeAllFacetContent();

                var oFacetContent = new sap.ui.ux3.ThingGroup({
                    title: oStep.Title
                });

                var sId = this.createId("COMP_" + oStep.StepKey);
                var sCompName = sComponentPath + oStep.Component;
                var oComponent = this.getComponentById(sId, sCompName);
                this._oContainer.setComponent(oComponent);

                oFacetContent.bindElement(oContext.getPath());
                oFacetContent.addContent(this._oContainer);
                this._oThingInspector.addFacetContent(oFacetContent);

                this._oSubscription = oComponent.getEventBusSubscription();
                this._oComponent.getEventBus().publish(this._oSubscription.channel, this._oSubscription.events.contextChanged, {
                    context: oContext
                });
                return;
            },

            /**
             *  Get Component By ID
             * @param  {[type]} sId        Component ID
             * @param  {[type]} sCompName  Component name
             * @return {object}            Component
             */
            getComponentById: function(sId, sCompName) {
                var oComponent = sap.ui.getCore().getComponent(sId);
                if (!oComponent) {
                    oComponent = sap.ui.component({
                        name: sCompName,
                        id: sId,
                        componentData: {
                            model: this._oModel,
                            eventBus: this._oComponent.getEventBus()
                        }
                    });
                }
                return oComponent;
            },
        });
    });
