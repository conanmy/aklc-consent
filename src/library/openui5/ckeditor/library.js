/**
 * CKEditor wrapped in a UI5 control
 * @version v1.0.0 - 2014-06-07
 * @link http://jasper07.github.io/openui5-ckeditor/
 * @author John Patterson <john.patterson@secondphase.com.au>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'], // library dependency
    function(jQuery) {

        "use strict";
        //preload types
        jQuery.sap.require('openui5.ckeditor.CKEditorToolbar');

        sap.ui.getCore().initLibrary({
            name: "openui5.ckeditor",
            dependencies: ["sap.ui.core"],
            types: ["openui5.ckeditor.CKEditorToolbar"],
            interfaces: [],
            controls: ["openui5.ckeditor.CKEditor"],
            elements: [],
            noLibraryCSS: true,
            version: "1.22.1"
        });

    }, /* bExport= */ false);
