sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.Main", {
        _sProceessCollection: "/Process", //Process Collection
        _sStepsCollection: "Steps", //Step Collection
        _sProcessKey: "", //Current Process
        _sStepKey: "", //Current Taks
        _sStepViewName: "", //Current Step View
        _oThingInspector: null, //Thing Inspector control
        _oViewRegistry: [], //registry of views
        _sNextStep: undefined,

        onInit: function() {
            this.getRouter().attachRouteMatched(this.routeMatched.bind(this));
            this._oThingInspector = this.getView().byId("TI");
            this._oModel = this.getComponent().getModel();
        },

        /**
         * Route Matched
         * @param  {[type]} oEvent [description]
         * @return {[type]}        [description]
         */
        routeMatched: function(oEvent) {
            var oArguments = oEvent.getParameter("arguments");
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
            this.getRouter().navTo("process", {
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
        _setSelectedFacet: function(sStepKey) {
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
            this._oThingInspector.setActiveSteps(this._getActiveSteps(oContext));

            // if step key wasnt provided navigate to the active step key
            if (!this._sStepKey) {
                return this.navToProcess(this._sProcessKey, this._getCurrentKey(oContext));
            }

            this._setSelectedFacet(this._sStepKey);
            this._setContent(this.getStepPathContext());
        },

        /**
         * [_getActiveSteps description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        _getActiveSteps: function(oContext) {
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
        _getCurrentKey: function(oContext) {
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
            var oSelectedItem = oEvent.getParameters("item").item;
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
            this.getEventBus().publish(this._sStepViewName, "CheckValid", oData);
        },

        getStepTitle: function(sPath) {
            var oContext = this._oModel.getContext("/" + sPath);
            return oContext.getObject().Title;
        },

        /**
         * Set the facet content based on the selected key
         * @param {[type]} sKey [description]
         */
        _setContent: function(oContext) {
            var oStep = oContext.getObject();
            var sViewPath = "scenario.xmlview.view.";

            this._sStepViewName = sViewPath + oStep.StepView;


            //remove existing content
            this._oThingInspector.removeAllFacetContent();
            this._oThingInspector.removeAllHeaderContent();


            // show header details
            this._oThingInspector.setShowHeader(oStep.ShowHeader);
            if (oStep.ShowHeader && oStep.HeaderView) {
                var sHeaderViewName = sViewPath + oStep.HeaderView;
                // Header content thing group with view embeded
                var oHeaderContent = new sap.ui.ux3.ThingGroup({
                    title: oStep.HeaderTitle,
                    content: [
                        this._getView(sHeaderViewName)
                    ]
                });
                oHeaderContent.setModel(this._oModel);
                oHeaderContent.bindElement(oContext.getPath());
                this._oThingInspector.addHeaderContent(oHeaderContent);
            }

            var oFacetContent = new sap.ui.ux3.ThingGroup({
                title: oStep.Title
            });

            oFacetContent.bindElement(oContext.getPath());
            oFacetContent.addContent(this._getView(this._sStepViewName));

            this._oThingInspector.addFacetContent(oFacetContent);
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
