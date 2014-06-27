Dessin.Line = function(htOptions){
    this.$initLine(htOptions)
};
Dessin.Line.prototype = {
    $initLine: function(htOptions){
        this._oModel = this._createModel(htOptions);

    },
    _createModel: function(htOptions){
        var oModel = new Dessin.Drawing();
        htOptions.color.a = htOptions.color.a > 1 ? htOptions.color.a / 100 : htOptions.color.a || 1;
        oModel.setColor(htOptions.color);
        oModel.setSize(htOptions.size || 1);
        return oModel;
    },
    createBrush: function(oImage){
        this._oNewImage = Dessin.Utility.changeImageColor(oImage, this._oModel.getColor(), this._oModel.getSize());
    },
    startDraw: function(layer, coords){
        this._oModel.pushCoords(coords);
    },
    draw: function(layer, coords){
        var context = layer.getPreLayerContext();
        this._oModel.pushCoords(coords);
        this._clearPrevContext(layer);
        context.save();
        this._setupConfig(context);
        this._drawStroke(context, this._oModel.getCoords());
        context.restore();
    },
    endDraw: function(layer, coords){
        var context = layer.getLayerContext();
        this._clearPrevContext(layer);
        context.save();
        this._setupConfig(context);
        this._drawStroke(context, this._oModel.getCoords());
        context.restore();
    },
    _setupConfig: function(context){
        var stylar = this._oModel.getStylar();
        context.lineCap = stylar;
        context.lineJoin = stylar;
        context.lineWidth = this._oModel.getSize();
        this.setupEachConfig(context);
    },
    _clearPrevContext: function(layer){
        var context = layer.getPreLayerContext(),
            canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    _drawStroke: function(context, aCoords){
        var oCoord = null,
            oFirstCoord = aCoords[0],
            size = aCoords.length;

        context.beginPath();
        if (size > 1) {
            context.moveTo(oFirstCoord.x, oFirstCoord.y);
            for (var itr = 0; itr < size; itr += 1) {
                oCoord = aCoords[itr];
                context.lineTo(oCoord.x, oCoord.y);
            }
        } else {
            context.arc(oFirstCoord.x, oFirstCoord.y, 0.5, 0, 2 * Math.PI, true);
        }
        context.stroke();
    }
}