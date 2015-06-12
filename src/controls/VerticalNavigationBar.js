   sap.ui.define(["sap/ui/ux3/NavigationBar"],
       function(NavigationBar) {
           "use strict";

           var VerticalNavigationBar = NavigationBar.extend("scenario.xmlview.controls.VerticalNavigationBar");

           VerticalNavigationBar.prototype._handleActivation = function(oEvent) {
               // add forwarding to parent since IE doesn't support 'pointer-events:none;'
               // if (oEvent.target.tagName === "SPAN" ) {
               //     oEvent.target = oEvent.target.parentElement;
               // }

               if (!oEvent.target.id) {
                   oEvent.target = jQuery(oEvent.target).closest(".sapSuiteTvNavBarItemLink")[0];
               }
               sap.ui.ux3.NavigationBar.prototype._handleActivation.call(this, oEvent);
           };

           VerticalNavigationBar.prototype.onAfterRendering = function() {
               sap.ui.ux3.NavigationBar.prototype.onAfterRendering.apply(this);

               if (!this._oBarItemsMap) {
                   this._oBarItemsMap = {};
               }

               // var that = this;

               // jQuery(".sapSuiteTvNavBarItemLink").mousemove(function() {
               //     that._showTooltip(jQuery(this).attr("id"));
               // }).mouseleave(function(oEvent) {
               //     that._hideTooltip(jQuery(this).attr("id"));
               // });
           };

           VerticalNavigationBar.prototype.exit = function() {
               this._oBarItemsMap = null;
               sap.ui.ux3.NavigationBar.prototype.exit.apply(this);
           };

           VerticalNavigationBar.prototype._handleScroll = function() {};

           VerticalNavigationBar.prototype._showTooltip = function(sTargetId) {
               var oItem = this._oBarItemsMap[sTargetId];
               if (!oItem) {
                   oItem = sap.ui.getCore().byId(sTargetId);

                   if (oItem) {
                       this._oBarItemsMap[sTargetId] = oItem;

                       var oTooltip = new sap.ui.commons.RichTooltip({
                           text: oItem.getTooltip_AsString() || oItem.getText()
                       });

                       oTooltip.addStyleClass("sapSuiteTvNavBarItemTltp");

                       oTooltip._currentControl = oItem;
                       oItem.addDelegate(oTooltip);
                       oItem.setAggregation("tooltip", oTooltip, true);
                   }
               }

               if (oItem && !oItem.doOpen) {
                   oItem.doOpen = true;
                   oItem.openTimer = setTimeout(function() {
                       oItem.getTooltip().openPopup(oItem);

                       oItem.closeTimer = setTimeout(function() {
                           oItem.getTooltip().closePopup();
                           oItem.doOpen = false;
                       }, 10000);
                   }, 2000);
               }
           };

           VerticalNavigationBar.prototype._hideTooltip = function(sTargetId) {
               var oItem = this._oBarItemsMap[sTargetId];
               if (oItem) {
                   oItem.doOpen = false;
                   clearTimeout(oItem.openTimer);
                   clearTimeout(oItem.closeTimer);
                   oItem.getTooltip().closePopup();
               }
           };
           return VerticalNavigationBar;
       }, /* bExport= */ true);
