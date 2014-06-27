Dessin.ui.LayerUI = function(){
    this.$init.apply(this, arguments);
};

Dessin.ui.LayerUI.prototype = {
    $init : function(oPainter){
        this._welStageWrapper = oPainter.welStageWrapper;
        this._bZoomMove = false;
    },
    onTouchDown : function(httCoords){
        this._htStartCoords = httCoords;
        this._bZoomMove = true;

    },
    onTouchMove : function(htCoords){
        if(this._bZoomMove === false){
            return;
        }

        var htStartCoords = this._htStartCoords;
        var top = (htStartCoords.y - htCoords.y),
            left = (htStartCoords.x - htCoords.x);
        var welStage = this._welStageWrapper;
        welStage.scrollTop(welStage.scrollTop() + top);
        welStage.scrollLeft(welStage.scrollLeft() + left);

    },
    onTouchUp : function(htCoords){
        this._bZoomMove = false;
    }
};

Dessin.ui.LayerUI.constructor = Dessin.ui.LayerUI;