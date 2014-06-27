Dessin.Utility = {

    getRandInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    changeImageColor: function(oImage, oColor, nSize){
        var oNewBrush = new Image();
        var previewCanvas = document.createElement('canvas'),
            previewContext = previewCanvas.getContext("2d");
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCanvas.width = nSize;
        previewCanvas.height = nSize;
        previewContext.drawImage(oImage, 0, 0, nSize, nSize);
        var oImageData = previewContext.getImageData(0, 0, nSize, nSize);
        for (var index = 0, size = oImageData.data.length; index < size; index += 4) {
            oImageData.data[index] = oColor.r;
            oImageData.data[index + 1] = oColor.g;
            oImageData.data[index + 2] = oColor.b;
        }
        previewContext.putImageData(oImageData, 0, 0);
        oNewBrush.src = previewCanvas.toDataURL();
        return oNewBrush;
    },

    getRGBAString: function(oColor, nDivisor){
        var alpha = oColor.a / nDivisor;
        return "rgba(" + oColor.r + "," + oColor.g + "," + oColor.b + "," + alpha + ")";
    },

    setBrushImage : function(sUrl){
        if(this.aBrushImage === undefined){
            this.aBrushImage = [];
        }
        var oImage = new Image();
        oImage.src = sUrl;
        oImage.onload = $.proxy(function(){
            this.aBrushImage.push(oImage);
        }, this);


    },
    getImage: function(sUrl){
        var aBrushImage = this.aBrushImage;
        for(var i=0, size=aBrushImage.length; i<size; i+=1){
            var oImage = aBrushImage[i];
            if(oImage.src.indexOf(sUrl)>-1){
                return oImage;
            }
        }
    }
};
