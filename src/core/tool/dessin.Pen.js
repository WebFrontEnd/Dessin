Dessin.Pen = function(htOptions){
    _.extend(this, new Dessin.Line(htOptions));
};

Dessin.Pen.prototype = {
    setupEachConfig: function(context){
        context.strokeStyle = this._oModel.getColor().toRGBAString();
    }
};