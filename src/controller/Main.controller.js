sap.ui.define(["scenario/xmlview/controller/BaseController"], function(BaseController) {
    "use strict";
    return BaseController.extend("scenario.xmlview.controller.Main", {
        sProceessCollection: "/Process",
        sStepsCollection: "Steps",
        sProcessKey: "",
        sStepKey: "",

        onInit: function() {
            this.getRouter().attachRouteMatched(this.routeMatched.bind(this));

            this.oThingInspector = this.getView().byId("TI");
            this.oModel = this.getComponent().getModel();
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

        onProcessRoute: function(oEvent) {
            var bGetData;
            var oArguments = oEvent.getParameter("arguments");
            if (this.sProcessKey !== oArguments.processkey) {
                (this.sProcessKey = oArguments.processkey);
                bGetData = true;
            }
            this.sStepKey = oArguments.stepkey;
            if (bGetData) {
                this.getData(true);
            } else {
                this.setSelectedFacet(this.sStepKey);
                this.setContent(this.getStepPathContext());
            }

        },
        /**
         * Retrieve Process entity with Steps Entity Inline
         * @param  {[type]} bReload [description]
         * @return {[type]}         [description]
         */
        getData: function(bReload) {
            this.sPath = this.sProceessCollection + "('" + this.sProcessKey + "')";
            var fnCallback = this.bindView.bind(this);
            var oParams = {
                expand: this.sStepsCollection
            };
            this.getView().setBusy(true);
            this.oModel.createBindingContext(this.sPath, null, oParams, fnCallback, bReload);
        },

        /**
         * [getStepPathContext description]
         * @param  {[type]} oContext [description]
         * @return {[type]}          [description]
         */
        getStepPathContext: function() {
            var aSteps = this.getView().getBindingContext().getObject().Steps.__list;
            var sFind = "StepKey='" + this.sStepKey + "'";

            var fnFilter = function(value) {
                return (value.indexOf(sFind) > -1);
            };

            var sFilterPath = aSteps.filter(fnFilter)[0];
            var sPath = sFilterPath ? '/' + sFilterPath : '/' + aSteps[0];

            return this.oModel.getContext(sPath);
        },

        /**
         * Set the step key selected
         * @param {[type]} sStepKey [description]
         */
        setSelectedFacet: function(sStepKey) {
            var fnFilter = function(oItem) {
                return oItem.getKey() === sStepKey;
            };
            var oItem = this.oThingInspector.getFacets().filter(fnFilter)[0];
            this.oThingInspector.setSelectedFacet(oItem);
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
            this.setSelectedFacet(this.sStepKey);
            this.setContent(this.getStepPathContext());
        },

        /**
         * On Facet selected set the applicable content
         */
        onFacetSelected: function(oEvent) {
            // set content
            var oSelectedItem = oEvent.getParameters("item").item;
            this.setContent(oSelectedItem.getBindingContext());

            // update the route 
            this.navToProcess(this.sProcessKey, oEvent.getParameter("key"));

        },

        getStepTitle: function(sPath) {
            var oContext = this.oModel.getContext('/' + sPath);
            return oContext.getObject().Title;
        },

        /**
         * Set the facet content based on the selected key
         * @param {[type]} sKey [description]
         */
        setContent: function(oContext) {
            var oStep = oContext.getObject();
            var sViewPath = "scenario.xmlview.view.";
            var sStepViewName = sViewPath + oStep.StepView;

            //remove existing content
            this.oThingInspector.removeAllFacetContent();
            this.oThingInspector.removeAllHeaderContent();



            // show header details
            this.oThingInspector.setShowHeader(oStep.ShowHeader);
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
                oHeaderContent.setModel(this.oModel);
                oHeaderContent.bindElement(oContext.getPath());
                this.oThingInspector.addHeaderContent(oHeaderContent);

            }

            var oFacetContent = new sap.ui.ux3.ThingGroup({
                title: oStep.Title
            });

            if (oStep.StepView === "Detail") {

                var oModel = this.getView().getModel();
                var fnHandler = function(oEvent) {
                    oBinding.detachChange(fnHandler);

                    var mapCallback = function(oContext) {
                        var oData = jQuery.extend({}, oContext.getObject());
                        var aLookup = oData.Lookup.__list;
                        oData.Path = oContext.getPath();
                        oData.Lookup = aLookup.map(function(sPath) {
                            return oModel.getContext('/' + sPath).getObject();
                        });
                        return oData;
                    };

                    //map fields collection to json format
                    var aFields = oEvent.oSource.getContexts().map(mapCallback);
                    var oViewModel = new sap.ui.model.json.JSONModel({
                        Fields: aFields
                    });

                    // Create view passing the JSON Model
                    var oDetailView = sap.ui.view({
                        preprocessors: {
                            xml: {
                                models: {
                                    vm: oViewModel
                                }
                            }
                        },
                        type: sap.ui.core.mvc.ViewType.XML,
                        viewName: sStepViewName
                    });

                    oFacetContent.addContent(oDetailView);

                };

                var oBinding = oModel.bindList("Fields", oContext, null, null, {
                    expand: "Lookup"
                }).initialize();
                oBinding.attachRefresh(function() {
                    oBinding.getContexts();
                });
                oBinding.attachChange(fnHandler);
                oBinding.getContexts();

            } else {
                // Facet Content thing group with view embedded
                oFacetContent.addContent(sap.ui.view({
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: sStepViewName
                }));

            }

            this.oThingInspector.addFacetContent(oFacetContent);
        }
    });

});
