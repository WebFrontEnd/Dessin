Dessin.Image = function(htOptions){
    this._startCoords = null;
    this.$initImage(htOptions);
};
Dessin.Image.prototype = {
    $initImage: function(htOptions){
        this._oModel = this._createModel(htOptions);
    },
    _createModel: function(htOptions){
        var oModel = new Dessin.Drawing();
        oModel.setColor(htOptions.color);
        oModel.setSize(htOptions.size || 1);
        return oModel;
    },
    createBrush: function(oImage){
        this._oNewImage = Dessin.Utility.changeImageColor(oImage, this._oModel.getColor(), this._oModel.getSize());
    },
    startDraw: function(layer, coords){
        this._setStartCoords(coords);
    },
    draw: function(layer, coords){
        var context = layer.getPreLayerContext();
        var startCoords = this._getStartCoords();
        var nHalfImageWidth = this._oModel.getSize() / 2;
        var nHalfImageHeight = this._oModel.getSize() / 2;
        var endCoords = coords;
        var distance = this._distanceBetween2Points(startCoords, endCoords);
        var angle = this._angleBetween2Points(startCoords, endCoords);
        var x, y;
        for (var itr = 0; (itr <= distance || itr == 0); itr++) {
            x = startCoords.x + (Math.sin(angle) * itr) - nHalfImageWidth;
            y = startCoords.y + (Math.cos(angle) * itr) - nHalfImageHeight;
            this._oModel.pushCoords({x: x, y: y});
        }
        this._setStartCoords(endCoords);
        this._clearPrevContext(layer);
        this._drawPath(context);
    },

    endDraw: function(layer){
        this._clearPrevContext(layer);
        this._drawPath(layer.getLayerContext());
    },

    _drawPath: function(context){
        var aCoords = this._oModel.getCoords();
        var oCoord = null;
        context.save();
        context.globalAlpha = this._oModel.getColor().a;
        for (var itr = 0, size = aCoords.length; itr < size; itr += 1) {
            oCoord = aCoords[itr];
            context.drawImage(this._oNewImage, oCoord.x, oCoord.y);
        }
        context.restore();
    },
    _clearPrevContext: function(layer){
        var context = layer.getPreLayerContext(),
            canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    _distanceBetween2Points: function(point1, point2){
        var dx = point2.x - point1.x;
        var dy = point2.y - point1.y;
        return parseInt(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)), 10);
    },
    _angleBetween2Points: function(point1, point2){
        var dx = point2.x - point1.x;
        var dy = point2.y - point1.y;
        return Math.atan2(dx, dy);
    },
    _setStartCoords: function(coords){
        this._startCoords = coords;
    },
    _getStartCoords: function(){
        return this._startCoords;
    }
};