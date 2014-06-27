Dessin.ui.ToolUI = function () {
	this.$init.apply(this, arguments);
};

Dessin.ui.ToolUI.prototype = {

	$init: function (oPainter) {
        this._oPainter = oPainter;
		this._oModel = oPainter.oModel;
		this._setElements();
		this._setEvents();
		this._setComponents();
        this._updatePreviewBrush();
        this._updateSelectedTool();
	},

	_setElements: function () {
        this._welPicker = $('._pick_color_btn');
		this._welToolSection = $('._tool_section');
		this._welLayerBtnSection = $('._layer_btn_section');
		this._welBrushPreview = $('._brush_preview');
        this._welFontNameSelect = $('#_font_select');
        this._welLayerTransformBtn = $("._layer_transform_btn_section");
        this._welAirbrushPannel = $('._airbrush_setting');
        this._welTextPannel = $('._text_option_stage');
    },

    _setEvents: function () {
        this._welLayerBtnSection.on('click', 'button', $.proxy(this._onClickSelectLayer, this));
        this._welLayerBtnSection.on('click', 'span', $.proxy(this._onClickVisibleLayer, this));
        this._welLayerTransformBtn.on("click", "button", $.proxy(this._onClickLayerTransformBtn, this));
        this._welToolSection.on('click', 'button', $.proxy(this._onClickTool, this));
        this._welPicker.on('click', $.proxy(this._onClickTool, this));
        this._welFontNameSelect.on('change', $.proxy(this._onChangeFontSelect, this));
        $(this._oModel).on("model.color", $.proxy(this._updatePreviewBrush,this));
        $(this._oModel).on("model.tool", $.proxy(this._updateSelectedTool,this));
    },

    _setComponents: function () {
        $('._brush_size_slider').slider({
            min : 1,
            max : 50,
            value : this._oModel.getToolSize(),
            change : $.proxy(this._onSelectedToolSize, this)
        });

        $('._brush_opacity_slider').slider({
            min : 0.1,
            max : 1.0,
            value : this._oModel.getToolBlur(),
            step : 0.1,
            change : $.proxy(this._onSelectedToolBlur, this)
        });

        $('._text_size_slider').slider({
            min : 10,
            max: 30,
            value: this._oModel.getFontSize(),
            step: 1,
            change : $.proxy(this._onSelectedFontSize, this)
        });
    },

    _onSelectedToolSize : function(event, ui){
        this._oModel.setToolSize(ui.value);
        this._updatePreviewBrush();
    },
    _onSelectedToolBlur : function(event, ui){
        this._oModel.setToolBlur(ui.value);
        this._updatePreviewBrush();
    },
    _onSelectedFontSize : function(event, ui){
        this._oModel.setFontSize(ui.value);
    },

	_onChangeFontSelect : function(e){
		var sFontName = $(e.currentTarget).val();
		this._oModel.setFontName(sFontName);
	},

	_onClickTool: function (e) {
		var $el = $(e.currentTarget);
		var sSelectedTool = $el.attr('data-tool-name');
		this._setToolActive(sSelectedTool, $el);
		this._oModel.setSelectedToolNumber(Dessin.TOOL[sSelectedTool]);
	},

    _setToolActive : function(sToolName, wel){
        var sActivateClass = "btn-primary";
        this._welToolSection.find('button').removeClass(sActivateClass);
        this._welPicker.removeClass(sActivateClass);
        wel.addClass(sActivateClass);

        switch (sToolName){
            case "TEXT" :
                this._welAirbrushPannel.hide();
                this._welTextPannel.show();
                break;
            case "PICK":
                this._welAirbrushPannel.hide();
                this._welTextPannel.hide();
                break;
            default :
                this._welAirbrushPannel.show();
                this._welTextPannel.hide();
                break;
        }
    },

	_onClickSelectLayer : function(e){
		this._welLayerBtnSection.find('button').removeClass('btn-success');
		var wel = $(e.currentTarget),
		    nLayerIdx = parseInt(wel.attr('data-layer-idx'), 10);
		this._oPainter.setCurrentLayerNumber(nLayerIdx);
		wel.addClass('btn-success');
	},

	_onClickVisibleLayer : function(e){
		var $el = $(e.currentTarget);
		var nLayerIdx = parseInt($el.parent().attr("data-layer-idx"), 10);
		var layer = this._oPainter.getLayer(nLayerIdx);

		if(layer.isVisible){
            layer.hideLayer();
            $el.text("X");
		} else{
			layer.showLayer();
            $el.text("O");
		}
	},

	_onClickLayerTransformBtn : function(e){
        var sButtonStyle = $(e.currentTarget).attr('data-type');
        var htLayerAction = Dessin.LAYER_ACTION;
        var sType = htLayerAction[sButtonStyle];
        switch (sType) {
            case htLayerAction.ZOOMIN:
                this._oPainter.zoomIn(sType);
                break;
            case htLayerAction.ZOOMOUT:
                this._oPainter.zoomOut(sType);
                break;
            case htLayerAction.ZOOMMOVE:
                this._oPainter.zoomMove(sType);
                break;
            case htLayerAction.UNDO:
                this._oPainter.undo();
                break;
            case htLayerAction.REDO:
                this._oPainter.redo();
                break;
            case htLayerAction.RESET:
                this._oPainter.resetLayers();
                break;
        }
    },

    _updateSelectedTool : function(){
        var sToolName = this._oModel.getSelectedToolName();
        var el = _.find(this._welToolSection.find('button'), function(value, key){
            return $(value).attr("data-tool-name") === sToolName;
        });
        this._setToolActive(sToolName, $(el));
    },

	_updatePreviewBrush : function(){
		var elCanvas = this._welBrushPreview[0];
        var width = elCanvas.width, height = elCanvas.height;
		var context = elCanvas.getContext('2d');
        context.clearRect(0, 0, width, height);
		context.lineWidth = this._oModel.getToolSize();
        context.strokeStyle = this._oModel.getSelectedColor().toRGBAString();
		context.lineCap = 'round';
		context.beginPath();
        context.arc(width/2, height/2, 0.5, 0, 2 * Math.PI, true);
		context.stroke();
		context.closePath();
	}
};