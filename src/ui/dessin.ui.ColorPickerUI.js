Dessin.ui.ColorPickerUI = function(){
    this.$init.apply(this, arguments);
};


Dessin.ui.ColorPickerUI.prototype = {
    $init: function(oPainter){
        this._oPainter = oPainter;
        this._oModel = oPainter.oModel;
        this._setElements();
        this._setEvents();
        this.updatePalette();
        this._initComponents();
        this.updateColorSlider(this._oModel.getSelectedColor());
    },

    _setElements: function(){
        this._welSelectedColors = $('#selected_colors');
        this._welRed = $("#_red_slider");
        this._welGreen = $("#_green_slider");
        this._welBlue = $("#_blue_slider");
        this._welSwatch = $("#swatch");
    },

    _setEvents: function(){
        this._welSelectedColors.on('click', '._color_palette_btn', $.proxy(this._onClickColorPaletteBtn, this));
        $(this._oModel).on("model.pick", $.proxy(this._updateColorPicker, this));

    },
    _updateColorPicker : function(e, data){
        this.updateColorSlider(data.color);
        this.updatePalette();
    },

    _onClickColorPaletteBtn: function(e){
        var sColor = $(e.currentTarget).attr('data-color');
        this.updateColorSlider(new Dessin.ColorModel(sColor));
    },

    _initComponents: function(){
        $("#_red_slider, #_green_slider, #_blue_slider").slider({
            range : "min",
            min : 0,
            max: 255,
            change: $.proxy(this._setSwatch, this)
        });
    },

    _hexFromRGB: function(r, g, b){
        var hex = [
            r.toString(16),
            g.toString(16),
            b.toString(16)
        ];
        $.each(hex, function(nr, val){
            if (val.length === 1) {
                hex[ nr ] = "0" + val;
            }
        });
        return hex.join("").toUpperCase();
    },

    _setSwatch: function(){
        var red = this._welRed.slider("value"),
            green = this._welGreen.slider("value"),
            blue = this._welBlue.slider("value"),
            hex = this._hexFromRGB(red, green, blue);
        this._welSwatch.css("background-color", "#" + hex);
        this._oModel.setSelectedColor(new Dessin.ColorModel({r:red, g:green, b:blue}));
    },

    updateColorSlider: function(oColor){
        this._welRed.slider("value", oColor.r);
        this._welGreen.slider("value", oColor.g);
        this._welBlue.slider("value", oColor.b);
        this._setSwatch();
    },

    updatePalette: function(){
        var sTemplate = '<div class="_color_palette_btn palette_color" data-color="<%= color %>" style="background-color:<%= color %>"></div>';
        var aTemplates = [];
        var sColor = "";
        var aSelectedColors = this._oModel.getSelectedColors();

        for (var i = 0; i < Dessin.ui.DEFAULT_MAX_SAVE_COLOR_COUNT; i++) {
            if (aSelectedColors[i]) {
                sColor = new Dessin.ColorModel(aSelectedColors[i]).toRGBString();
            } else {
                sColor = 'rgba(255,255,255,1)';
            }
            aTemplates.push(_.template(sTemplate, {color: sColor}));
        }
        this._welSelectedColors.html(aTemplates.join(''));
    }

};