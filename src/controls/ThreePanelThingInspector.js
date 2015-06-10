   sap.ui.define(["sap/ui/ux3/ThingInspector", "scenario/xmlview/controls/ThreePanelThingViewer"],
       function(ThingInspector, ThreePanelThingViewer) {
           "use strict";

           var ThreePanelThingInspector = ThingInspector.extend("scenario.xmlview.controls.ThreePanelThingInspector", {
               metadata: {
                   properties: {
                       "showHeader": {
                           type: "boolean",
                           group: "Misc",
                           defaultValue: true
                       },
                       "logo": {
                           type: "sap.ui.core.URI",
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

           ThreePanelThingInspector.prototype.init = function() {
               ThingInspector.prototype.init.apply(this);

               var that = this;
               this._oThingViewer.destroy();
               this._oThingViewer = new ThreePanelThingViewer(this.getId() + "-thingViewer");
               this.setAggregation("thingViewer", this._oThingViewer);

               this._oThingViewer.attachFacetSelected(function(oEvent) {
                   var oItem = oEvent.getParameters().item;

                   if (that.fireFacetSelected({
                           id: oItem.getId(),
                           key: oItem.getKey(),
                           item: oItem
                       })) {
                       that.setSelectedFacet(oItem);
                   } else {
                       oEvent.preventDefault();
                   }
               });
           };

           ThreePanelThingInspector.prototype.setShowHeader = function(showHeader) {
               this._oThingViewer.setShowHeader(showHeader);
               return this;
           };

           ThreePanelThingInspector.prototype.getShowHeader = function() {
               this._oThingViewer.getShowHeader();
           };

           ThreePanelThingInspector.prototype.setLogo = function(oUri) {
               this._oThingViewer.setLogo(oUri);
               return this;
           };

           ThreePanelThingInspector.prototype.getLogo = function() {
               this._oThingViewer.getLogo();
           };

           ThreePanelThingInspector.prototype.getSidebarWidth = function() {
               this._oThingViewer.getSidebarWidth();
           };

           ThreePanelThingInspector.prototype.setSidebarWidth = function(oWidth) {
               this._oThingViewer.setSidebarWidth(oWidth);
               return this;
           };

           ThreePanelThingInspector.prototype.addMenuContent = function(oContent) {
               this._oThingViewer.addMenuContent(oContent);
               return this;
           };

           ThreePanelThingInspector.prototype.insertMenuContent = function(oContent, iIndex) {
               this._oThingViewer.insertMenuContent(oContent, iIndex);
               return this;
           };

           ThreePanelThingInspector.prototype.getMenuContent = function() {
               return this._oThingViewer.getMenuContent();
           };

           ThreePanelThingInspector.prototype.removeMenuContent = function(oContent) {
               return this._oThingViewer.removeMenuContent(oContent);
           };

           ThreePanelThingInspector.prototype.removeAllMenuContent = function() {
               return this._oThingViewer.removeAllMenuContent();
           };

           ThreePanelThingInspector.prototype.indexOfMenuContent = function(oContent) {
               return this._oThingViewer.indexOfMenuContent(oContent);
           };

           ThreePanelThingInspector.prototype.destroyMenuContent = function() {
               this._oThingViewer.destroyMenuContent();
               return this;
           };

           return ThreePanelThingInspector;
       }, /* bExport= */ true);
