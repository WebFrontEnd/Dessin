Dessin.Model = function(){
    this.$init.apply(this, arguments);
};

Dessin.Model.prototype = {
    MIN_TOOL_SIZE  : 1,
    MAX_TOOL_SIZE  : 50,
    MIN_TOOL_BLUR_SIZE : 0.1,
    MAX_TOOL_BLUR_SIZE : 1.0,
    MIN_FONT_SIZE : 10,
    MAX_FONT_SIZE : 30,
    /**
     * 기본 설정 값
     * @param {{nSelectedToolNumber : number, aSelectedColors : array, defaultWidth : number, defaultHeight : number}} htConfig
     * @private
     */
	_$initProp : function(htConfig){
        /**
         * 로컬저장소에 저장된 데이터
         * @type
         * @private
         */
        this._nSelectedToolNumber = htConfig.nSelectedToolNumber || Dessin.TOOL.NONE;
        this._aSelectedColors = htConfig.aSelectedColors || [];
        this._sFontName = "굴림체";
        this._nFontSize = 10;
        this._nToolSize = 5;
        this._nToolBlur = 0.5;
        this._nCurrentLayer = 0;
        this._nZoomLevel = 1;
        this._nOriginalCanvasWidth = 0;
        this._nOriginalCanvasHeight = 0;
        this._nCanvasWidth = 0;
        this._nCanvasHeight = 0;
        this._sText = "";
        this._sZoomType = "";
        this._oSelectedColor = this.getSelectedColor();
        //_nToolBlur 값을 alpha 값으로 설정
        this.setSelectedColor();
	},

	$init : function(htOptions){
		this._$initProp(htOptions);
        this._setOriginCanvasSize(htOptions.defaultWidth, htOptions.defaultHeight);
        this.setCanvasSize(htOptions.defaultWidth, htOptions.defaultHeight);
	},

	_setOriginCanvasSize : function(nWidth, nHeight){
		this._nOriginalCanvasWidth = nWidth;
		this._nOriginalCanvasHeight = nHeight;
	},

	getOriginCanvasWidth: function(){
		return this._nOriginalCanvasWidth;
	},

	getOriginCanvasHeight: function(){
		return this._nOriginalCanvasHeight;
	},

	getFontName : function(){
		return this._sFontName;
	},

	setFontName : function(sFontName){
		this._sFontName = sFontName;
	},

	getCurrentLayerNumber : function(){
		return this._nCurrentLayer;
	},

	setCurrentLayerNumber : function(nLayerNumber){
		this._nCurrentLayer = nLayerNumber;
	},

	getCanvasWidth : function(){
		return this._nCanvasWidth;
	},

    getCanvasHeight : function(){
		return this._nCanvasHeight;
    },
	setCanvasSize : function(width, height){
        this._nCanvasWidth = width;
		this._nCanvasHeight = height;
    },

	isAvailAddZoomLevel : function(){
		return this._nZoomLevel > Dessin.ZOOM_LEVEL.MIN && this._nZoomLevel < Dessin.ZOOM_LEVEL.MAX;
	},

    addZoomLevel: function(){
	    if (this.isAvailAddZoomLevel()) {
		    this._nZoomLevel += 1;
	    }
    },

	isAvailSubtractZoomLevel : function(){
		return this._nZoomLevel > 1;
	},

    subtractZoomLevel: function(){
        if (this.isAvailSubtractZoomLevel()) {
            this._nZoomLevel -= 1;
        }
    },

    getZoomLevel: function(){
        return this._nZoomLevel;
    },

    setZoomType : function(sType){
        this._sZoomType = sType;
        this._nSelectedToolNumber = Dessin.TOOL.NONE;
        $(this).trigger("model.tool", { "tool" : this._nSelectedToolNumber});

    },

    getZoomType : function(){
        return this._sZoomType;
    },

    getFontSize : function(){
        return this._nFontSize;
    },

    setFontSize : function(nFontSize){
        this._nFontSize = this._getBetweenMinAndMax(this.MIN_FONT_SIZE, this.MAX_FONT_SIZE, nFontSize);
    },

    setToolBlur : function(nToolBlur){
        this._nToolBlur = this._getBetweenMinAndMax(this.MIN_TOOL_BLUR_SIZE, this.MAX_TOOL_BLUR_SIZE, nToolBlur);
        this._oSelectedColor.a = this._nToolBlur;
    },
    getToolBlur : function(){
        return this._nToolBlur;
    },

    getToolSize : function(){
        return this._nToolSize;
    },
    setToolSize : function(nToolSize){
        this._nToolSize = this._getBetweenMinAndMax(this.MIN_TOOL_SIZE, this.MAX_TOOL_SIZE, nToolSize);
    },

    setSelectedFontName : function(sFontName){
        this._sFontName = sFontName;
    },
    getSelectedFontName : function(){
        return this._sFontName;
    },

    setSelectedToolNumber : function(nSelectedToolNumber){
        this._nSelectedToolNumber = nSelectedToolNumber;
        //Zoom move 초기화
        this._sZoomType = Dessin.LAYER_ACTION.NONE;
        $(this).trigger("model.tool", { "tool" : nSelectedToolNumber});
    },

    getSelectedToolNumber : function(){
        return this._nSelectedToolNumber;
    },

    getSelectedToolName : function(){
        var nSelectedTool = this._nSelectedToolNumber;
        return _.invert(Dessin.TOOL)[nSelectedTool];
    },

    getSelectedColor : function(){
        return this._oSelectedColor;
    },

    setSelectedColor : function(oColor){
        this._oSelectedColor = oColor || new Dessin.ColorModel();
        this._oSelectedColor.a = this.getToolBlur();
        $(this).trigger("model.color", oColor);
    },

    getSelectedColors : function(){
        return this._aSelectedColors;
    },

    pushSelectedColors : function(oColor){
        var aSelectedColors = this._aSelectedColors;

        if(this._hasColor(aSelectedColors, oColor)){
            return false;
        }

        if(this._isFullPalette(aSelectedColors)){
            this._aSelectedColors.shift();
        }

        this._aSelectedColors.push(oColor);
        $(this).trigger("model.pick", { colors : this._aSelectedColors, color : oColor});
    },

    _hasColor : function(aSelectedColors, oTargetColor){
        var aFind = _.where(aSelectedColors, oTargetColor);
        return aFind.length > 0 ? true : false;
    },

    _isFullPalette: function(aSelectedColors){
        return aSelectedColors.length >= Dessin.ui.DEFAULT_MAX_SAVE_COLOR_COUNT;
    },
    /**
     * 최대값을 넘으면 최대값을 최소값을 넘으면 최소값을 반환한다
     * 최대, 최소값 범위에 있는 경우에는 그 값을 반환한다.
     * @param {number} nMinValue
     * @param {number} nMaxValue
     * @param {number} nCompareValue
     * @returns {number}
     * @private
     */
    _getBetweenMinAndMax : function(nMinValue, nMaxValue, nCompareValue){
        if(nCompareValue < nMinValue || nCompareValue > nMaxValue){
            return Math.min(Math.max(nMinValue, nCompareValue), nMaxValue);
        }
        return nCompareValue;
    }
};