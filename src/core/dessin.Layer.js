Dessin.Layer = function () {
    this.$init.apply(this, arguments);
};

Dessin.Layer.prototype = {
	$init: function (htConf) {
        this.layerId = htConf.layerId;
        this.isVisible = htConf.isVisible;
	},

	getLayerId : function(){
		return this.layerId;
	},

	getLayerImageData : function(){
		var el = this.getLayerElement();
		var ctx = el.getContext('2d');
		return ctx.getImageData(0, 0, el.width, el.height);
	},

	clearPreLayer : function(){
		var elCanvas = this.getPreLayerElement();

		if(elCanvas){
			var ctx = elCanvas.getContext('2d');
			ctx.clearRect(0, 0, elCanvas.width, elCanvas.height);
		}
	},

    clearLayer : function(){
        var elCanvas = this.getLayerElement();

        if(elCanvas){
            var ctx = elCanvas.getContext('2d');
            ctx.clearRect(0, 0, elCanvas.width, elCanvas.height);
        }
    },

	getLayerElement : function(){
        return $('._stage[data-seq="' + this.layerId + '"] >canvas')[0];
    },

	getPreLayerElement : function(){
		return $('._stage[data-seq="' + this.layerId + '"] ._pre_layer canvas')[0];
	},

	getLayerContext : function(){
		return this.getLayerElement().getContext('2d');
	},

	getPreLayerContext : function(){
		return this.getPreLayerElement().getContext('2d');
    },
    setLayerWidth: function(width){
        $(this.getLayerElement()).attr("width", width);
    },
    setLayerHeight: function(height){
        $(this.getLayerElement()).attr("height", height);
    },
    setPreLayerWidth: function(width){
        $(this.getPreLayerElement()).attr("width", width);
    },
    setPreLayerHeight: function(height){
        $(this.getPreLayerElement()).attr("height", height);
    },
    showLayer : function(){
        this.getLayerElement().style.display = "block";
        this.isVisible = true;
    },
    hideLayer : function(){
        this.getLayerElement().style.display = "none";
        this.isVisible = false;
    }

};