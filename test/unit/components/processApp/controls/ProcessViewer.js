sap.ui.define(
    [
        "aklc/cm/components/processApp/controls/ProcessViewer",
        "aklc/cm/components/processApp/controls/NavigationItem",
        "sap/ui/model/json/JSONModel",
        "aklc/cm/components/processApp/controls/VerticalNavigationBar",
    ],
    function(ProcessViewer, NavigationItem, JSONModel) {
        "use strict";

        jQuery.sap.includeStyleSheet("../../src/components/processApp/css/ThreePanelViewer.css", "ThreePanelViewer");
        jQuery.sap.includeStyleSheet("../../src/components/processApp/css/VerticalNavigationBar.css", "VerticalNavigationBar");

        var oNavBarData = [{
            key: "overview",
            text: "Overview",
            icon: "sap-icon://overlay"
        }, {
            key: "contacts",
            text: "Contacts Lorem Ipsum Dolores",
            icon: "sap-icon://citizen-connect"
        }, {
            key: "items",
            text: "Items",
            icon: "sap-icon://activity-items"
        }, {
            key: "related_documents",
            text: "Related Documents",
            icon: "sap-icon://documents"
        }, {
            key: "addresses",
            text: "Addresses",
            icon: "sap-icon://address-book"
        }, {
            key: "analytics",
            text: "Analytics",
            icon: "sap-icon://pipeline-analysis"
        }];

        var oNavBarItemTemplate = new NavigationItem({
            key: "{key}",
            text: "{text}",
            icon: "{icon}"
        });

        /*********************************************/

        var oContactsData = [{
            title: "Contacts",
            colspan: true,
            type: 2,
            content: [{
                name: "Jag, Mick",
                phone: "+1 (692) 742-2633"
            }, {
                name: "Bradford, John",
                phone: "+1 (635) 457-2875"
            }, {
                name: "Stiff, Clark",
                phone: "+1 (703) 515-8363"
            }]
        }];

        var oOverviewData = oContactsData;

        var oFacetContentTemplate = new sap.ui.ux3.ThingGroup({
            title: "{title}",
            colspan: "{colspan}",
            content: new sap.ui.commons.RowRepeater({
                rows: {
                    path: "content",
                    factory: function(sId, oContext) {
                        return new sap.ui.commons.layout.MatrixLayout({
                            rows: [
                                new sap.ui.commons.layout.MatrixLayoutRow({
                                    cells: new sap.ui.commons.layout.MatrixLayoutCell({
                                        content: new sap.ui.commons.Label({
                                            text: "{name}"
                                        })
                                    })
                                }),
                                new sap.ui.commons.layout.MatrixLayoutRow({
                                    cells: new sap.ui.commons.layout.MatrixLayoutCell({
                                        content: new sap.ui.commons.Label({
                                            text: "{phone}"
                                        })
                                    })
                                })
                            ]
                        });
                    }
                }
            })
        });
        /******************************************************/
        var oData = {
            sidebarWidth: "160px",
            facets: oNavBarData,
            facetContent: oOverviewData
        };

        var oModel = new JSONModel();
        oModel.setData(oData);

        var oProcessViewer = new ProcessViewer({
            sidebarWidth: "{/sidebarWidth}",
            facets: {
                path: "/facets",
                template: oNavBarItemTemplate
            },
            facetContent: {
                path: "/facetContent",
                template: oFacetContentTemplate
            },
            facetSelected: function(oEvent) {
                var sFacetKey = oEvent.getParameters().key;
                oProcessViewer.setContent(sFacetKey);
            }
        });

        oProcessViewer.setModel(oModel);
        oProcessViewer.setSelectedFacet(oProcessViewer.getFacets()[0]);
        oProcessViewer.placeAt("uiArea1");

        module("Appearance");

        test("ProcessViewer exists", function() {

            var oDomRef = jQuery.sap.domById(oProcessViewer.getId());
            ok(oDomRef, "Rendered ProcessViewer should exist in the page");
            equal(oDomRef.className, "sapUiUx3TV", "Rendered ProcessViewer should have the class 'sapUiUx3TV'");
        });

        // test("Title Icon is rendered", function() {
        //     var oSwatch = jQuery.sap.domById(oProcessViewer.getId() + "-swatch");
        //     ok(oSwatch, "Title Icon should exist in the page");
        //     equal(oSwatch.className, "sapSuiteTvTitleIcon", "Rendered title icon should have the class 'sapSuiteTvTitleIcon'");
        // });

        // test("Title bar is rendered", function() {
        //     var oTitle = jQuery.sap.domById(oProcessViewer.getId() + "-header");
        //     ok(oTitle, "Title should exist in the page");
        //     equal(oTitle.className, "sapSuiteTvTitle", "Rendered title should have the class 'sapSuiteTvTitle'");
        // });

        // test("Menu button exists", function() {
        //     var menuButton = jQuery.sap.domById(oProcessViewer.getId() + "-menu-button");
        //     notDeepEqual(menuButton, [], "menu button found: " + menuButton);
        // });

        test("Vertical navigation exists", function() {
            var oNavBar = jQuery.sap.domById(oProcessViewer.getId() + "-navigation");
            ok(oNavBar, "Vertical navigation should exist in the page");
            equal(oNavBar.className, "sapSuiteTvNav", "Rendered vertical navigation bar should have the class 'sapSuiteTvNav'");
        });

        test("Items", function() {
            //number of navigation items must be the same as number of facets
            var facets = oProcessViewer.getFacets();
            // var $facets = jQuery(".sapSuiteTvNavBarList");
            for (var i = 0; i < facets.length; i++) {
                ok(jQuery.sap.domById(facets[i].sId), "Rendered ThingViewer Item " + facets[i].sId + " should exist in the page");
            }
        });

        // test("Header exists", function() {
        //     var oHeader = jQuery.sap.domById(oProcessViewer.getId() + "-headerContent");
        //     ok(oHeader, "Header should exist in the page");
        //     equal(oHeader.className, "sapSuiteTvHeader", "Rendered header should have the class 'sapSuiteTvHeader'");
        // });

        test("Facet content exists", function() {
            var oFacetContent = jQuery.sap.domById(oProcessViewer.getId() + "-facetContent");
            ok(oFacetContent, "Facet content should exist in the page");
            equal(oFacetContent.className, "sapSuiteTvFacet", "Rendered facet content should have the class 'sapSuiteTvFacet'");
            oProcessViewer.destroy();
        });

        module("Behaviour");
 
    }

);
