sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.Main", {
        _sProceessCollection: "/Process", //Process Collection
        _sStepsCollection: "Steps", //Step Collection
        _sProcessKey: "", //Current Process
        _sStepKey: "", //Current Taks
        _oThingInspector: null, //Thing Inspector control
        _oViewRegistry: [],

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
            switch (oEvent.getParameter("name")) {
                case "empty":
                    return this.onEmptyRoute(oEvent);
                case "process":
                    return this.onProcessRoute(oEvent);
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
            this.navToProcess("P1", "DETAILS");
        },

        /**
         * [onProcessRoute description]
         * @param  {[type]} oEvent [description]
         * @return {[type]}        [description]
         */
        onProcessRoute: function(oEvent) {
            var bGetData;
            var oArguments = oEvent.getParameter("arguments");
            if (this._sProcessKey !== oArguments.processkey) {
                (this._sProcessKey = oArguments.processkey);
                bGetData = true;
            }
            this._sStepKey = oArguments.stepkey;
            if (bGetData) {
                this.getData(true);
            } else {
                this._setSelectedFacet(this._sStepKey);
                this._setContent(this.getStepPathContext());
            }

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
            // var aSteps = this.getView().getBindingContext().getObject().Steps.__list;
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
            this._setSelectedFacet(this._sStepKey);
            this._setContent(this.getStepPathContext());
        },

        /**
         * On Facet selected set the applicable content
         */
        onFacetSelected: function(oEvent) {
            // set content
            var oSelectedItem = oEvent.getParameters("item").item;
            this._setContent(oSelectedItem.getBindingContext());

            // update the route 
            this.navToProcess(this._sProcessKey, oEvent.getParameter("key"));

        },

        getStepTitle: function(sPath) {
            var oContext = this._oModel.getContext('/' + sPath);
            return oContext.getObject().Title;
        },

        /**
         * Set the facet content based on the selected key
         * @param {[type]} sKey [description]
         */
        _setContent: function(oContext) {
            var oStep = oContext.getObject();
            var sViewPath = "scenario.xmlview.view.";
            var sStepViewName = sViewPath + oStep.StepView;


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
                    content: [sap.ui.view({
                        type: sap.ui.core.mvc.ViewType.XML,
                        viewName: sHeaderViewName
                    })]
                });
                oHeaderContent.setModel(this._oModel);
                oHeaderContent.bindElement(oContext.getPath());
                this._oThingInspector.addHeaderContent(oHeaderContent);
            }

            var oFacetContent = new sap.ui.ux3.ThingGroup({
                title: oStep.Title
            });

            oFacetContent.bindElement(oContext.getPath());
            oFacetContent.addContent(this._getView(sStepViewName));

            this._oThingInspector.addFacetContent(oFacetContent);

            //TODO = please remove
            if (oStep.StepKey === 'PARTNERS') {

                var that = this;
                that.getOwnerComponent().getEventBus().subscribe('SelectList', 'selected', function(sChannel, sEventId, oParams) {
                    // console.log('selected' + oParams.path);
                    oFacetContent.removeContent(that._getView(sStepViewName));
                    oFacetContent.bindElement(oParams.path);
                    oFacetContent.addContent(that._getView(sViewPath + 'NameSelectList'));

                    that.getOwnerComponent().getEventBus().subscribe('NameSelectList', 'selected', function(sChannel, sEventId, oParams) {
                        // console.log('selected' + oParams.path);
                        oFacetContent.removeContent(that._getView(sViewPath + 'NameSelectList'));
                        oFacetContent.addContent(that._getView(sStepViewName));
                    });
                });
            }
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
