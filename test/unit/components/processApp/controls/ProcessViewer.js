sap.ui.define(
    [
        "aklc/cm/components/processApp/controls/ProcessViewer",
        "aklc/cm/components/processApp/controls/NavigationItem",
        "sap/ui/model/json/JSONModel",
        "aklc/cm/components/processApp/controls/VerticalNavigationBar",
        "sap/ui/qunit/QUnitUtils"
    ],
    function(ProcessViewer, NavigationItem, JSONModel) {
        "use strict";
        var QUtils = window.qutils;
        jQuery.sap.includeStyleSheet("../../src/components/processApp/css/ThreePanelViewer.css", "ThreePanelViewer");
        jQuery.sap.includeStyleSheet("../../src/components/processApp/css/VerticalNavigationBar.css", "VerticalNavigationBar");

        var oNavBarData = [{
            key: "overview",
            text: "Overview",
            icon: "sap-icon://overlay"
        }, {
            key: "contacts",
            text: "Contacts",
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

        var oFacet = {};

        //event handler for facet event, action and standard action events, for close and open event
        function facetSelectedEventHandler(oEvent) {

            ok(true, "facet select event handler has been executed."); // this test tests by just being counted in the respective test
            var sId = oEvent.getParameter("id");
            var sKey = oEvent.getParameter("key");
            equal(sKey, oFacet.key, oFacet.text + " Facet should be selected");
            var oTG1 = new sap.ui.ux3.ThingGroup({
                title: "Block1"
            });
            oTG1.addContent(new sap.ui.commons.Button(oProcessViewer.getId() + sKey + "FacetButton", {
                text: sKey
            }));
            oProcessViewer.destroyFacetContent().addFacetContent(oTG1);
            oProcessViewer.setSelectedFacet(sId);
        }

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
            facetSelected: facetSelectedEventHandler
        });

        oProcessViewer.setModel(oModel);
        oProcessViewer.setActiveSteps(5);
        oProcessViewer.setSelectedFacet(oProcessViewer.getFacets()[0]);
        oProcessViewer.placeAt("qunit-fixture");

        QUnit.module("Appearance");

        QUnit.test("ProcessViewer exists", function() {
            var oDomRef = jQuery.sap.domById(oProcessViewer.getId());
            ok(oDomRef, "Rendered ProcessViewer should exist in the page");
            equal(oDomRef.className, "sapUiUx3TV", "Rendered ProcessViewer should have the class 'sapUiUx3TV'");
        });

        //NavBar
        QUnit.test("Vertical navigation exists", function() {
            var oNavBar = jQuery.sap.domById(oProcessViewer.getId() + "-navigation");
            ok(oNavBar, "Vertical navigation should exist in the page");
            equal(oNavBar.className, "sapSuiteTvNav", "Rendered vertical navigation bar should have the class 'sapSuiteTvNav'");
        });

        QUnit.test("Navbar Items", function() {
            //number of navigation items must be the same as number of facets
            var facets = oProcessViewer.getFacets();
            equal(facets.length, oNavBarData.length, "Number of facets equals model data");
            // var $facets = jQuery(".sapSuiteTvNavBarList");
            for (var i = 0; i < facets.length; i++) {
                ok(jQuery.sap.domById(facets[i].sId), "Rendered ThingViewer Item " + facets[i].sId + " should exist in the page");
            }
        });

        //ActionBar
        QUnit.test("Toolbar", function() {
            var oActionBar = oProcessViewer.getActionBar();
            ok(oActionBar, "ActionBar should exist");
            ok(jQuery(".sapUiUx3ActionBar")[0], "ActionBar rendering ok");
            oProcessViewer.setActionBar();
            sap.ui.getCore().applyChanges();
            ok(!jQuery(".sapUiUx3ActionBar")[0], "ActionBar should be destroyed");
            oProcessViewer.setActionBar(oActionBar);
        });

        //Action check next and previous
        QUnit.test("Action - Next", function() {
            var oActionBar = oProcessViewer.getActionBar();
            var oButtons = oActionBar.getAggregation("_businessActionButtons");

            var oPreviousBtn = oButtons[0];
            var oNextBtn = oButtons[1];

            ok(!oPreviousBtn.getVisible(), "Previous Button should not be visible");
            ok(oNextBtn.getVisible(), "Next Button should  be visible");

            ok(!jQuery.sap.domById(oPreviousBtn.getId()), "Previous Button was not rendered");
            ok(jQuery.sap.domById(oNextBtn.getId()), "Next Button was rendered");

            equal(oPreviousBtn.getText(), "", "first step no previous step");
            equal(oNextBtn.getText(), oNavBarData[1].text, "she be the second entries text");

        });

        QUnit.test("Facet content exists", function() {
            var oFacetContent = jQuery.sap.domById(oProcessViewer.getId() + "-facetContent");
            ok(oFacetContent, "Facet content should exist in the page");
            equal(oFacetContent.className, "sapSuiteTvFacet", "Rendered facet content should have the class 'sapSuiteTvFacet'");

        });

        QUnit.module("Behaviour");
        QUnit.asyncTest("FacetSelected Events", function() {
            expect(13);
            oFacet = oNavBarData[4];
            var oItem = oProcessViewer.getFacets().filter(function(o) {
                return o.getKey() === oFacet.key;
            })[0];
            QUtils.triggerMouseEvent(jQuery.sap.domById(oItem.sId), "click", 1, 1, 1, 1);
            setTimeout(
                function() {
                    ok(jQuery.sap.domById(oProcessViewer.getId() + oFacet.key + "FacetButton"), "Rendered Facet Content for facet " + oFacet.key + " should exist in the page");
                    var iIndex = oNavBarData.indexOf(oFacet);
                    var sPreviousTxt = oNavBarData[iIndex - 1].text;
                    var sNextTxt = oNavBarData[iIndex + 1].text;
                    var oActionBar = oProcessViewer.getActionBar();
                    var oButtons = oActionBar.getAggregation("_businessActionButtons");

                    var oPreviousBtn = oButtons[0];
                    var oNextBtn = oButtons[1];

                    ok(oPreviousBtn.getVisible(), "Previous Button should be visible");
                    ok(oNextBtn.getVisible(), "Next Button should  be visible");
                    equal(oPreviousBtn.getText(), sPreviousTxt, "Previous button text should be" + sPreviousTxt);
                    equal(oNextBtn.getText(), sNextTxt, "Previous button text should be" + sNextTxt);

                    oFacet = oNavBarData[iIndex + 1];
                    QUtils.triggerMouseEvent(jQuery.sap.domById(oNextBtn.sId), "click", 1, 1, 1, 1);
                    setTimeout(
                        function() {
                            ok(jQuery.sap.domById(oProcessViewer.getId() + oFacet.key + "FacetButton"), "Rendered Facet Content for facet " + oFacet.key + " should exist in the page");
                            iIndex = oNavBarData.indexOf(oFacet);
                            oFacet = oNavBarData[iIndex - 1];
                            QUtils.triggerMouseEvent(jQuery.sap.domById(oPreviousBtn.sId), "click", 1, 1, 1, 1);
                            setTimeout(
                                function() {
                                    ok(jQuery.sap.domById(oProcessViewer.getId() + oFacet.key + "FacetButton"), "Rendered Facet Content for facet " + oFacet.key + " should exist in the page");
                                    start();
                                }, 1000);
                        }, 500);
                }, 1000);
        });

        QUnit.test("Destroy and remove control", function() {
            oProcessViewer.destroy();
            var oDomRef = jQuery.sap.domById(oProcessViewer.getId());
            ok(!oDomRef, "Rendered ProcessViewer should not exist in the page after destruction");
        });

    }

);
