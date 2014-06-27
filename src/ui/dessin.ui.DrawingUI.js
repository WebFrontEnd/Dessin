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
Dessin.ui.DrawingUI = function(){
    this.$init.apply(this, arguments);
};

Dessin.ui.DrawingUI.prototype = {
    $init : function(oPainter, oDrawing){
        this._oPainter = oPainter;
        this._oModel = oPainter.oModel;
        this._oDrawing = oDrawing;
        this._welSurface = oPainter.welStageWrapper.find('#_surface');
        this._bDrawBegin = false;
        this._nSelectedToolNumber = this._oModel.getSelectedToolNumber();
    },

    onTouchDown : function(htCoords){
        switch (this._nSelectedToolNumber){
            case Dessin.TOOL.PICK:
                //선택한 컬러를 모델에 저장한다
                var oColorModel = this._oDrawing.startDraw(this._oPainter.oLayers, htCoords);
                this._oModel.pushSelectedColors(oColorModel);
                break;
            default :
                if(this._oDrawing === undefined){ return false;}
                this._oLayer = this._oPainter.getCurrentLayer();
                this._oDrawing.startDraw(this._oLayer, htCoords);
                break;
        }
        this._bDrawBegin = true;
    },
    onTouchMove : function(htCoords){
        if(this._bDrawBegin){
            this._oLayer = this._oPainter.getCurrentLayer();
            this._oDrawing.draw(this._oLayer, htCoords);
        }
    },
    onTouchUp : function(htCoords){
        if(this._bDrawBegin){
            this._oDrawing.endDraw(this._oLayer, htCoords);
        }
        this._bDrawBegin = false;

    }
};
