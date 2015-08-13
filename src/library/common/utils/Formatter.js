sap.ui.define(["jquery.sap.global"],
	function(jQuery) {
		"use strict";


		var Formatter = {

			/**
			 * Generate a new Guid
			 * @return {guid} guid
			 */
			newGuid: function() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0,
						v = c === "x" ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},

			/**
			 * parse ABAP boolean from boolean
			 * @param  {boolean} bValue [description]
			 * @return {string}        [description]
			 */
			parseAbapBoole: function(bValue) {
				return bValue ? "X" : "";
			},

			/**
			 * parse boolean from string
			 * @param  {string} sValue [description]
			 * @return {boolean}        [description]
			 */
			parseBoolean: function(sValue) {
				return !!sValue;
			},

			/**
			 * parse string to array
			 * @param  {string} sArray [description]
			 * @return {arry}        [description]
			 */
			parseStringArray: function(sArray) {
				return sArray.split(",");
			},

			/**
			 *  parse Array to String
			 * @param  {array} aString [description]
			 * @return {string}         [description]
			 */
			parseArrayString: function(aString){
				return aString.toString();
			}
		};

		return Formatter;

	}, /* bExport= */ true);
