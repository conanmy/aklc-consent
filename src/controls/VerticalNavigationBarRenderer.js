   sap.ui.define(["sap/ui/ux3/NavigationBarRenderer", "sap/ui/core/Renderer"],
       function(NavigationBarRenderer, Renderer) {
           "use strict";

           var CLASSES = scenario.xmlview.controls.VerticalNavigationBar.CLASSES;

           var VerticalNavigationBarRenderer = Renderer.extend("scenario.xmlview.controls.VerticalNavigationBarRenderer");
           VerticalNavigationBarRenderer.render = function(oRm, oControl) {
               if (!oControl.getVisible()) { // return immediately if control is invisible
                   return;
               }

               this.startNavigator(oRm, oControl);
               this.renderList(oRm, oControl);
               this.endNavigator(oRm);

           };

           VerticalNavigationBarRenderer.startNavigator = function(oRm, oControl) {
               // write the HTML into the render manager
               oRm.write("<nav");
               oRm.writeControlData(oControl);
               oRm.writeAttribute("role", "navigation");
               oRm.addClass(CLASSES.NAVBAR);
               oRm.addClass(CLASSES.NAVBAR_UPPERCASE);
               oRm.writeClasses();
               oRm.write(">");
           };

           VerticalNavigationBarRenderer.endNavigator = function(oRm) {
               oRm.write("</nav>");
           };

           VerticalNavigationBarRenderer.renderList = function(oRm, oControl) {
               this.startList(oRm, oControl);
               this.renderSteps(oRm, oControl);
               this.endList(oRm);

           };

           VerticalNavigationBarRenderer.startList = function(oRm, oControl) {
               oRm.write("<ul");
               oRm.writeAttribute("id", oControl.getId() + "-list");
               oRm.writeAttribute("role", "menubar");
               oRm.addClass(CLASSES.NAVBAR_LIST);
               oRm.writeClasses();
               oRm.write(">");
           };


           VerticalNavigationBarRenderer.endList = function(oRm) {
               oRm.write("</ul>");
           };


           VerticalNavigationBarRenderer.renderSteps = function(oRm, oControl) {
               var iStepCount = oControl.getItems().length;

               for (var i = 0; i < iStepCount; i++) {
                   this.startStep(oRm, oControl, i);
                   this.renderAnchor(oRm, oControl, i);
                   this.endStep(oRm);
                   this.renderArrow(oRm, oControl); //??
               }

           };

           VerticalNavigationBarRenderer.startStep = function(oRm, oControl, iStepNumber) {
               var oItem = oControl.getItems()[iStepNumber];
               var selectedItemId = oControl.getSelectedItem();
               var bIsSelected = (oItem.getId() === selectedItemId);

               oRm.write("<li");
               oRm.addClass(CLASSES.NAVBAR_ITEM);
               if (bIsSelected) {
                   oRm.addClass(CLASSES.NAVBAR_ITEM_SELECTED);
               }
               oRm.writeClasses();
               oRm.write(">");

           };

           VerticalNavigationBarRenderer.endStep = function(oRm) {
               oRm.write("</li>");
           };

           VerticalNavigationBarRenderer.renderAnchor = function(oRm, oControl, iStepNumber) {
               var oItem = oControl.getItems()[iStepNumber];

               oRm.write("<div");
               oRm.writeAttribute("id", oItem.getId());
               oRm.addClass(CLASSES.NAVBAR_ITEM_LINK);
               oRm.writeClasses();
               oRm.write(">");

               oRm.write("<div");
               oRm.addClass(CLASSES.NAVBAR_ICON_DIV);
               oRm.writeClasses();
               oRm.write(">");
               //icon
               var sIcon = oItem.getIcon();
               var oIconAttr;
               if (sIcon) {
                   if (sIcon.indexOf("sap-icon://") !== 0) {
                       //setting title & tabindex here
                       //alt, src and role=presentation are set by writeIcon
                       oIconAttr = {
                           title: '',
                           tabindex: "-1"
                       };
                   }
                   oRm.writeIcon(sIcon, CLASSES.NAVBAR_ICON, oIconAttr);
               }
               oRm.write("</div>");

               oRm.write("<div");
               oRm.addClass(CLASSES.ITEM_NAME);
               oRm.writeClasses();
               oRm.write(">");
               oRm.writeEscaped(oItem.getText());
               oRm.write("</div>");


               oRm.write("</div>");

           };

           VerticalNavigationBarRenderer.renderArrow = function(oRm, oControl) {
               oRm.write("<span");
               oRm.writeAttribute("id", oControl.getId() + "-arrow");
               oRm.writeAttribute("style", "display:none;");
               oRm.write("></span>");
           };
           return VerticalNavigationBarRenderer;
       }, /* bExport= */ true);
