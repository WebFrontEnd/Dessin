Dessin.Eraser = function(htOptions){
    this.$initEraser(htOptions);
};
Dessin.Eraser.prototype = {
    $initEraser : function(htOptions){
        this._oModel = new Dessin.Drawing();
        this._oModel.setSize(htOptions.size || 10);
    },
    startDraw: function(layer, coords){
        this._setStartCoords(coords);
    },
    draw: function(layer, coords){
        var context = layer.getLayerContext();
        this._oModel.pushCoords(coords);
        context.save();
        this._setupConfig(context);
        this._eraseLine(context, coords);
        context.restore();
        this._setStartCoords(coords);
    },
    endDraw: function(layer, coords){
        this.draw(layer, coords);
    },
    _eraseLine: function(context, coord){
        var aCoords = this._oModel.getCoords();
        context.beginPath();
        if (aCoords.length > 1) {
            context.moveTo(this._startCoords.x, this._startCoords.y);
            context.lineTo(coord.x, coord.y);
        } else {
            context.arc(coord.x, coord.y, 0.5, 0, 2 * Math.PI, true);
        }
        context.stroke();
    },
    _setupConfig: function(context){
        var stylar = this._oModel.getStylar();
        context.lineCap = stylar;
        context.lineJoin = stylar;
        context.strokeStyle = "rgba(0,0,0)";
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = this._oModel.getSize();
    },
    _setStartCoords: function(coords){
        this._startCoords = coords;
    }
};