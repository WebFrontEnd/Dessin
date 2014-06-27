Dessin.Pattern = function(htOptions){
    _.extend(this, new Dessin.Line(htOptions));
    this.$initPattern();
};

Dessin.Pattern.prototype = {
    $initPattern: function(){
        var oImage = Dessin.Utility.getImage(Dessin.BRUSH.RES_PATTERN_IMAGE_URL);
        this.createBrush(oImage);
    },
    setupEachConfig: function(context){
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = this._oModel.getColor().a;
        context.strokeStyle = context.createPattern(this._oNewImage, 'repeat');

    }
};