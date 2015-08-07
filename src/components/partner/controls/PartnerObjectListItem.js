sap.ui.define(["sap/m/ObjectListItem"],
	function(ObjectListItem) {
		"use strict";
		var PartnerObjectListItem = ObjectListItem.extend("aklc.cm.components.partner.controls.PartnerObjectListItem", {
			metadata: {
				properties: {
					deletable: {
						type : "boolean",
						group : "Misc",
						defaultValue : true
					}
				}
			},
			renderer: "sap.m.ObjectListItemRenderer"
		});

		PartnerObjectListItem.prototype.getModeControl = function() {
			var sMode = this.getMode(),
				mListMode = sap.m.ListMode;

			if (!sMode || sMode == mListMode.None) {
				return;
			}

			if (sMode == mListMode.Delete) {
				if (!this.getDeletable()) {
					return;
				}
				return this.getDeleteControl();
			}

			if (sMode == mListMode.MultiSelect) {
				return this.getMultiSelectControl();
			}

			return this.getSingleSelectControl();
		};

		return PartnerObjectListItem;
	}, /* bExport= */ true);
