   sap.ui.define(["sap/ui/ux3/ThingInspector", "scenario/xmlview/controls/ThreePanelThingViewer", "sap/ui/ux3/ThingAction", "scenario/xmlview/controls/VerticalNavigationBar"],
       function(ThingInspector, ThreePanelThingViewer, ThingAction, VerticalNavigationBar) {
           "use strict";

           var ThreePanelThingInspector = ThingInspector.extend("scenario.xmlview.controls.ThreePanelThingInspector", {
               metadata: {
                   properties: {
                       "showHeader": {
                           type: "boolean",
                           group: "Misc",
                           defaultValue: true
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

               //NavBar
               this._oThingViewer._oNavBar = new VerticalNavigationBar();
               this._oThingViewer.setAggregation("navBar", this._oThingViewer._oNavBar);

               var fnAttachSelect = function(oControlEvent) {
                   var item = oControlEvent.getParameters().item;
                   if (this.fireFacetSelected({
                           id: item.getId(),
                           key: item.getKey(),
                           item: item
                       })) {

                       this.setSelectedFacet(item);
                       that._setActions();
                   } else {
                       oControlEvent.preventDefault();
                   }
               }.bind(this);

               this._getNavBar().attachSelect(fnAttachSelect);

               var fnAfterRendering = function() {
                   this._setActions();
               }.bind(this);

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

           ThreePanelThingInspector.prototype.onAfterRendering = function() {
               ThingInspector.prototype.onAfterRendering.apply(this);
               this.getActionBar().attachActionSelected(this._actionSelected.bind(this));
               this.getActionBar().setAlwaysShowMoreMenu(false);
               this.removeAllActions();
               this.getActionBar().insertAggregation("_businessActionButtons", this._oActionNext, 0, true);
               this.getActionBar().insertAggregation("_businessActionButtons", this._oActionPrevious, 0, true);

           };

           ThreePanelThingInspector.prototype.setShowHeader = function(showHeader) {
               this._oThingViewer.setShowHeader(showHeader);
               return this;
           };

           ThreePanelThingInspector.prototype.getShowHeader = function() {
               this._oThingViewer.getShowHeader();
           };

           ThreePanelThingInspector.prototype.getSidebarWidth = function() {
               this._oThingViewer.getSidebarWidth();
           };

           ThreePanelThingInspector.prototype.setSidebarWidth = function(oWidth) {
               this._oThingViewer.setSidebarWidth(oWidth);
               return this;
           };

           ThreePanelThingInspector.prototype._setActions = function() {
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

           ThreePanelThingInspector.prototype._setAction = function(oControl) {},

               ThreePanelThingInspector.prototype._setNextAction = function() {
                   var oItem = this._getNavBar().getNextItem();
                   return (oItem) ? oItem.getText() : undefined;
               };

           ThreePanelThingInspector.prototype._setPreviousAction = function() {
               var oItem = this._getNavBar().getPreviousItem();
               return (oItem) ? oItem.getText() : undefined;
           };

           ThreePanelThingInspector.prototype._actionSelected = function(oEvent) {
               var oAction = oEvent.getParameter("action");
               var sActionId = oAction.getId();

               if (sActionId == "next") {
                   this._nextStep();
               }

               if (sActionId == "previous") {
                   this._previousStep();
               }
           };

           ThreePanelThingInspector.prototype.nextStep = function() {
               this._getNavBar().nextStep();
           };

           ThreePanelThingInspector.prototype.previousStep = function() {
               this._getNavBar().previousStep();
           };

           return ThreePanelThingInspector;
       }, /* bExport= */ true);
