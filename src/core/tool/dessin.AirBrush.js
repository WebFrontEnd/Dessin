Dessin.AirBrush = function(htOptions){
    this.$initAirBrush(htOptions);
};

Dessin.AirBrush.prototype = {
    $initAirBrush: function(htOptions){
        this._oModel = this._createModel(htOptions);
        this._oNewImage = this._createBrush();
        this._nHalfSize = this._oModel.getSize() / 2;
    },
    _createModel: function(htOptions){
        var oModel = new Dessin.Drawing();
        htOptions.color.a = htOptions.color.a > 1 ? htOptions.color.a / 100 : htOptions.color.a || 1;
        oModel.setColor(htOptions.color);
        oModel.setSize(htOptions.size || 1);
        return oModel;
    },
    _createBrush: function(){
        var oImage = Dessin.Utility.getImage(Dessin.BRUSH.RES_AIR_BRUSH_IMAGE_URL);
        return Dessin.Utility.changeImageColor(oImage, this._oModel.getColor(), this._oModel.getSize());
    },
    startDraw: function(oLayer, htCoords){
    },
    draw: function(oLayer, htCoords){
        var context = oLayer.getPreLayerContext();
        this._oModel.pushCoords(htCoords);
        this._clearPrevContext(oLayer);
        context.save();
        this._setupConfig(context);
        this._drawPath(context);
        context.restore();

    },
    endDraw: function(oLayer, htCoords){
        var context = oLayer.getLayerContext();
        this._oModel.pushCoords(htCoords);
        this._clearPrevContext(oLayer);
        context.save();
        this._setupConfig(context);
        this._drawPath(context);
        context.restore();
    },
    _setupConfig: function(context){
        context.globalAlpha = this._oModel.getColor().a;
    },
    _drawPath: function(context){
        var aCoords = this._oModel.getCoords(),
            htCoords = null,
            oNewImage = this._oNewImage;
        var x, y;
        for (var itr = 0, size = aCoords.length; itr < size; itr += 1) {
            htCoords = aCoords[itr];
            x = htCoords.x - this._nHalfSize;
            y = htCoords.y - this._nHalfSize;
            context.drawImage(oNewImage, x, y);
        }
    },
    _clearPrevContext: function(oLayer){
        var context = oLayer.getPreLayerContext(),
            canvas = context.canvas;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
};