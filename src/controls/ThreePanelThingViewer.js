sap.ui.define(["sap/ui/ux3/ThingViewer", "scenario/xmlview/controls/ThreePanelThingViewerRenderer", "scenario/xmlview/controls/VerticalNavigationBar"],
    function(ThingViewer, ThreePanelThingViewerRenderer, VerticalNavigationBar) {
        "use strict";

        var ThreePanelThingViewer = ThingViewer.extend("scenario.xmlview.controls.ThreePanelThingViewer", {
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
                },
                aggregations: {
                    "menuContent": {
                        type: "sap.ui.commons.Link",
                        multiple: true,
                        singularName: "menuContent"
                    }
                }
            }
        });
        ThreePanelThingViewer.prototype.init = function() {
            ThingViewer.prototype.init.apply(this);
            var that = this;


            var fnAttachSelect = function(oControlEvent) {
                var item = oControlEvent.getParameters().item;
                if (this.fireFacetSelected({
                        id: item.getId(),
                        key: item.getKey(),
                        item: item
                    })) {
                    this.setSelectedFacet(item);
                } else {
                    oControlEvent.preventDefault();
                }
            }.bind(this);


            this._iSelectedMenuItem = 0;
            this._oMenuButton = new sap.ui.commons.Button({
                id: this.getId() + "-menu-button",
                tooltip: "",
                lite: true,
                press: function() {
                    that._toggleMenuPopup();
                }
            });
            this._oMenuButton.addStyleClass("sapSuiteTvTitleMb");
            this.fAnyEventHandlerProxy = jQuery.proxy(this.onAnyEvent, this);
        };

        ThreePanelThingViewer.prototype.exit = function() {
            this._oMenuButton.destroy();
            jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
        };

        ThreePanelThingViewer.prototype.onAfterRendering = function() {
            this._bMenuOpened = false;
            this._updateMenuPopup();
            this._toggleHeaderContent();
        };

        ThreePanelThingViewer.prototype.selectDefaultFacet = function() {
            this._selectDefault();
            return this;
        };

        ThreePanelThingViewer.prototype._toggleMenuPopup = function() {
            jQuery.sap.byId(this.getId() + "-menu-popup").toggle();
            this._bMenuOpened = !this._bMenuOpened;

            if (this._bMenuOpened) {
                jQuery.sap.bindAnyEvent(this.fAnyEventHandlerProxy);
                this.getMenuContent()[0].focus();
                this._iSelectedMenuItem = 0;
            } else {
                jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
            }
        };

        ThreePanelThingViewer.prototype._updateMenuPopup = function() {
            var iHeaderWidth = jQuery.sap.byId(this.getId() + "-header").width();
            var oMenuPopup = jQuery.sap.byId(this.getId() + "-menu-popup");
            var sStyle = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left";
            var iSize = this.getMenuContent().length;

            oMenuPopup.css(sStyle, (iHeaderWidth - 22) + "px");
            oMenuPopup.children().each(function(index) {
                var $this = jQuery(this);
                $this.attr("tabindex", "-1");
                $this.attr("role", "menuitem");
                $this.attr("aria-posinset", index + 1);
                $this.attr("aria-setsize", iSize);
            });
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

        ThreePanelThingViewer.prototype.onAnyEvent = function(oEvent) {
            if (this._bMenuOpened && (oEvent.type == "mousedown" || oEvent.type == "focusin")) {
                var oSource = oEvent.target;
                var oDomRef = jQuery.sap.domById(this.getId() + "-menu-popup");

                if (!jQuery.sap.containsOrEquals(oDomRef, oSource) || oSource.tagName == "BODY") {
                    this._toggleMenuPopup();
                }
            }
        };

        ThreePanelThingViewer.prototype.onsapescape = function() {
            if (this._bMenuOpened) {
                this._toggleMenuPopup();
                this._oMenuButton.focus();
            }
        };

        ThreePanelThingViewer.prototype.onsapnext = function(oEvent) {
            if (this._bMenuOpened) {
                var aMenuContent = this.getMenuContent();
                this._iSelectedMenuItem++;

                if (this._iSelectedMenuItem >= aMenuContent.length) {
                    this._iSelectedMenuItem = 0;
                }

                aMenuContent[this._iSelectedMenuItem].focus();
                oEvent.preventDefault();
                oEvent.stopPropagation();
            }
        };

        ThreePanelThingViewer.prototype.onsapprevious = function(oEvent) {
            if (this._bMenuOpened) {
                var aMenuContent = this.getMenuContent();
                this._iSelectedMenuItem--;

                if (this._iSelectedMenuItem < 0) {
                    this._iSelectedMenuItem = aMenuContent.length - 1;
                }

                aMenuContent[this._iSelectedMenuItem].focus();
                oEvent.preventDefault();
                oEvent.stopPropagation();
            }
        };

        ThreePanelThingViewer.prototype.setShowHeader = function(bShowHeader) {
            this.setProperty("showHeader", bShowHeader, true);
            this._toggleHeaderContent();
            return this;
        };



        return ThreePanelThingViewer;
    }, /* bExport= */ true);
