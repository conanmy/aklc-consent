sap.ui.define(
    [
        "aklc/cm/components/processApp/controls/VerticalNavigationBar",
        "aklc/cm/components/processApp/controls/NavigationItem"
    ],
    function(VerticalNavigationBar, NavigationItem) {

        QUnit.module("VerticalNavigationBar");

        oVerticalNavigationBar = new VerticalNavigationBar();
        oVerticalNavigationBar.placeAt("qunit-fixture");
        var oItem1 = new NavigationItem({
            key: "item1",
            text: "Item 1",
            icon: "sap-icon://documents"
        });

        var oItem2 = new NavigationItem({
            key: "item2",
            text: "Item 2"
        });

        var oItem3 = new NavigationItem({
            key: "item3",
            text: "Item 3",
            icon: "sap-icon://overlay"
        });

        oVerticalNavigationBar.addItem(oItem1);
        oVerticalNavigationBar.addItem(oItem2);
        oVerticalNavigationBar.setActiveSteps(2);

        // 95% code coverage Process View
        // test selecting navigation item via icon
        // render an item without an icon
        QUnit.test("Add Items", function() {
            oVerticalNavigationBar.addItem(oItem3);
            sap.ui.getCore().applyChanges();

            var oDomRef = jQuery.sap.domById(oItem1.getId());
            ok(oDomRef, "Item element should exist in the page");
            equal(jQuery(oDomRef).text(), "Item 1", "Item 1 text should be written to the page");
        });

        QUnit.asyncTest("Select Item", function() {
            oVerticalNavigationBar.setSelectedItem(oItem2);
            sap.ui.getCore().applyChanges();

            setTimeout(
                function() {
                   equal(oVerticalNavigationBar.getSelectedItem(), oItem2.getId(), "item 2 should be selected");
                    start();
                }, 500);
            
            // oVerticalNavigationBar.destroy();

        });
        // oVerticalNavigationBar.destroy();
    });
