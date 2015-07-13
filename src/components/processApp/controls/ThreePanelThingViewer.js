sap.ui.define(["sap/ui/ux3/ThingViewer", "./ThreePanelThingViewerRenderer", "./VerticalNavigationBar"],
    function(ThingViewer, ThreePanelThingViewerRenderer, VerticalNavigationBar) {
        "use strict";

        var ThreePanelThingViewer = ThingViewer.extend("aklc.cm.components.processApp.controls.ThreePanelThingViewer", {
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
        ThreePanelThingViewer.prototype.init = function() {
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

            var fnAfterRendering = function(){
                this._setActions();
            }.bind(this);

            //needs a DOM for setting actions
            this._getNavBar().addDelegate({
                onAfterRendering: fnAfterRendering
            });

            //Actions
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

        ThreePanelThingViewer.prototype.exit = function() {
            jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
        };

        ThreePanelThingViewer.prototype.onAfterRendering = function() {
            this._toggleHeaderContent();

            // this.getActionBar().attachActionSelected(this._actionSelected.bind(this));
            this.getActionBar().setAlwaysShowMoreMenu(false);
            this.removeAllActions();
            this.getActionBar().insertAggregation("_businessActionButtons", this._oActionNext, 0, true);
            this.getActionBar().insertAggregation("_businessActionButtons", this._oActionPrevious, 0, true);
        };

        // Implementation of API method
        ThreePanelThingViewer.prototype.setSelectedFacet = function(selectedFacet) {
            var oldSelectedFacet = this.getSelectedFacet();
            this.setAssociation("selectedFacet", selectedFacet, true);
            var newSelectedFacet = this.getSelectedFacet();

            if (oldSelectedFacet != newSelectedFacet) {
                this._getNavBar().setSelectedItem(newSelectedFacet);
                this._setActions();
            }
        };

        // Implementation of API method removeAllActions
        ThreePanelThingViewer.prototype.removeAllActions = function() {
            var result;
            if (this.getActionBar()) {
                result = this.getActionBar().removeAllBusinessActions();
            }
            return result;
        };

        ThreePanelThingViewer.prototype._setNextAction = function() {
            var oItem = this._getNavBar().getNextItem();
            return (oItem) ? oItem.getText() : undefined;
        };

        ThreePanelThingViewer.prototype._setPreviousAction = function() {
            var oItem = this._getNavBar().getPreviousItem();
            return (oItem) ? oItem.getText() : undefined;
        };

        ThreePanelThingViewer.prototype.nextStep = function() {
            var oItem = this._getNavBar().getNextItem();
            if (oItem) {
                this._fireFacetSelected(oItem);
            }
        };

        ThreePanelThingViewer.prototype.previousStep = function() {
            var oItem = this._getNavBar().getPreviousItem();
            if (oItem) {
                this._fireFacetSelected(oItem);
            }
        };

        ThreePanelThingViewer.prototype._fireFacetSelected = function(oItem) {
            this.fireFacetSelected({
                id: oItem.getId(),
                key: oItem.getKey(),
                item: oItem
            });
        };

        ThreePanelThingViewer.prototype.setActiveSteps = function(iSteps) {
            this._getNavBar().setActiveSteps(iSteps);
        };

        ThreePanelThingViewer.prototype.selectDefaultFacet = function() {
            this._selectDefault();
            return this;
        };


        ThreePanelThingViewer.prototype._setActions = function() {
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

        ThreePanelThingViewer.prototype._rerenderFacetContent = function() {
            var $content = jQuery.sap.byId(this.getId() + "-facetContent");
            if ($content.length > 0) {
                var oRm = sap.ui.getCore().createRenderManager();
                ThreePanelThingViewerRenderer.renderFacetContent(oRm, this);
                oRm.flush($content[0]);
                oRm.destroy();
                this._resize = false;
                this._setTriggerValue();
                this._onresize();
            }
        };

        ThreePanelThingViewer.prototype._rerenderHeader = function() {
            var $content = jQuery.sap.byId(this.getId() + "-header");
            if ($content.length > 0) {
                var oRm = sap.ui.getCore().createRenderManager();
                ThreePanelThingViewerRenderer.renderHeader(oRm, this);
                oRm.flush($content[0]);
                oRm.destroy();
            }
        };

        ThreePanelThingViewer.prototype._rerenderHeaderContent = function() {
            var $content = jQuery.sap.byId(this.getId() + "-headerContent");
            if ($content.length > 0) {
                var oRm = sap.ui.getCore().createRenderManager();
                ThreePanelThingViewerRenderer.renderHeaderContent(oRm, this);
                oRm.flush($content[0]);
                oRm.destroy();
            }
        };

        ThreePanelThingViewer.prototype._toggleHeaderContent = function() {
            var oContent = jQuery.sap.byId(this.getId() + "-headerContent");
            if (this.getShowHeader()) {
                oContent.show();
            } else {
                oContent.hide();
            }
        };

        ThreePanelThingViewer.prototype.setShowHeader = function(bShowHeader) {
            this.setProperty("showHeader", bShowHeader, true);
            this._toggleHeaderContent();
            return this;
        };

        ThreePanelThingViewer.prototype._getNavBar = function() {
            return this._oNavBar;
        };

        return ThreePanelThingViewer;
    }, /* bExport= */ true);
