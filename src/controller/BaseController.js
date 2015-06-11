   sap.ui.define(['sap/ui/core/mvc/Controller'],
       function(Controller) {
           "use strict";

           var BaseController = Controller.extend("scenario.xmlview.controller.BaseController", {
               constructor: function() {},

               getComponent: function() {
                   var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
                   return sap.ui.component(sComponentId);
               },

               getEventBus: function() {
                   return this.getComponent().getEventBus();
               },

               getRouter: function() {
                   return sap.ui.core.UIComponent.getRouterFor(this);
               },

               isMock: function() {
                   return this.getComponent().isMock();
               },

               getPage: function() {
                   return this.getView().getContent()[0];
               }
           });

           return BaseController;
       },
       true);
