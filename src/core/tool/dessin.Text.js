Dessin.Text = function(){
    this.DRAW_MODE = Dessin.DRAW_MODE.SESSION;
    this.$init.apply(this, arguments);
};

Dessin.Text.prototype = {
    TEXTAREA_TEMPLATE: '<textarea id="_dessin_text_input" style="padding-top:15px;border:0;letter-spacing:0px;box-sizing: border-box;line-height:1.15;padding-left:12px;opacity:0.3;display:block;width:300px;overflow:hidden;background-color:#FFCC00;left:0;top:0;height:100px;position:absolute;z-index:1000;"></textarea>',
    $init: function(htTextModel){
        this._htTouchEvent = Dessin.Touch.touchEvent();
        this._oDrawing = new Dessin.Drawing();
        this._htCoords = { x: 0, y: 0 };
        this._nWidth = 0;
        this._nHeight = 0;

        this._oDrawing.setSize(htTextModel.size)
            .setColor(htTextModel.color)
            .setFontName(htTextModel.fontName || '');

        this._setElements();
    },

    _setElements: function(){
        if ($("#_dessin_text_input").length <= 0) {
            $('._dessin_stage').prepend(this.TEXTAREA_TEMPLATE);
        }

        this._welTextInput = $("#_dessin_text_input");
        this._unsetEvents();
        this._setEvents();
    },

    _unsetEvents: function(){
        this._welTextInput
            .off('keyup', $.proxy(this._onKeyUp, this))
            .off('focus', $.proxy(this._onFocusInput, this))
            .off('blur', $.proxy(this._onBlurInput, this));
    },

    _setEvents: function(){
        this._welTextInput
            .on('keyup', $.proxy(this._onKeyUp, this))
            .on('focus', $.proxy(this._onFocusInput, this))
            .on('blur', $.proxy(this._onBlurInput, this));

    },
    _onKeyUp : function(e){
        //27 esc key code
        if(e.keyCode === 27){
            this._drawRearCanvas();
        }else{
            this._drawTextPrevCanvas();
        }
    },
    _drawTextPrevCanvas: function(){
        this._bDrawCursor = true;
        this._updateView();
    },

    _onFocusInput: function(){
        this._bDrawCursor = true;
    },

    _onBlurInput: function(){
        this._bDrawCursor = false;
    },

    /**
     * 화면을 업데이트한다
     * @private
     */
    _updateView: function(){
        if (this.oLayer) {
            //2번째 인자로 좌표값이 없는 경우가 있다
            this._draw(this.oLayer, null);
        }
    },


    _getMaxString: function(sText){
        var aLines = sText.split("\n"),
            sMaxString = _.max(aLines, function(item){
                return item.length;
            });
        return sMaxString;
    },

    startDraw: function(oLayer, coords){
        this._htCoords = coords;
        var self = this;
        setTimeout(function(){
            self._welTextInput.focus();
        }, 100);
        this._draw(oLayer, coords);
    },

    _draw : function(oLayer, coords){
        this.oLayer = oLayer;
        if (coords) {
            this._htCoords = coords;
        }

        this.oLayer.clearPreLayer();
        this.drawTextToCanvas(oLayer.getPreLayerElement(), this._htCoords, true);
    },

    draw: function(oLayer, coords){},

    endDraw: function(oLayer){},

    _initContext: function(elCanvas){
        var context = elCanvas.getContext('2d');
        context.font = this._oDrawing.getSize() + 'px ' + this._oDrawing.getFontName();
        context.fillStyle = this._oDrawing.getColor().toRGBString();
        context.textAlign = "start";
        context.textBaseline = "alphabetic";
        return context;
    },

    _getHeight : function(ctx){
        var h = ctx.measureText('W').width;
        return h + h/6;
    },

    /**
     * 캔버스에 텍스트를 출력하는 함수
     * @param elCanvas
     * @param coords
     * @param bDrawBox
     */
    drawTextToCanvas: function(elCanvas, coords, bDrawBox){
        var ctx = this._initContext(elCanvas);
        var nHeight = this._oDrawing.getSize();
        var sText = this._welTextInput.val();
        var MAX_WIDTH= elCanvas.width - coords.x;
        var MIN_WIDTH = 150;
        var x = coords.x, y = coords.y;
        var nLine = sText.split("\n").length;
        ctx.wrapText(sText, x, y, MAX_WIDTH, nHeight);

        var nWidth = Math.max(MIN_WIDTH, MAX_WIDTH);
        if (bDrawBox === true) {
            this._drawDottedBox(ctx, x, y, nWidth, nHeight * nLine);
        }

        this._welTextInput.css({
            left : -1000,
            top : -1000,
            fontSize : this.fontSize + 'px',
            opacity : 0
        });

        if (this._bDrawCursor) {
            this._drawCursor(ctx, {
                el: $("#_dessin_text_input")[0],
                sText: sText,
                nFontSize: nHeight,
                htCoords: _.clone(coords)
            });
        }
    },

    /**
     * Cursor Drawer
     * @param ctx
     * @param htOptions
     * @private
     */
    _drawCursor: function(ctx, htOptions){
        var el = htOptions.el,
            sText = htOptions.sText,
            fontSize = htOptions.value,
            _htCoordinate = htOptions.htCoords;

        var htInputSelection = this._getInputSelection(el);
        var nEnterCnt = sText.substr(0, htInputSelection.start).split('\n').length - 1;
        var selectedLine = sText.split('\n')[nEnterCnt];
        var startText = sText.substr(htInputSelection.start, sText.length - 1).split('\n')[0];
        var endText = sText.substr(htInputSelection.end, sText.length - 1).split('\n')[0];
        var htStartTextMetrics = ctx.measureText(selectedLine.substr(0, selectedLine.length - startText.length));
        var htEndTextMetrics = ctx.measureText(selectedLine.substr(0, selectedLine.length - endText.length));
        var topPos = nEnterCnt * (this._oDrawing.getSize()) + 2;

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(
            _htCoordinate.x + htStartTextMetrics.width,
            _htCoordinate.y + topPos,
            htEndTextMetrics.width !== htStartTextMetrics.width ? htEndTextMetrics.width - htStartTextMetrics.width : 2,
            fontSize
        );
    },

    _drawRearCanvas: function(){
        this._bDrawCursor = false;

        var elCanvas = this.oLayer.getLayerElement();
        this.drawTextToCanvas(elCanvas, this._htCoords, false);
        this.oLayer.clearPreLayer();
        this._unsetEvents();
        this._welTextInput.val('');
        this._welTextInput.remove();
    },

    /**
     * Check Coordinate Inbound
     * @param _htCoordinate
     * @returns {boolean}
     */
    isInbound: function(htCoords, htStartCoods){
        return htCoords.x > htStartCoods.x &&
                htCoords.y > htStartCoods.y &&
                htCoords.x < htStartCoods.x + this._nWidth &&
                htCoords.y < htStartCoods.y + this._nHeight
            ;
    },

    /**
     * draw Dotted Box
     * @param ctx
     * @param x
     * @param y
     * @param width
     * @param height
     * @private
     */
    _drawDottedBox: function(ctx, x, y, width, height){
        ctx.dashedLine(x, y, x + width, y, 1);
        ctx.dashedLine(x, y + height, x, y, 1);
        ctx.dashedLine(x, y + height, x + width, y + height, 1);
        ctx.dashedLine(x + width, y, x + width, y + height, 1);
    },

    /**
     * get Input Selection
     * @param el
     * @returns {{start: number, end: number}}
     * @private
     */
    _getInputSelection: function(el){
        var nStart = 0, nEnd = 0, normalizedValue, range,
            textInputRange, nLen, endRange;

        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            nStart = el.selectionStart;
            nEnd = el.selectionEnd;
        } else {
            range = document.selection.createRange();

            if (range && range.parentElement() == el) {
                nLen = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
                endRange = el.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    nStart = nEnd = nLen;
                } else {
                    nStart = -textInputRange.moveStart("character", -nLen);
                    nStart += normalizedValue.slice(0, nStart).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        nEnd = nLen;
                    } else {
                        nEnd = -textInputRange.moveEnd("character", -nLen);
                        nEnd += normalizedValue.slice(0, nEnd).split("\n").length - 1;
                    }
                }
            }
        }

        return { start: nStart, end: nEnd };
    }
};

CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen){
    if (dashLen == undefined) dashLen = 2;

    this.beginPath();
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);

    this.stroke();
    this.closePath();
};

CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, lineHeight){
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        y += lineHeight;
        this.fillText(line, x, y);

    }
};