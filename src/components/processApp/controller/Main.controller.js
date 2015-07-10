sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/ComponentContainer"], function(Controller, ComponentContainer) {
    "use strict";
    return Controller.extend("aklc.cm.components.processApp.controller.Main", {
        _sProceessCollection: "/Process", //Process Collection
        _sStepsCollection: "Steps", //Step Collection
        _sProcessKey: "", //Current Process
        _sStepKey: "", //Current Taks
        _sStepViewName: "", //Current Step View
        _oThingInspector: null, //Thing Inspector control
        _oViewRegistry: [], //registry of views
        _sNextStep: undefined,

        onInit: function() {
            this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this.routeMatched.bind(this));
            this._oThingInspector = this.getView().byId("TI");
            this._oModel = this._oComponent.getModel();
            this._oContainer = new ComponentContainer(this.createId("CONTAINTER"));
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
         * Update the route
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
         * [onProcessRoute description]
         * @param  {[type]} oEvent [description]
         * @return {[type]}        [description]
         */
        onProcessRoute: function(oEvent) {
            var bReload = false;
            var oArguments = oEvent.getParameter("arguments");

            this._sNextStep = undefined;

            if (this._sProcessKey !== oArguments.processkey) {
                (this._sProcessKey = oArguments.processkey);
                bReload = true;
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
         * [getStepPathContext description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
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
         * [bindView description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        bindView: function(oContext) {
            this.getView().setBusy(false);
            if (!oContext) {
                return false; //show error message
            }
            this.getView().setBindingContext(oContext);

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
         * [getActiveSteps description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        getActiveSteps: function(oContext) {
            var aSteps = oContext.getObject().Steps.__list;
            var fnFilter = function(sPath) {
                var oData = this._oModel.getContext("/" + sPath).getObject();
                return oData.Active;
            }.bind(this);

            return aSteps.filter(fnFilter).length;
        },

        /**
         * [fucntion description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        getCurrentKey: function(oContext) {
            var aSteps = oContext.getObject().Steps.__list;
            var sDefaultStepPath = "/" + aSteps[0];

            var fnFilter = function(sPath) {
                var oData = this._oModel.getContext("/" + sPath).getObject();
                return oData.Current;
            }.bind(this);

            var sCurrentStepPath = aSteps.filter(fnFilter)[0];
            if (!sCurrentStepPath) {
                sCurrentStepPath = sDefaultStepPath;
            }

            return this._oModel.getContext("/" + sCurrentStepPath).getObject().StepKey;

        },

        /**
         * On Facet selected set the applicable content
         */
        onFacetSelected: function(oEvent) {
            // set content
            this._sNextStep = oEvent.getParameter("key");

            //on facet selected needed to trigger validation
            //
            //if valid need to update current step to active and nav to next step
            var defer = function() {
                var result = {};
                result.promise = new Promise(function(resolve, reject) {
                    result.resolve = resolve;
                    result.reject = reject;
                });
                return result;
            };

            var oData = {};
            oData.WhenValid = defer();
            oData.WhenValid.promise.then(function() {
                this.navToProcess(this._sProcessKey, this._sNextStep);
            }.bind(this));
            this._oComponent.getEventBus().publish(this._oSubscription.channel, this._oSubscription.events.checkValid, oData);
        },

        /**
         * Set the facet content based on the selected key
         * @param {[type]} sKey [description]
         */
        setContent: function(oContext) {
            var oStep = oContext.getObject();
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
         * [getComponentById description]
         * @param  {[type]} sId       [description]
         * @param  {[type]} sCompName [description]
         * @return {[type]}           [description]
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
