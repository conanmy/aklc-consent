sap.ui.define(["sap/ui/ux3/NavigationBarRenderer", "sap/ui/core/Renderer", "./VerticalNavigationBar"],
	function(NavigationBarRenderer, Renderer, VerticalNavigationBar) {
		"use strict";

		var CLASSES = VerticalNavigationBar.CLASSES;
		var ATTRIBUTES = VerticalNavigationBar.ATTRIBUTES;

		var VerticalNavigationBarRenderer = Renderer.extend("aklc.cm.components.processApp.controls.VerticalNavigationBarRenderer");
		VerticalNavigationBarRenderer.render = function(oRm, oControl) {
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

			for (var i = 1; i <= iStepCount; i++) {
				this.startStep(oRm, oControl, i);
				this.renderAnchor(oRm, oControl, i);
				this.endStep(oRm);
				this.renderArrow(oRm, oControl); //??
			}
		};

		VerticalNavigationBarRenderer.startStep = function(oRm, oControl, iStepNumber) {
			oRm.write("<li");
			oRm.addClass(CLASSES.NAVBAR_ITEM);
			oRm.writeAttribute(ATTRIBUTES.STEP, iStepNumber);
			oRm.writeClasses();
			oRm.write(">");

		};

		VerticalNavigationBarRenderer.endStep = function(oRm) {
			oRm.write("</li>");
		};

		VerticalNavigationBarRenderer.renderAnchor = function(oRm, oControl, iStepNumber) {
			var oItem = oControl.getItems()[iStepNumber - 1];

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
				oRm.writeIcon(sIcon, CLASSES.NAVBAR_ICON, oIconAttr);
				oRm.writeIcon("sap-icon://accept", CLASSES.NAVBAR_ICON_ACCEPT);
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
			// oRm.writeAttribute("style", "display:none;");
			oRm.addClass();
			oRm.write("; class='sapSuiteTvNavBarArrow'></span>");
		};
		return VerticalNavigationBarRenderer;
	}, /* bExport= */ true);
