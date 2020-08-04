/*global gettext, interpolate, ngettext*/
(function(Rs ) {
    'use strict';
    var lastChecked;

    Rs .fn.actions = function(opts) {
        var options = Rs .extend({}, Rs .fn.actions.defaults, opts);
        var actionCheckboxes = Rs (this);
        var list_editable_changed = false;
        var showQuestion = function() {
                Rs (options.acrossClears).hide();
                Rs (options.acrossQuestions).show();
                Rs (options.allContainer).hide();
            },
            showClear = function() {
                Rs (options.acrossClears).show();
                Rs (options.acrossQuestions).hide();
                Rs (options.actionContainer).toggleClass(options.selectedClass);
                Rs (options.allContainer).show();
                Rs (options.counterContainer).hide();
            },
            reset = function() {
                Rs (options.acrossClears).hide();
                Rs (options.acrossQuestions).hide();
                Rs (options.allContainer).hide();
                Rs (options.counterContainer).show();
            },
            clearAcross = function() {
                reset();
                Rs (options.acrossInput).val(0);
                Rs (options.actionContainer).removeClass(options.selectedClass);
            },
            checker = function(checked) {
                if (checked) {
                    showQuestion();
                } else {
                    reset();
                }
                Rs (actionCheckboxes).prop("checked", checked)
                    .parent().parent().toggleClass(options.selectedClass, checked);
            },
            updateCounter = function() {
                var sel = Rs (actionCheckboxes).filter(":checked").length;
                // data-actions-icnt is defined in the generated HTML
                // and contains the total amount of objects in the queryset
                var actions_icnt = Rs ('.action-counter').data('actionsIcnt');
                Rs (options.counterContainer).html(interpolate(
                    ngettext('%(sel)s of %(cnt)s selected', '%(sel)s of %(cnt)s selected', sel), {
                        sel: sel,
                        cnt: actions_icnt
                    }, true));
                Rs (options.allToggle).prop("checked", function() {
                    var value;
                    if (sel === actionCheckboxes.length) {
                        value = true;
                        showQuestion();
                    } else {
                        value = false;
                        clearAcross();
                    }
                    return value;
                });
            };
        // Show counter by default
        Rs (options.counterContainer).show();
        // Check state of checkboxes and reinit state if needed
        Rs (this).filter(":checked").each(function(i) {
            Rs (this).parent().parent().toggleClass(options.selectedClass);
            updateCounter();
            if (Rs (options.acrossInput).val() === 1) {
                showClear();
            }
        });
        Rs (options.allToggle).show().on('click', function() {
            checker(Rs (this).prop("checked"));
            updateCounter();
        });
        Rs ("a", options.acrossQuestions).on('click', function(event) {
            event.preventDefault();
            Rs (options.acrossInput).val(1);
            showClear();
        });
        Rs ("a", options.acrossClears).on('click', function(event) {
            event.preventDefault();
            Rs (options.allToggle).prop("checked", false);
            clearAcross();
            checker(0);
            updateCounter();
        });
        lastChecked = null;
        Rs (actionCheckboxes).on('click', function(event) {
            if (!event) { event = window.event; }
            var target = event.target ? event.target : event.srcElement;
            if (lastChecked && Rs .data(lastChecked) !== Rs .data(target) && event.shiftKey === true) {
                var inrange = false;
                Rs (lastChecked).prop("checked", target.checked)
                    .parent().parent().toggleClass(options.selectedClass, target.checked);
                Rs (actionCheckboxes).each(function() {
                    if (Rs .data(this) === Rs .data(lastChecked) || Rs .data(this) === Rs .data(target)) {
                        inrange = (inrange) ? false : true;
                    }
                    if (inrange) {
                        Rs (this).prop("checked", target.checked)
                            .parent().parent().toggleClass(options.selectedClass, target.checked);
                    }
                });
            }
            Rs (target).parent().parent().toggleClass(options.selectedClass, target.checked);
            lastChecked = target;
            updateCounter();
        });
        Rs ('form#changelist-form table#result_list tr').on('change', 'td:gt(0) :input', function() {
            list_editable_changed = true;
        });
        Rs ('form#changelist-form button[name="index"]').on('click', function(event) {
            if (list_editable_changed) {
                return confirm(gettext("You have unsaved changes on individual editable fields. If you run an action, your unsaved changes will be lost."));
            }
        });
        Rs ('form#changelist-form input[name="_save"]').on('click', function(event) {
            var action_changed = false;
            Rs ('select option:selected', options.actionContainer).each(function() {
                if (Rs (this).val()) {
                    action_changed = true;
                }
            });
            if (action_changed) {
                if (list_editable_changed) {
                    return confirm(gettext("You have selected an action, but you haven't saved your changes to individual fields yet. Please click OK to save. You'll need to re-run the action."));
                } else {
                    return confirm(gettext("You have selected an action, and you haven't made any changes on individual fields. You're probably looking for the Go button rather than the Save button."));
                }
            }
        });
    };
    /* Setup plugin defaults */
    Rs .fn.actions.defaults = {
        actionContainer: "div.actions",
        counterContainer: "span.action-counter",
        allContainer: "div.actions span.all",
        acrossInput: "div.actions input.select-across",
        acrossQuestions: "div.actions span.question",
        acrossClears: "div.actions span.clear",
        allToggle: "#action-toggle",
        selectedClass: "selected"
    };
    Rs (document).ready(function() {
        var Rs actionsEls = Rs ('tr input.action-select');
        if (Rs actionsEls.length > 0) {
            Rs actionsEls.actions();
        }
    });
})(django.jQuery);
