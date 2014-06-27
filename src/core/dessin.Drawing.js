Dessin.Drawing = function(){
    this.$init.apply(this, arguments);
};

Dessin.Drawing.prototype = {
    $init: function(){
        this._aCoords = [];
        this._nSize = 0;
        this._sStylar = "round";
        this._oColor = null;
        this._sFontName = '';
    },
    get: function(){
        return JSON.parse(JSON.stringify(this));
    },

    pushCoords: function(coords){
        this._aCoords.push(coords);
        return this;
    },
    getCoords: function(){
        return this._aCoords;
    },
    getSize: function(){
        return this._nSize;
    },
    setSize: function(nSize){
        this._nSize = nSize;
        return this;
    },
    getStylar: function(){
        return this._sStylar;
    },
    setStylar: function(sStylar){
        this._sStylar = sStylar;
        return this;
    },
    getColor: function(){
        return this._oColor;
    },
    setColor: function(oColor){
        this._oColor = oColor;
        return this;
    },

    getFontName: function(){
        return this._sFontName;
    },

    setFontName: function(sFontName){
        this._sFontName = sFontName;
        return this;
    }
};
