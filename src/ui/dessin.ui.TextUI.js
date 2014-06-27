Dessin.ui.TextUI = function(){
    this.$init.apply(this, arguments);
};

Dessin.ui.TextUI.prototype = {
    $init : function(oPainter, oDrawing){
        this._oPainter = oPainter;
        this._oModel = oPainter.oModel;
        this._oDrawing = oDrawing;
        this._nSelectedToolNumber = this._oModel.getSelectedToolNumber();
        this._oLayer = this._oPainter.getCurrentLayer();
        this._bFlag = false;
    },
    onTouchDown : function(htCoords){
        if(this._bFlag === false){
            this._oDrawing.startDraw(this._oLayer, htCoords);
            this._bFlag = true;
        }else{
            this._oDrawing._drawRearCanvas();
            this._oPainter.addSnapShots();
            this._bFlag = false;
            this._oDrawing = null;
            Dessin.ui.TextUI.instance = null;
        }
    },
    onTouchMove : function(htCoords){},
    onTouchUp : function(htCoords){}

};

/**
 * singleton pattern
 * @param oPainter
 * @param oDrawing
 * @returns {instance|*|null|Dessin.ToolSimpleFactory.instance}
 */
Dessin.ui.TextUI.getInstance = function(oPainter, oDrawing){
    if (Dessin.ui.TextUI.instance == null) {
        Dessin.ui.TextUI.instance = new Dessin.ui.TextUI(oPainter, oDrawing);
    }

    return Dessin.ui.TextUI.instance;
}

Dessin.ui.TextUI.instance = null;