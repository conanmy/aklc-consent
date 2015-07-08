   sap.ui.define(['sap/ui/core/mvc/Controller', 'scenario/xmlview/utils/Formatter'],
       function(Controller, Formatter) {
           "use strict";

           var BaseController = Controller.extend("scenario.xmlview.controller.BaseController", {
               _oModel: null, // the oData model used by this App
               onInit: function() {
                   this._oView = this.getView();
                   this._oComponent = this._oView.getViewData().oComponent;
                   this._oApplicationController = this.getComponent().getApplicationController();
                   this._oModel = this.getComponent().getModel();
                   this.getEventBus().subscribe(this._oView.sViewName, "CheckValid", this.onCheckValid, this);
               },

               getComponent: function() {
                   if (this._oComponent) {
                       return this._oComponent;
                   }
                   var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
                   return sap.ui.component(sComponentId);
               },

               getEventBus: function() {
                   return this.getComponent().getEventBus();
               },

               getRouter: function() {
                   return sap.ui.core.UIComponent.getRouterFor(this);
               },

               getFormatter: function() {
                   return Formatter;
               },

               onCheckValid: function(sChannel, sEvent, oData) {
                //TODO add validation method
                oData.WhenValid.resolve();
               }


           });

           return BaseController;
       },
       true);
