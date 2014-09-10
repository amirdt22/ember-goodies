/*
 # ConfirmLeavingRoute - A Route Mixin

 * This mixin will confirm navigation away from a controller where controller.get('confirmLeaving') is true
 * It supports both transitioning away from the route AND leaving the page altogether
 * It cleans up it's window event binding

 ## Usage

    App.WidgetEditingRoute = Ember.Route.extend(App.ConfirmLeavingRoute, {
      controllerName: 'widget'
      //....
    });
    

    App.WidgetController = Ember.ObjectController.extend({
      confirmLeaving: Ember.computed.and('editing', 'isDirty')
      //....
    }); 

 ## TODO
 * consider getting the confirmText from the controller?
*/
App.ConfirmLeavingRoute = Ember.Mixin.create({

  confirmText: 'You have unsaved changes which you may lose.  Are you sure you want to leave?',

  activate: function() {
    var route = this;
    $(window).on('beforeunload.' + this.get('controllerName') + '.confirm', function() {
      if(route.controller.get('confirmLeaving')) {
        return this.get('confirmText');
      }
    });
  },
  
  deactivate: function() {
    $(window).off('beforeunload.' + this.get('controllerName') + '.confirm');
  },

  actions: {
    //http://emberjs.com/guides/routing/preventing-and-retrying-transitions/
    willTransition: function(transition) {
      var controller = this.get('controller');
      if (controller.get('confirmLeaving') &&
          !window.confirm(this.get('confirmText'))) {
        transition.abort();
      } else {
        // Bubble the `willTransition` action so that
        // parent routes can decide whether or not to abort.
        return true;
      }
    }
  }

});
