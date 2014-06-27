Dessin.Brush = function(htOptions){
    _.extend(this, new Dessin.Image(htOptions));
    this.$initBrush();
};

Dessin.Brush.prototype = {
    $initBrush: function(){
        var oImage = Dessin.Utility.getImage(Dessin.BRUSH.RES_BRUSH_IMAGE_URL);
        this.createBrush(oImage);
    }

};