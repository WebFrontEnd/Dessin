Dessin.ColorModel = function(){
    this.$init.apply(this,arguments);
};

Dessin.ColorModel.prototype = {
    $init : function(){
        var htColor = {"r":0, "g":0, "b":0, "a":1};

        if(arguments.length > 0){
            var vOptions = arguments[0];
            if(typeof vOptions === 'string'){
                htColor = this._convertStrToObj(vOptions);
            }
            if(typeof  vOptions === 'object'){
                htColor = vOptions;
            }
        }
        this.r = htColor.r;
        this.g = htColor.g;
        this.b = htColor.b;
        this.a = htColor.a;
    },
	_convertStrToObj : function(sColor){
		var aColors = sColor.substring(sColor.indexOf('(') + 1, sColor.lastIndexOf(')')).split(/,\s*/);
		return {
			r : parseInt(aColors[0], 10),
			g : parseInt(aColors[1], 10),
			b : parseInt(aColors[2], 10),
			a : parseFloat(aColors[3])
		}
	},

	toRGBAString : function(){
		return ['rgba(', this.r, ',', this.g, ',', this.b, ',', this.a, ')'].join('');
	},

    toRGBString : function(){
        return ['rgba(', this.r, ',', this.g, ',', this.b, ',', 1, ')'].join('');
    }
};