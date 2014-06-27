Dessin.Crayon = function(htOptions){
    _.extend(this, new Dessin.Image(htOptions));
    this.$initCrayon();
};

Dessin.Crayon.prototype = {
    $initCrayon: function(){
        var oImage = Dessin.Utility.getImage(Dessin.BRUSH.RES_CRAYON_IMAGE_URL);
        this.createBrush(oImage);
    }
};