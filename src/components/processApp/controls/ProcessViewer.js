sap.ui.define(["sap/ui/ux3/ThingViewer", "sap/ui/ux3/ActionBar", "./ProcessViewerRenderer", "./VerticalNavigationBar"],
    function(ThingViewer, ActionBar, ProcessViewerRenderer, VerticalNavigationBar) {
        "use strict";

        var ProcessViewer = ThingViewer.extend("aklc.cm.components.processApp.controls.ProcessViewer", {
            metadata: {

                // ---- object ----
                publicMethods: [
                    // methods
                    "selectDefaultFacet"
                ],

                // ---- control specific ----
                properties: {
                    "logo": {
                        type: "sap.ui.core.URI",
                        group: "Misc",
                        defaultValue: null
                    },
                    "showHeader": {
                        type: "boolean",
                        group: "Misc",
                        defaultValue: null
                    },
                    "sidebarWidth": {
                        type: "sap.ui.core.CSSSize",
                        group: "Misc",
                        defaultValue: '224px'
                    }
                }
            }
        });
        ProcessViewer.prototype.init = function() {
            ThingViewer.prototype.init.apply(this);
            this.fAnyEventHandlerProxy = jQuery.proxy(this.onAnyEvent, this);

            //NavBar
            this._oNavBar = new VerticalNavigationBar();
            this.setAggregation("navBar", this._oNavBar);

            var fnAttachSelect = function(oEvent) {
                var oItem = oEvent.getParameters().item;
                this._fireFacetSelected(oItem);
            }.bind(this);

            this._getNavBar().attachSelect(fnAttachSelect);

            var fnAfterRendering = function() {
                this._setActions();
            }.bind(this);

            //needs a DOM for setting actions
            this._getNavBar().addDelegate({
                onAfterRendering: fnAfterRendering
            });

            //ActionBar
            var oActionBar = new ActionBar({
                showUpdate: false,
                showFollow: false,
                showFlag: false,
                showFavorite: false,
                showOpen: false
            });

            this.setAggregation("actionBar", oActionBar);

            this._oActionNext = new sap.ui.commons.Button({ //new ThingAction({
                id: "next",
                icon: "sap-icon://navigation-right-arrow",
                iconFirst: false,
                press: this.nextStep.bind(this),
                visible: false
            });

            this._oActionPrevious = new sap.ui.commons.Button({ //new ThingAction({
                id: "previous",
                icon: "sap-icon://navigation-left-arrow",
                press: this.previousStep.bind(this),
                visible: false
            });
        };

        ProcessViewer.prototype.exit = function() {
            this._getNavBar().destroy();
            this.getActionBar().destroy();
            this._oActionNext.destroy();
            this._oActionPrevious.destroy();
            jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
        };

        ProcessViewer.prototype.onAfterRendering = function() {
            this.removeAllActions();
            this.addNavigationActions();
        };

        // Implementation of API method
        ProcessViewer.prototype.setSelectedFacet = function(selectedFacet) {
            var oldSelectedFacet = this.getSelectedFacet();
            this.setAssociation("selectedFacet", selectedFacet, true);
            var newSelectedFacet = this.getSelectedFacet();

            if (oldSelectedFacet != newSelectedFacet) {
                this._getNavBar().setSelectedItem(newSelectedFacet);
                this._setActions();
            }
        };

        // Implementation of API method removeAllActions
        ProcessViewer.prototype.removeAllActions = function() {
            var result;
            if (this.getActionBar()) {
                result = this.getActionBar().removeAllBusinessActions();
            }
            return result;
        };

        ProcessViewer.prototype.addNavigationActions = function() {
            if (this.getActionBar()) {
                this.getActionBar().insertAggregation("_businessActionButtons", this._oActionNext, 0, true);
                this.getActionBar().insertAggregation("_businessActionButtons", this._oActionPrevious, 0, true);
            }
        };

        ProcessViewer.prototype._setNextAction = function() {
            var oItem = this._getNavBar().getNextItem();
            return (oItem) ? oItem.getText() : undefined;
        };

        ProcessViewer.prototype._setPreviousAction = function() {
            var oItem = this._getNavBar().getPreviousItem();
            return (oItem) ? oItem.getText() : undefined;
        };

        ProcessViewer.prototype.nextStep = function() {
            var oItem = this._getNavBar().getNextItem();
            if (oItem) {
                this._fireFacetSelected(oItem);
            }
        };

        ProcessViewer.prototype.previousStep = function() {
            var oItem = this._getNavBar().getPreviousItem();
            if (oItem) {
                this._fireFacetSelected(oItem);
            }
        };

        ProcessViewer.prototype._fireFacetSelected = function(oItem) {
            this.fireFacetSelected({
                id: oItem.getId(),
                key: oItem.getKey(),
                item: oItem
            });
        };

        ProcessViewer.prototype.setActiveSteps = function(iSteps) {
            this._getNavBar().setActiveSteps(iSteps);
        };

        ProcessViewer.prototype.selectDefaultFacet = function() {
            this._selectDefault();
            return this;
        };


        ProcessViewer.prototype._setActions = function() {
            if (this._setNextAction()) {
                this._oActionNext.setVisible(true);
                this._oActionNext.setText(this._setNextAction());
            } else {
                this._oActionNext.setVisible(false);
            }

            if (this._setPreviousAction()) {
                this._oActionPrevious.setVisible(true);
                this._oActionPrevious.setText(this._setPreviousAction());
            } else {
                this._oActionPrevious.setVisible(false);
            }
        };

        ProcessViewer.prototype._rerenderFacetContent = function() {
            var $content = jQuery.sap.byId(this.getId() + "-facetContent");
            if ($content.length > 0) {
                var oRm = sap.ui.getCore().createRenderManager();
                ProcessViewerRenderer.renderFacetContent(oRm, this);
                oRm.flush($content[0]);
                oRm.destroy();
                this._resize = false;
                this._setTriggerValue();
                this._onresize();
            }
        };

        ProcessViewer.prototype._getNavBar = function() {
            return this._oNavBar;
        };

        return ProcessViewer;
    }, /* bExport= */ true);
