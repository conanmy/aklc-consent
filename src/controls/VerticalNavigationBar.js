   sap.ui.define(["sap/ui/ux3/NavigationBar"],
       function(NavigationBar) {
           "use strict";

           var VerticalNavigationBar = NavigationBar.extend("scenario.xmlview.controls.VerticalNavigationBar");

           VerticalNavigationBar.CLASSES = {
               NAVBAR: "sapSuiteTvNavBar",
               NAVBAR_UPPERCASE: "sapUiUx3NavBarUpperCase",
               NAVBAR_LIST: "sapSuiteTvNavBarList",
               NAVBAR_ITEM: "sapSuiteTvNavBarItem",
               NAVBAR_ITEM_SELECTED: "sapUiUx3NavBarItemSel",
               NAVBAR_ITEM_LINK: "sapSuiteTvNavBarItemLink",
               NAVBAR_ICON: "sapSuiteTvNavBarIcon",
               NAVBAR_ICON_DIV: "sapSuiteTvNavBarIconDiv",
               ITEM_NAME: "sapSuiteTvNavBarItemName",
           };

           VerticalNavigationBar.prototype._handleActivation = function(oEvent) {
               if (!oEvent.target.id) {
                   oEvent.target = jQuery(oEvent.target).closest("." + VerticalNavigationBar.CLASSES.NAVBAR_ITEM_LINK)[0];
               }
               sap.ui.ux3.NavigationBar.prototype._handleActivation.call(this, oEvent);
           };

           VerticalNavigationBar.prototype.onAfterRendering = function() {
               sap.ui.ux3.NavigationBar.prototype.onAfterRendering.apply(this);

               if (!this._oBarItemsMap) {
                   this._oBarItemsMap = {};
               }
           };

           VerticalNavigationBar.prototype.exit = function() {
               this._oBarItemsMap = null;
               sap.ui.ux3.NavigationBar.prototype.exit.apply(this);
           };

           VerticalNavigationBar.prototype._handleScroll = function() {};


           return VerticalNavigationBar;
       }, /* bExport= */ true);
