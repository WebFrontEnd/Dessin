/**
 *
 * @class nts.
 * @author kim.hyeonmi@nhn.com
 * @version 0.1.0
 * @since 14. 6. 17
 * @copyright Copyright (c) 2014, NHN Technology Services inc.
 * @param {number} comment
 * @example
 */
Dessin.ui.LayerController = function(){
    this.$init.apply(this, arguments);
};

Dessin.ui.LayerController.prototype = {
    /** @lends Dessin.LayerUI.prototype */
    $init: function(oPainter){
        this.oPainter = oPainter;
        this._oModel = oPainter.oModel;
        this._welStageWrapper = oPainter.welStageWrapper;
        this._welSurface = this._welStageWrapper.find('#_surface');
        this._setEvents();
    },
    /**
     * set Element Events
     * @private
     */
    _setEvents: function(){
        var htTouchEvent = Dessin.Touch.touchEvent();

        this._welStageWrapper
            .on(htTouchEvent.touchStartEvent, $.proxy(this._onTouchDownOnStage, this))
            .on(htTouchEvent.touchMoveEvent, $.proxy(this._onTouchMoveOnStage, this));

        $(document)
            .on(htTouchEvent.touchStopEvent, $.proxy(this._onTouchUpOnDocument, this))
            .on('selectstart', function(e){
                e.preventDefault();
            });
    },

    _isZoomMove: function(){
        return this._oModel.getZoomType() === Dessin.LAYER_ACTION.ZOOMMOVE;
    },

    _isTextTool : function(){
        return this._oModel.getSelectedToolNumber() === Dessin.TOOL.TEXT;
    },

    _isPickTool : function(){
        return this._oModel.getSelectedToolNumber() === Dessin.TOOL.PICK;
    },

    _createContorollerUIFactory: function(){
        //Zoom Move 상태와 Drawing 상태에 따라 인스턴스를 생성한다.
        if (this._isZoomMove()) {
            this.oUI = new Dessin.ui.LayerUI(this.oPainter);
        } else {
            this._oDrawing = this._createDrawingFromFactory();
            if (this._isTextTool()) {
                this.oUI = Dessin.ui.TextUI.getInstance(this.oPainter, this._oDrawing);
            } else {
                this.oUI = new Dessin.ui.DrawingUI(this.oPainter, this._oDrawing);
            }

        }
    },

    _onTouchDownOnStage: function(e){
        this._createContorollerUIFactory();
        var htCoords = this._getAbsCoordinate(e.originalEvent);
        this.oUI.onTouchDown(htCoords);
        this._drawSurfacePointer(htCoords);
    },

    _onTouchMoveOnStage: function(e){
        e.preventDefault();
        var htCoords = this._getAbsCoordinate(e.originalEvent);
        this._drawSurfacePointer(htCoords);
        if(this.oUI){
            this.oUI.onTouchMove(htCoords);
        }
    },

    /**
     * on Draw End
     * @param e
     * @private
     */
    _onTouchUpOnDocument: function(e){
        if(this.oUI){
            if (this._isTextTool()){
                return true;
            }

            this.oUI.onTouchUp(this._getAbsCoordinate(e.originalEvent));
            this.oUI = null;
            this.oPainter.clearAllPreLayers();

            if(this._isPickTool() || this._isZoomMove()){ return true;}
            this.oPainter.addSnapShots();
        }

        this.clearSurface();
    },
    _drawSurfacePointer: function(htCoordinate){
        if (this._nSelectedToolNumber === Dessin.TOOL.TEXT) {
            this._setSurfaceCursorStyle('text');
        } else {
            this._setSurfaceCursorStyle('crosshair');
            this._drawPointer(htCoordinate);
        }
    },
    _setSurfaceCursorStyle: function(sCursorName){
        if(this._welSurface.css('cursor') === sCursorName){
            return false;
        }

        this._welSurface.css('cursor', sCursorName);
    },
    _drawPointer: function(htCoordinate){
        var surfaceCtx = this.clearSurface();
        surfaceCtx.strokeStyle = this._oModel.getSelectedColor().toRGBAString();
        surfaceCtx.beginPath();
        surfaceCtx.arc(htCoordinate.x, htCoordinate.y, this._oModel.getToolSize() / 2, 0, 2 * Math.PI, true);
        surfaceCtx.closePath();
        surfaceCtx.stroke();
    },

    _getSurfaceContext: function(){
        return this._welSurface[0].getContext('2d');
    },

    clearSurface: function(){
        var surfaceCtx = this._getSurfaceContext();
        surfaceCtx.clearRect(0, 0, this._welSurface.width(), this._welSurface.height());
        return surfaceCtx;
    },
    /**getPreLayerElement
     * get Absolute Coordinate From Event
     * This function makes to available on touch base devices
     * @param e
     * @returns {*}
     */
    _getAbsCoordinate: function(e){
        e = Dessin.Touch.hasRealTouch() ? e.changedTouches[0] : e;
        return {
            x: Math.ceil(e.clientX - this._welSurface.offset().left + window.scrollX),
            y: Math.ceil(e.clientY - this._welSurface.offset().top + window.scrollY)
        };
    },
    _createDrawingFromFactory: function(){
        var oModel = this._oModel;
        var oInstance = Dessin.ToolSimpleFactory.getInstance().createDrawing(oModel.getSelectedToolNumber(), {
            oColor: oModel.getSelectedColor(),
            nToolSize: oModel.getZoomLevel() * oModel.getToolSize(),
            nFontSize : oModel.getFontSize(),
            sFontName: oModel.getFontName()
        });
        return oInstance;
    }
};