   sap.ui.define(["sap/ui/ux3/NavigationBar"],
       function(NavigationBar) {
           "use strict";

           var VerticalNavigationBar = NavigationBar.extend("scenario.xmlview.controls.VerticalNavigationBar");

           VerticalNavigationBar.CLASSES = {
               NAVBAR: "sapSuiteTvNavBar",
               NAVBAR_UPPERCASE: "sapUiUx3NavBarUpperCase",
               NAVBAR_LIST: "sapSuiteTvNavBarList",
               NAVBAR_ITEM: "sapSuiteTvNavBarItem",
               NAVBAR_ITEM_SELECTED: "sapUiUx3NavBarItemSel",
               NAVBAR_ITEM_LINK: "sapSuiteTvNavBarItemLink",
               NAVBAR_ICON: "sapSuiteTvNavBarIcon",
               NAVBAR_ICON_ACCEPT: "sapSuiteTvNavBarIconAccept",
               NAVBAR_ICON_DIV: "sapSuiteTvNavBarIconDiv",
               ITEM_NAME: "sapSuiteTvNavBarItemName",
           };

           VerticalNavigationBar.ATTRIBUTES = {
               STEP: "data-sap-ui-vnb-step",
               CURRENT_STEP: "data-sap-ui-vnb-step-current",
               ACTIVE_STEP: "data-sap-ui-vnb-step-active",
               ARIA_CHECKED: "aria-checked",
               ARIA_LABEL: "aria-label",
               ARIA_DISABLED: "aria-disabled"
           };

           VerticalNavigationBar.prototype.init = function() {
               NavigationBar.prototype.init.apply(this);
               this._currentStep = 1;
               this._activeStep = 1;
               this._cachedSteps = null;
               this._stepCount = 0;

           };

           VerticalNavigationBar.prototype.onAfterRendering = function() {
               sap.ui.ux3.NavigationBar.prototype.onAfterRendering.apply(this);

               this._cacheDOMElements();
               if (this._cachedSteps.length === 0) {
                   return;
               }
               if (this.getSelectedItem()) {
                   this._updateSelection(this.getSelectedItem());
               }
               var zeroBasedActiveStep = this._activeStep - 1,
                   zeroBasedCurrentStep = this._currentStep - 1;

               this._stepCount = this._cachedSteps.length;
               this._updateStepNavigation(zeroBasedActiveStep);
               this._updateStepCurrentAttribute(zeroBasedCurrentStep);
               this._updateStepActiveAttribute(zeroBasedActiveStep);
               this._removeStepAriaDisabledAttribute(zeroBasedActiveStep);


           };

           VerticalNavigationBar.prototype.exit = function() {
               this._oBarItemsMap = null;
               sap.ui.ux3.NavigationBar.prototype.exit.apply(this);
           };

           VerticalNavigationBar.prototype._handleActivation = function(oEvent) {
               if (!oEvent.target.id) {
                   oEvent.target = jQuery(oEvent.target).closest("." + VerticalNavigationBar.CLASSES.NAVBAR_ITEM_LINK)[0];
               }

               var sTargetId = oEvent.target.id;

               var oItem = sap.ui.getCore().byId(sTargetId);
               if (oItem && (sTargetId != this.getSelectedItem()) && (oItem instanceof sap.ui.ux3.NavigationItem) && this._canSelectItem(oItem.getDomRef())) {
                   // select the item and fire the event
                   if (this.fireSelect({
                           item: oItem,
                           itemId: sTargetId
                       })) {
                       this.setAssociation("selectedItem", oItem, true); // avoid rerendering, animate
                       this._updateSelection(sTargetId);
                   }
               }
           };

           VerticalNavigationBar.prototype.onsapspace = function(oEvent) {
               this._handleActivation(oEvent);
           };

           VerticalNavigationBar.prototype.onclick = function(oEvent) {
               this._handleActivation(oEvent);
           };

           VerticalNavigationBar.prototype._handleScroll = function() {};


           VerticalNavigationBar.prototype._cacheDOMElements = function() {
               var domRef = this.getDomRef();

               this._cachedSteps = domRef.querySelectorAll("." + VerticalNavigationBar.CLASSES.NAVBAR_ITEM);
           };

           VerticalNavigationBar.prototype._checkOverflow = function(oListDomRef, of_back, of_fw) {};

           VerticalNavigationBar.prototype.setSelectedItem = function(vItem) {
               if (!this.getDomRef()) {
                   return;
               }

               var sItemId = (!vItem || (typeof vItem == "string")) ? vItem : vItem.getId();
               //check is active step
               // if (!this._canSelectItem()) {
               //     return;
               // }

               this.setAssociation("selectedItem", vItem, true); // avoid rerendering
               this._updateSelection(sItemId); // animate selection

           };

           VerticalNavigationBar.prototype._canSelectItem = function(oDomRef) {
               return (oDomRef && this._isStep(oDomRef) && this._isActiveStep(this._getStepNumber(oDomRef)));
           };

           VerticalNavigationBar.prototype.getCurrentStep = function() {
               return this._currentStep;
           };

           VerticalNavigationBar.prototype.setActiveSteps = function(newStep) {
               this._activeStep = newStep;
           };

           VerticalNavigationBar.prototype._moveToStep = function(newStep) {
               var stepCount = this.getStepCount(),
                   oldStep = this.getCurrentStep();

               if (newStep > stepCount) {
                   return this;
               }

               // if (newStep > this._activeStep) {
               this._updateActiveStep(newStep);
               // }

               var oItem = this._getItem(newStep);
               if (this.fireSelect({
                       item: oItem,
                       itemId: oItem.getId()
                   })) {
                   this.setAssociation("selectedItem", oItem, true); // avoid rerendering, animate
               }


               return this._updateCurrentStep(newStep, oldStep);
           };



           VerticalNavigationBar.prototype.previousStep = function() {
               var currentStep = this.getCurrentStep();

               if (currentStep < 2) {
                   return this;
               }

               return this._moveToStep(currentStep - 1);
           };

           VerticalNavigationBar.prototype.nextStep = function() {
               return this._moveToStep(this.getCurrentStep() + 1);
           };

           VerticalNavigationBar.prototype.getPreviousItem = function() {
               return this.getItems()[this.getCurrentStep() - 2];
           };

           VerticalNavigationBar.prototype.getNextItem = function() {
               return this.getItems()[this.getCurrentStep()];
           };

           VerticalNavigationBar.prototype._getItem = function(newStep) {
               var stepCount = this.getStepCount();

               if (newStep > stepCount) {
                   return this;
               }

               return this.getItems()[newStep - 1];
           };


           VerticalNavigationBar.prototype._updateSelection = function(sItemId) {

               this._menuInvalid = true;
               var oItem = sap.ui.getCore().byId(sItemId);
               var oDomRef = oItem.getDomRef();
               if (!oDomRef) {
                   return;
               }
               this._updateCurrentStep(this._getStepNumber(oItem.getDomRef()));
               this._updateStepActiveAttribute(this._activeStep - 1);

               // let the ItemNavigation know about the new selection
               var iSelectedDomIndex = jQuery(oDomRef).parent().index();
               if (iSelectedDomIndex > 0) {
                   iSelectedDomIndex--; // if a selected element is found, its index in the ItemNavigation is the DOM index minus the dummy element, which is the first sibling
               }
               this._oItemNavigation.setSelectedIndex(iSelectedDomIndex);
           };


           /**
            * Extracts the step attribute from the argument
            * @param {HTMLElement} domStep - The dom element which represents the Step tag in each step
            * @returns {number} Returns parsed step number
            * @private
            */
           VerticalNavigationBar.prototype._getStepNumber = function(oDomRef) {
               return oDomRef.parentNode.getAttribute(VerticalNavigationBar.ATTRIBUTES.STEP) | 0;
           };

           /**
            * Checks whether the argument has chec class present
            * @param {HTMLElement} domTarget - The target of the click/tap event
            * @returns {boolean} Returns true when NAVBAR_ITEM_LINK class is present, false otherwise
            * @private
            */
           VerticalNavigationBar.prototype._isStep = function(oDomRef) {
               return oDomRef.className.indexOf(VerticalNavigationBar.CLASSES.NAVBAR_ITEM_LINK) !== -1;
           };


           /**
            * Checks whether the step is active
            * @param {number} iStep - The step number to be checked
            * @returns {boolean} Returns true when the step number has been activated, false otherwise
            * @private
            */
           VerticalNavigationBar.prototype._isActiveStep = function(stepNumber) {
               return stepNumber <= this._activeStep;
           };


           /**
            * Updates the current step in the control instance as well as the DOM structure
            * @param {number} newStep - The step number to which current step will be set. Non zero-based
            * @param {number} oldStep - The step number to which current step was set. Non zero-based
            * @returns {sap.m.VerticalNavigationBar} Pointer to the control instance for chaining
            * @private
            */
           VerticalNavigationBar.prototype._updateCurrentStep = function(newStep, oldStep) {
               var zeroBasedNewStep = newStep - 1,
                   zeroBasedOldStep = (oldStep || this.getCurrentStep()) - 1;

               this._currentStep = newStep;
               this._updateStepCurrentAttribute(zeroBasedNewStep, zeroBasedOldStep);
               this._updateStepAriaLabelAttribute(zeroBasedNewStep, zeroBasedOldStep);

           };


           /**
            * Allows focus on active steps
            * @param  {number} index - The index of the last focusable Step. Zero-based
            * @private
            */
           VerticalNavigationBar.prototype._updateStepNavigation = function(index) {
               var navDomRef = this.getDomRef();
               var aFocusableSteps = [];

               if (this._cachedSteps.length === 0) {
                   return false;
               }

               for (var i = 0; i <= index; i++) {
                   aFocusableSteps.push(this._cachedSteps[i].children[0]);
               }

               this._oItemNavigation.setRootDomRef(navDomRef);
               this._oItemNavigation.setItemDomRefs(aFocusableSteps);
               this._oItemNavigation.setPageSize(index);
               this._oItemNavigation.setFocusedIndex(index);
           };

           /**
            * Updates the step current attribute in the DOM structure of the Control
            * @param {number} newIndex - The new index at which the attribute should be set. Zero-based
            * @param {number} oldIndex - The old index at which the attribute was set. Zero-based
            * @returns {undefined}
            * @private
            */
           VerticalNavigationBar.prototype._updateStepCurrentAttribute = function(newIndex, oldIndex) {
               if (oldIndex !== undefined) {
                   this._cachedSteps[oldIndex].removeAttribute(VerticalNavigationBar.ATTRIBUTES.CURRENT_STEP);
               }

               this._cachedSteps[newIndex].setAttribute(VerticalNavigationBar.ATTRIBUTES.CURRENT_STEP, true);
           };

           /**
            * Updates the step active attribute in the DOM structure of the Control
            * @param {number} newIndex - The new index at which the attribute should be set. Zero-based
            * @param {number} oldIndex - The old index at which the attribute was set. Zero-based
            * @returns {undefined}
            * @private
            */
           VerticalNavigationBar.prototype._updateStepActiveAttribute = function(newIndex, oldIndex) {
               var iStepCount = this._cachedSteps.length;

               for (var i = 0; i < iStepCount; i++) {
                   if (i <= newIndex) {
                       this._cachedSteps[i].setAttribute(VerticalNavigationBar.ATTRIBUTES.ACTIVE_STEP, true);
                   } else {
                       this._cachedSteps[i].removeAttribute(VerticalNavigationBar.ATTRIBUTES.ACTIVE_STEP);
                   }
               }

           };


           /**
            * Removes the Step aria-disabled attribute from the DOM structure of the Control
            * @param {number} index - The index at which the attribute should be removed. Zero-based
            * @returns {undefined}
            * @private
            */
           VerticalNavigationBar.prototype._removeStepAriaDisabledAttribute = function(index) {
               this._cachedSteps[index].children[0]
                   .removeAttribute(VerticalNavigationBar.ATTRIBUTES.ARIA_DISABLED);
           };

           /**
            * Updates the active step in the control instance as well as the DOM structure
            * @param {number} newStep - The step number to which active step will be set. Non zero-based
            * @param {number} oldStep - The step number to which active step was set. Non zero-based
            * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining
            * @private
            */
           VerticalNavigationBar.prototype._updateActiveStep = function(newStep, oldStep) {
               var zeroBasedNewStep = newStep - 1,
                   zeroBasedOldStep = (oldStep || this._activeStep) - 1;

               this._activeStep = newStep;
               this._updateStepNavigation(zeroBasedNewStep);
               this._removeStepAriaDisabledAttribute(zeroBasedNewStep);
               this._updateStepActiveAttribute(zeroBasedNewStep, zeroBasedOldStep);
           };


           /**
            * Updates the Step aria-label attribute in the DOM structure of the Control
            * @param {number} newIndex - The new index at which the attribute should be set. Zero-based
            * @param {number} oldIndex - The old index at which the attribute was set. Zero-based
            * @returns {undefined}
            * @private
            */
           VerticalNavigationBar.prototype._updateStepAriaLabelAttribute = function(newIndex, oldIndex) {
               if (oldIndex !== undefined) {
                   this._cachedSteps[oldIndex].children[0]
                       .setAttribute(
                           VerticalNavigationBar.ATTRIBUTES.ARIA_LABEL, "Processed");
               }

               this._cachedSteps[newIndex].children[0]
                   .setAttribute(
                       VerticalNavigationBar.ATTRIBUTES.ARIA_LABEL, "Selected");
           };

           VerticalNavigationBar.prototype.getStepCount = function() {
               return this._stepCount;
           };

           return VerticalNavigationBar;
       }, /* bExport= */ true);
