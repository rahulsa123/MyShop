/*global showAddAnotherPopup, showRelatedObjectLookupPopup showRelatedObjectPopup updateRelatedObjectLinks*/

(function (Rs) {
  "use strict";
  Rs(document).ready(function () {
    var modelName = Rs("#django-admin-form-add-constants").data("modelName");
    Rs("body").on("click", ".add-another", function (e) {
      e.preventDefault();
      var event = Rs.Event("django:add-another-related");
      Rs(this).trigger(event);
      if (!event.isDefaultPrevented()) {
        showAddAnotherPopup(this);
      }
    });

    if (modelName) {
      Rs("form#" + modelName + "_form :input:visible:enabled:first").focus();
    }
  });
})(django.jQuery);
