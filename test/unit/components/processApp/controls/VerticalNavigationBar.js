sap.ui.define(
	[
		"aklc/cm/components/processApp/controls/VerticalNavigationBar",
		"aklc/cm/components/processApp/controls/NavigationItem",
		"sap/ui/qunit/QUnitUtils"
	],
	function(VerticalNavigationBar, NavigationItem) {
		"use strict";
		var QUtils = window.qutils;
		jQuery.sap.includeStyleSheet("../../src/components/processApp/css/VerticalNavigationBar.css", "VerticalNavigationBar");

		var sExpectedItemId;

		function fnEventHandler(oEvent) {
			var sItemId = oEvent.getParameter("itemId");
			QUnit.equal(sItemId, sExpectedItemId, "the item ID should be the one of the clicked item: " + sExpectedItemId);
			var oItem = oEvent.getParameter("item");
			QUnit.ok(oItem, "item should be given as well");
			QUnit.equal(oItem.getId(), sExpectedItemId, "the item's ID should be the one of the clicked item: " + sExpectedItemId);
		}

		var oVerticalNavigationBar = new VerticalNavigationBar("vnb", {
			select: fnEventHandler
		});

		var oItem1 = new NavigationItem("item1", {
			key: "item1",
			text: "Item 1",
			icon: "sap-icon://documents"
		});

		var oItem2 = new NavigationItem("item2", {
			key: "item2",
			text: "Item 2",
			icon: "sap-icon://overlay"
		});

		var oItem3 = new NavigationItem("item3", {
			key: "item3",
			text: "Item 3"
		});

		var oItem4 = new NavigationItem("item4", {
			key: "item4",
			text: "Item 4",
			icon: "sap-icon://overlay"
		});

		oVerticalNavigationBar.addItem(oItem1);
		oVerticalNavigationBar.addItem(oItem2);
		oVerticalNavigationBar.addItem(oItem3);
		oVerticalNavigationBar.addItem(oItem4);
		oVerticalNavigationBar.setSelectedItem(oItem1);


		QUnit.module("VerticalNavigationBar", {
			setup: function() {
			//Karma runner kills the fixture before each call
				oVerticalNavigationBar.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			},
			teardown: function() {}
		});


		QUnit.test("Active Steps", function() {
			var aActiveItems = oVerticalNavigationBar.$().find('[data-sap-ui-vnb-step-active="true"]');
			QUnit.equal(aActiveItems.length, 0, "Active steps should be 0");
			oVerticalNavigationBar.setActiveSteps(2);
			sap.ui.getCore().applyChanges();

			aActiveItems = oVerticalNavigationBar.$().find('[data-sap-ui-vnb-step-active="true"]');
			QUnit.equal(aActiveItems.length, 2, "Active steps should be 2");
		});

		QUnit.asyncTest("Select Item", function() {
			oVerticalNavigationBar.setSelectedItem(oItem2);
			sap.ui.getCore().applyChanges();

			setTimeout(
				function() {
					QUnit.equal(oVerticalNavigationBar.getSelectedItem(), oItem2.getId(), "item 2 should be selected");
					var oCurrentDomRef = oVerticalNavigationBar.$().find('[data-sap-ui-vnb-step-current="true"]')[0];

					QUnit.equal(oCurrentDomRef.firstChild.id, oItem2.getId(), "current item equals selected item");
					QUnit.start();
				}, 500);
		});

		QUnit.asyncTest("Previous undefined and Next defined", function() {
			oVerticalNavigationBar.setSelectedItem(oItem1);
			sap.ui.getCore().applyChanges();

			setTimeout(
				function() {
					QUnit.equal(oVerticalNavigationBar.getSelectedItem(), oItem1.getId(), "item 1 should be selected");
					QUnit.strictEqual(oVerticalNavigationBar.getNextItem(), oItem2, "next item should be item 2");
					QUnit.strictEqual(oVerticalNavigationBar.getPreviousItem(), undefined, "there is no previous item");
					QUnit.start();
				}, 500);
		});

		QUnit.asyncTest("Previous defined and Next undefined", function() {
			oVerticalNavigationBar.setSelectedItem(oItem4);
			sap.ui.getCore().applyChanges();

			setTimeout(
				function() {
					QUnit.equal(oVerticalNavigationBar.getSelectedItem(), oItem4.getId(), "item 4 should be selected");
					QUnit.strictEqual(oVerticalNavigationBar.getNextItem(), undefined, "there is no next item");
					QUnit.strictEqual(oVerticalNavigationBar.getPreviousItem(), oItem3, "previous item should be item 3");
					QUnit.start();
				}, 500);
		});

		QUnit.test("Click on Icon", function() {
			expect(3); // including event handler
			var target = jQuery.sap.domById(oItem2.getId()).firstChild;
			sExpectedItemId = oItem2.getId();
			QUtils.triggerMouseEvent(target, "click");
		});

		QUnit.test("Destroy and remove control", function() {
			oVerticalNavigationBar.destroy();
			var oDomRef = jQuery.sap.domById(oVerticalNavigationBar.getId());
			ok(!oDomRef, "Rendered ProcessViewer should not exist in the page after destruction");
		});
	});
