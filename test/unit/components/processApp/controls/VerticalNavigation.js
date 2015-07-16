sap.ui.define(
    [
        "aklc/cm/components/processApp/controls/VerticalNavigationBar",
    ],
    function(VerticalNavigationBar) {
        QUnit.module("initialization", {
            setup: function() {
                this.oVerticalNavigationBar = new VerticalNavigationBar();
            },
            teardown: function() {
                this.oVerticalNavigationBar.destroy();
            }
        });

        QUnit.test("dummy test", function() {
            assert.strictEqual(1, 1, "dummy test");
        });
    }
);
