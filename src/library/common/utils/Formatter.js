sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";


		var Formatter = {

			/**
			 * Generate a new Guid
			 * @return {guid} guid
			 */
			newGuid: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0,
						v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			}
		};

		return Formatter;

	}, /* bExport= */ true);
