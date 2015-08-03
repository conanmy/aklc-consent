sap.ui.define(["sap/ui/ux3/ThingViewerRenderer", "sap/ui/core/Renderer"],
	function(ThingViewerRenderer, Renderer) {
		"use strict";

		var ProcessViewerRenderer = Renderer.extend(ThingViewerRenderer);

		ProcessViewerRenderer.renderContent = function(oRm, oControl) {
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
			oRm.write("</header>");

			this.renderNavBar(oRm, oControl);

			this.renderBanner(oRm, oControl);

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

		ProcessViewerRenderer.renderNavBar = function(oRm, oControl) {
			oRm.write("<nav");
			oRm.writeAttribute("id", oControl.getId() + "-navigation");
			oRm.addClass("sapSuiteTvNav");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getSidebarWidth());
			oRm.writeStyles();
			oRm.write(">");
			oRm.renderControl(oControl._getNavBar());
			oRm.write("</nav>");
		};

		ProcessViewerRenderer.renderBanner = function(oRm, oControl) {
			var iLeft = parseInt(oControl.getSidebarWidth(), 10) + 20 + "px";

			// oRm.write("<div");
			// oRm.writeAttribute("role", "Navigation");
			// oRm.addClass("sapUiUx3TVBanner");
			// oRm.writeClasses();
			// oRm.addStyle("left", iLeft);
			// oRm.writeStyles();
			// oRm.write(">");
			// oRm.renderControl(oControl._oActionMessages);
			// // oRm.write("<div role='Navigation' class='sapUiUx3TVBanner'>");
			// // oRm.renderControl(oControl._getNavBar());
			// oRm.write("</div>");

			// render Header Content
			oRm.write("<div id='" + oControl.getId() + "-headerContent'");
			oRm.addClass("sapUiUx3TVBanner");
			oRm.writeClasses();
			oRm.addStyle("left", iLeft);
			oRm.writeStyles();
			oRm.write(">");
			this.renderHeaderContent(oRm, oControl);
			oRm.write("</div>");

		};

		ProcessViewerRenderer.renderHeaderContent = function(oRm, oControl) {
			var iRight = parseInt(oControl.getSidebarWidth(), 10) + 30 + "px";
			var headerContentList = oControl.getHeaderContent();

			for (var i = 0; i < headerContentList.length; i++) {
				var headerContent = headerContentList[i];
				oRm.write("<div");
				oRm.addClass("sapUiUx3TVhorizontal");
				oRm.addClass("pull-right");
				oRm.writeClasses();
				oRm.write(">");

				oRm.write("<div");
				oRm.addClass("sapUiUx3TVHeaderGroupContent");
				oRm.addClass("pull-right");
				oRm.writeClasses();
				oRm.addStyle("margin-right", iRight);
				oRm.writeStyles();

				oRm.write(">");
				var childContent = headerContent.getContent();
				for (var j = 0; j < childContent.length; j++) {
					var childControl = childContent[j];
					oRm.renderControl(childControl);
				}
				oRm.write("</div>");
				oRm.write("</div>");
			}
		};

		ProcessViewerRenderer.renderToolbar = function(oRm, oControl) {
			// render Toolbar
			if (oControl.getActionBar()) {
				oRm.write("<div id='" + oControl.getId() + "-toolbar' class='sapUiUx3TVToolbar'>");
				oRm.renderControl(oControl.getActionBar());
				oRm.write("</div>");
			}
		};


		ProcessViewerRenderer.renderFacetContent = function(oRm, oControl) {
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
		return ProcessViewerRenderer;
	}, /* bExport= */ true);
