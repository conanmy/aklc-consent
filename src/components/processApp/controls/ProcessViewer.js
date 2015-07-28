sap.ui.define(["sap/ui/ux3/ThingViewer", "sap/ui/ux3/ActionBar", "./ProcessViewerRenderer", "./VerticalNavigationBar"],
	function(ThingViewer, ActionBar, ProcessViewerRenderer, VerticalNavigationBar) {
		"use strict";

		var ProcessViewer = ThingViewer.extend("aklc.cm.components.processApp.controls.ProcessViewer", {
			metadata: {

				// ---- object ----
				publicMethods: [
					// methods
					"selectDefaultFacet"
				],

				// ---- control specific ----
				properties: {
					"sidebarWidth": {
						type: "sap.ui.core.CSSSize",
						group: "Misc",
						defaultValue: "224px"
					}
				}
			}
		});

		ProcessViewer.prototype.init = function() {
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

			var fnAfterRendering = function() {
				this._setActions();
			}.bind(this);

			//needs a DOM for setting actions
			this._getNavBar().addDelegate({
				onAfterRendering: fnAfterRendering
			});

			//ActionBar
			var oActionBar = new ActionBar({
				showUpdate: false,
				showFollow: false,
				showFlag: false,
				showFavorite: false,
				showOpen: false
			});

			this.setAggregation("actionBar", oActionBar);

			this._oActionNext = new sap.ui.commons.Button({
				id: "next",
				icon: "sap-icon://navigation-right-arrow",
				iconFirst: false,
				press: this.gotoNextStep.bind(this),
				visible: false
			});

			this._oActionPrevious = new sap.ui.commons.Button({
				id: "previous",
				icon: "sap-icon://navigation-left-arrow",
				press: this.gotoPreviousStep.bind(this),
				visible: false
			});

			this._oActionMessages = new sap.ui.commons.Button({
				id: "messages",
				icon: "sap-icon://alert",
				text: {
					path: "msg>/",
					formatter: function(aMsg) {
						return aMsg.length;
					}
				},
				visible: {
					path: "msg>/",
					formatter: function(aMsg) {
						return aMsg.length > 0;
					}
				},
				press: this.showMessages.bind(this)
			});
			this._oActionMessages.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "msg");
			this.addNavigationActions();
		};

		ProcessViewer.prototype.exit = function() {
			this._getNavBar().destroy();
			this.getActionBar().destroy();
			this._oActionNext.destroy();
			this._oActionPrevious.destroy();
			jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
		};

		ProcessViewer.prototype.setSelectedFacet = function(selectedFacet) {
			var oldSelectedFacet = this.getSelectedFacet();
			this.setAssociation("selectedFacet", selectedFacet, true);
			var newSelectedFacet = this.getSelectedFacet();

			if (oldSelectedFacet !== newSelectedFacet) {
				this._getNavBar().setSelectedItem(newSelectedFacet);
				this._setActions();
			}
		};

		ProcessViewer.prototype.addNavigationActions = function() {
			if (this.getActionBar()) {
				this.getActionBar().insertAggregation("_businessActionButtons", this._oActionNext, 0, true);
				this.getActionBar().insertAggregation("_businessActionButtons", this._oActionPrevious, 0, true);
				this.getActionBar().insertAggregation("_businessActionButtons", this._oActionMessages, 0, true);
			}
		};

		ProcessViewer.prototype._getNextAction = function() {
			var oItem = this._getNavBar().getNextItem();
			return (oItem) ? oItem.getText() : undefined;
		};

		ProcessViewer.prototype._getPreviousAction = function() {
			var oItem = this._getNavBar().getPreviousItem();
			return (oItem) ? oItem.getText() : undefined;
		};

		ProcessViewer.prototype.gotoNextStep = function() {
			var oItem = this._getNavBar().getNextItem();
			if (oItem) {
				this._fireFacetSelected(oItem);
			}
		};

		ProcessViewer.prototype.gotoPreviousStep = function() {
			var oItem = this._getNavBar().getPreviousItem();
			if (oItem) {
				this._fireFacetSelected(oItem);
			}
		};

		ProcessViewer.prototype._fireFacetSelected = function(oItem) {
			this.fireFacetSelected({
				id: oItem.getId(),
				key: oItem.getKey(),
				item: oItem
			});
		};

		ProcessViewer.prototype.setActiveSteps = function(iSteps) {
			this._getNavBar().setActiveSteps(iSteps);
		};


		ProcessViewer.prototype._setActions = function() {
			if (this._getNextAction()) {
				this._oActionNext.setVisible(true);
				this._oActionNext.setText(this._getNextAction());
			} else {
				this._oActionNext.setVisible(false);
			}

			if (this._getPreviousAction()) {
				this._oActionPrevious.setVisible(true);
				this._oActionPrevious.setText(this._getPreviousAction());
			} else {
				this._oActionPrevious.setVisible(false);
			}
		};

		ProcessViewer.prototype._rerenderFacetContent = function() {
			var $content = jQuery.sap.byId(this.getId() + "-facetContent");
			if ($content.length > 0) {
				var oRm = sap.ui.getCore().createRenderManager();
				ProcessViewerRenderer.renderFacetContent(oRm, this);
				oRm.flush($content[0]);
				oRm.destroy();
				this._resize = false;
				this._setTriggerValue();
				this._onresize();
			}
		};

		ProcessViewer.prototype._getNavBar = function() {
			return this._oNavBar;
		};

		ProcessViewer.prototype.showMessages = function(oEvent) {
			var oMessageTemplate = new sap.m.MessagePopoverItem({
				type: "{msg>type}",
				title: "{msg>message}",
				description: "{msg>description}"
			});


			var oMessagePopover = new sap.m.MessagePopover({
				items: {
					path: "msg>/",
					template: oMessageTemplate
				}
			});
			oMessagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "msg");
			oMessagePopover.openBy(oEvent.getSource());
		};

		return ProcessViewer;
	}, /* bExport= */ true);
