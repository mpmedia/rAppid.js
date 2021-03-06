define(['js/ui/View'], function (View) {

    return View.inherit('js.ui.CheckboxClass', {
        defaults: {
            componentClass: 'checkbox',
            checked: false,
            value: null,
            label: "",
            name: null,

            selected: "{checked}"
        },

        _renderLabel: function (label) {
            if (label) {
                this._renderTemplateToPlaceHolder('label', 'label', {$label: label});
            }
        }
    });
});