   sap.ui.define(["sap/ui/ux3/ThingViewerRenderer", "sap/ui/core/Renderer"],
       function(ThingViewerRenderer, Renderer) {
           "use strict";

           var ThreePanelThingViewerRenderer = Renderer.extend(ThingViewerRenderer);

           ThreePanelThingViewerRenderer.renderContent = function(oRm, oControl) {
               oRm.write("<div");
               oRm.addClass("sapSuiteTvMinHeight");
               oRm.writeClasses();
               oRm.write(">");

               oRm.write("<header");
               oRm.writeAttribute("id", oControl.getId() + "-header");
               oRm.addClass("sapSuiteTvTitle");
               oRm.writeClasses();
               oRm.addStyle("width", oControl.getSidebarWidth());
               oRm.writeStyles();
               oRm.write(">");
               // this.renderHeader(oRm, oControl);
               oRm.write("</header>");


               this.renderNavBar(oRm, oControl);

               this.renderBanner(oRm, oControl);

               oRm.write("<aside");
               oRm.writeAttribute("id", oControl.getId() + "-headerContent");
               oRm.addClass("sapSuiteTvHeader");
               oRm.writeClasses();
               oRm.write(">");
               this.renderHeaderContent(oRm, oControl);
               oRm.write("</aside>");

               oRm.write("<div");
               oRm.writeAttribute("id", oControl.getId() + "-facetContent");
               oRm.addClass("sapSuiteTvFacet");
               oRm.writeClasses();
               oRm.write(">");
               this.renderFacetContent(oRm, oControl);
               oRm.write("</div>");

               this.renderToolbar(oRm, oControl);
               oRm.write("</div>");
           };

           ThreePanelThingViewerRenderer.renderNavBar = function(oRm, oControl) {
               oRm.write("<nav");
               oRm.writeAttribute("id", oControl.getId() + "-navigation");
               oRm.addClass("sapSuiteTvNav");

               oRm.addClass("sapSuiteTvNavNoLogo");

               oRm.writeClasses();
               oRm.addStyle("width", oControl.getSidebarWidth());
               oRm.writeStyles();
               oRm.write(">");
               oRm.renderControl(oControl._getNavBar());
               oRm.write("</nav>");
           };


           ThreePanelThingViewerRenderer.renderHeader = function(oRm, oControl) {
               oRm.write("<div");
               oRm.addClass("sapSuiteTvTitleBar");
               oRm.writeClasses();
               oRm.write(">");
               if (oControl.getIcon()) {
                   oRm.write("<img");
                   oRm.writeAttribute("id", oControl.getId() + "-swatch");
                   oRm.writeAttribute("role", "presentation");
                   oRm.writeAttributeEscaped("src", oControl.getIcon());
                   oRm.addClass("sapSuiteTvTitleIcon");
                   oRm.writeClasses();
                   oRm.write("/>");
               }

               oRm.write("<div");
               oRm.writeAttribute("role", "heading");
               oRm.writeAttribute("aria-level", 1);
               oRm.writeAttributeEscaped("title", oControl.getType());
               oRm.addClass("sapSuiteTvTitleType");
               oRm.addClass("sapSuiteTvTextCrop");
               oRm.writeClasses();
               oRm.write(">");
               oRm.writeEscaped(oControl.getType());
               oRm.write("</div>");

               oRm.write("<div");
               oRm.writeAttribute("role", "heading");
               oRm.writeAttribute("aria-level", 2);
               oRm.writeAttributeEscaped("title", oControl.getTitle());
               oRm.addClass("sapSuiteTvTitleFirst");
               oRm.writeClasses();
               oRm.write(">");
               oRm.writeEscaped(oControl.getTitle());
               oRm.write("</div>");

               oRm.write("<div");
               oRm.writeAttribute("role", "heading");
               oRm.writeAttribute("aria-level", 3);
               oRm.writeAttributeEscaped("title", oControl.getSubtitle());
               oRm.addClass("sapSuiteTvTitleSecond");
               oRm.addClass("sapSuiteTvTextCrop");
               oRm.writeClasses();
               oRm.write(">");
               oRm.writeEscaped(oControl.getSubtitle());
               oRm.write("</div>");
               oRm.write("</div>");
           };

           ThreePanelThingViewerRenderer.renderBanner = function(oRm, oControl) {
               var iLeft = parseInt(oControl.getSidebarWidth(),10) + 20 + "px";

               oRm.write("<div");
               oRm.writeAttribute("role", "Navigation");
               oRm.addClass("sapUiUx3TVBanner");
               oRm.writeClasses();
               oRm.addStyle("left", iLeft);
               oRm.writeStyles();
               oRm.write(">");
               // oRm.write("<div role='Navigation' class='sapUiUx3TVBanner'>");
               // oRm.renderControl(oControl._getNavBar());
               oRm.write("</div>");

           };

           ThreePanelThingViewerRenderer.renderToolbar = function(oRm, oControl) {
               // render Toolbar
               if (oControl.getActionBar()) {
                   oRm.write("<div id='" + oControl.getId() + "-toolbar' class='sapUiUx3TVToolbar'>");
                   oRm.renderControl(oControl.getActionBar());
                   oRm.write("</div>");
               }
           };


           ThreePanelThingViewerRenderer.renderFacetContent = function(oRm, oControl) {
               var aFacetContent = oControl.getFacetContent();
               for (var i = 0; i < aFacetContent.length; i++) {
                   var oGroup = aFacetContent[i];

                   oRm.write("<div");
                   oRm.writeAttribute("role", "form");
                   if (oGroup.getColspan()) {
                       oRm.addClass("sapUiUx3TVFacetThingGroupSpan");
                   } else {
                       oRm.addClass("sapUiUx3TVFacetThingGroup");
                   }
                   oRm.writeClasses();
                   oRm.write(">");
                   oRm.write("<div");
                   oRm.writeAttributeEscaped("title", oGroup.getTitle());
                   oRm.addClass("sapUiUx3TVFacetThingGroupContentTitle");
                   oRm.writeClasses();
                   oRm.write(">");
                   oRm.write("<span>");
                   oRm.writeEscaped(oGroup.getTitle());
                   oRm.write("</span>");
                   oRm.write("</div>");

                   oRm.write("<div");
                   oRm.addClass("sapUiUx3TVFacetThingGroupContent");
                   oRm.writeClasses();
                   oRm.write(">");
                   var oGroupContent = oGroup.getContent();
                   for (var j = 0; j < oGroupContent.length; j++) {
                       oRm.renderControl(oGroupContent[j]);
                   }
                   oRm.write("</div>");
                   oRm.write("</div>");
               }
           };
           return ThreePanelThingViewerRenderer;
       }, /* bExport= */ true);
