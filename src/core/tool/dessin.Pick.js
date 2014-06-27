Dessin.Pick = function(htOptions){
    this.$initPick(htOptions)
};

Dessin.Pick.prototype = {
    $initPick: function(htOptions){
    },

    startDraw : function(layers, coords){
        var x = coords.x;
        var y = coords.y;

        var canvas = layers.getMergedCanvas(true);
        var width = canvas.width;
        var height = canvas.height;
        var context = canvas.getContext('2d');

        var imageData = context.getImageData(0, 0, width, height);
        var data = imageData.data;
        var r = data[((width * y) + x) * 4];
        var g = data[((width * y) + x) * 4 + 1];
        var b = data[((width * y) + x) * 4 + 2];
        var a = data[((width * y) + x) * 4 + 3];

        return new Dessin.ColorModel({ r: r, g: g, b: b, a:a});
    },

    draw : function(layer, coords){},
    endDraw : function(layer){}
};