sap.ui.define(["aklc/cm/library/common/controller/BaseController", "sap/m/MessageBox"], function(BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("aklc.cm.components.partner.controller.Main", {
		_oViewRegistry: [],
		_basePath: "aklc.cm.components.partner.view.",

		onInit: function() {
			BaseController.prototype.onInit.apply(this);

			var that = this;
			var container = that.getView().byId("splitContainer");
			container.addContent(that._getView(that._basePath + "SelectList"));
			that.getEventBus().subscribe(
				"SelectList",
				"selected",
				function(sChannel, sEventId, oParams) {
					container.removeAllContent();
					var nameList = that._getView(that._basePath + "NameSelectList");
					nameList.bindElement(oParams.path);
					container.addContent(nameList);
				}
			);

			that.getEventBus().subscribe(
				"NameSelectList",
				"goBack",
				function() {
					container.removeAllContent();
					container.addContent(
						that._getView(that._basePath + "SelectList")
					);
				}
			);

			that.getEventBus().subscribe(
				"PartnerList",
				"selected",
				function(sChannel, sEventId, oParams) {
					var path = oParams.path;
					var partner = that._oModel.getProperty(path);
					var nameList = that._getView(that._basePath + "NameSelectList");

					var nameListController = nameList.getController();
					if (nameListController) {
						nameListController.reset();
					}

					if (!that.isInNameSelectList()) {
						container.removeAllContent();
						container.addContent(nameList);
					}

					nameList.bindElement(
						"/PartnerFunctions(" + partner.PartnerFunctionCode + ")"
					);
					if (!partner.Unassigned) {
						nameList.byId("partnerDetails").bindElement(path);
						nameList.byId("partnerDetails").setVisible(true);
						if (partner.Readonly) {
							nameList.byId("nameSelectSection").setVisible(false);
						}
					} else {
						nameListController.currentBindingPath = path;
					}
				}
			);
		},

		_getView: function(sStepViewName) {
			//TODO: refactor to application controller
			if (this._oViewRegistry[sStepViewName]) {
				return this._oViewRegistry[sStepViewName];
			}
			var oViewData = {
				oComponent: this.getComponent()
			};

			//HACK - something destroys owner
			if (!sap.ui.base.ManagedObject._sOwnerId) {
				sap.ui.base.ManagedObject._sOwnerId = oViewData.oComponent.getId();
			}
			var oView = sap.ui.view({
				type: sap.ui.core.mvc.ViewType.XML,
				viewName: sStepViewName,
				viewData: oViewData
			});

			this._oViewRegistry[sStepViewName] = oView;

			return oView;
		},

		/**
		 * check if the right column is in name select list
		 * @return {Boolean}
		 */
		isInNameSelectList: function() {
			return this.getView().byId("splitContainer").getContent()[0].sViewName === (this._basePath + "NameSelectList");
		},

		onCheckValid: function(sChannel, sEvent, oData) {
			return false;
		}
	});
});
