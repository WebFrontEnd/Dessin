Dessin.Paint = function(htOptions){
    this.DRAW_MODE = Dessin.DRAW_MODE.IN_ADVANCE;
    this.$init.apply(this, arguments);
};

Dessin.Paint.prototype = {
    TOLERANCE: 0,
    $init: function(htOptions){
        this._oDrawing = new Dessin.Drawing();
        this._oDrawing.setColor(htOptions.color || new Dessin.ColorModel({}));
    },
    startDraw: function(oLayer, htCoords){
        var tolerance = this.TOLERANCE;
        var elCanvas = oLayer.getLayerElement();
        var x = htCoords.x;
        var y = htCoords.y;
        var oColor = this._oDrawing.getColor();
        oColor.a = Math.round(oColor.a * 255);

        var isDiff = function(c1, c2, tolerance){
            tolerance = Math.min(255, tolerance);
            if ((Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b) + Math.abs(c1.a - c2.a)) / 4 <= tolerance) {
                return true;
            } else {
                return false;
            }
        };

        var ctx = elCanvas.getContext('2d');
        var fId = ctx.getImageData(0, 0, elCanvas.width, elCanvas.height);
        var tId = ctx.getImageData(0, 0, elCanvas.width, elCanvas.height);
        var nPos = (x + y * elCanvas.width) * 4;
        var sc = new Dessin.ColorModel({r: tId.data[nPos], g: tId.data[nPos + 1], b: tId.data[nPos + 2], a: tId.data[nPos + 3]});
        var scstr = JSON.stringify(sc);
        var cstr = JSON.stringify(oColor);
        if (cstr == scstr) {
            return true;
        }

        var w = elCanvas.width;
        var h = elCanvas.height;
        if (x < 0 || x >= w || y < 0 || y >= h) {
            return false;
        }

        var arr = [(x + y * w)];
        var chObj = {};

        for (var i = 0; i < arr.length; i++) {
            var posi = arr[i];
            var x1 = posi % w;
            var y1 = Math.floor(posi / w);
            var pos = posi * 4;
            var tc = { r: tId.data[pos], g: tId.data[pos + 1], b: tId.data[pos + 2], a: tId.data[pos + 3] };

            if (isDiff(tc, sc, tolerance) && chObj[posi] !== true) {
                chObj[posi] = true;
                tId.data[pos] = oColor.r;
                tId.data[pos + 1] = oColor.g;
                tId.data[pos + 2] = oColor.b;
                tId.data[pos + 3] = oColor.a;
                if (y1 > 0) arr.push(posi - w);
                if (x1 < w - 1) arr.push(posi + 1);
                if (y1 < h - 1) arr.push(posi + w);
                if (x1 > 0) arr.push(posi - 1);
            }

            if (i > 1000000) {
                break;
            }
        }

        ctx.putImageData(tId, 0, 0);
        this._oDrawing.pushCoords(htCoords);
    },
    draw: function(){},
    endDraw: function(){}
};
