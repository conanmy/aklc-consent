sap.ui.define(["sap/ui/ux3/NavigationItem"],
    function(UX3NavigationItem) {
        "use strict";
        var NavigationItem = UX3NavigationItem.extend("scenario.xmlview.controls.NavigationItem", {
            metadata: {
                properties: {
                    "icon": {
                        type: "sap.ui.core.URI",
                        group: "Misc",
                        defaultValue: null
                    }
                }
            }
        });
        return NavigationItem;
    }, /* bExport= */ true);
