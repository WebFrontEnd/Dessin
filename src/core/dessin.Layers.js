Dessin.Layers = function(){
    this.$init.apply(this, arguments);
};

Dessin.Layers.prototype = {
    LAYER_TMPL : '<div class="_stage" style="position:absolute;" data-seq="<%= seq %>"><canvas width="<%= width %>" height="<%= height %>" class="_surface"></canvas></div>',
    PRE_LAYER_TMPL : '<div class="_pre_layer" style="position:absolute;"><canvas width="<%= width %>" height="<%= height %>" class="_surface"></canvas></div>',
    SURFACE_TMPL : '<div class="_stage" style="position:absolute;z-index: 1;"><canvas id="_surface" width="<%= width %>" height="<%= height %>" class="_surface"></canvas></div>',
    $init: function(welStageWrapper, htConfig){
        this._aLayers = [];
        this._welStageWrapper = welStageWrapper;
        this._createLayerView(htConfig.defaultWidth, htConfig.defaultHeight, htConfig.defaultLayerCount);
        this._initPreLayer();
    },
    _createLayerView: function(width, height, layercount){
        var aLayers = [];
        for(var itr = 0, count = layercount; itr < count; itr++){
            var sLayerTemplate = _.template(this.LAYER_TMPL, {
                seq: itr,
                width: width,
                height: height
            });
            aLayers.push(sLayerTemplate);
            this._addLayer(itr);
        }
        aLayers.reverse();

        var sSurfaceTemplate = _.template(this.SURFACE_TMPL, {
            width: width,
            height: height
        });
        aLayers.unshift(sSurfaceTemplate);

        this._welStageWrapper.css({
            'width' : width + 'px',
            'height' : height + 'px'
        }).html(aLayers.join(''));

    },

    _addLayer: function(layerId){
        var oLayer = new Dessin.Layer({
            "layerId": layerId,
            "isVisible": true
        });
        this._aLayers.push(oLayer);
    },

    _initPreLayer : function(){
        var oLayer = this.getLayer(0);
        this.appendPreLayerBy(oLayer);
    },

    appendPreLayerBy : function (oLayer) {
        this._welStageWrapper.find('._pre_layer').remove();
        var wel = $(oLayer.getLayerElement()).parent();
        var nWidth = wel.width();
        var nHeight = wel.height();
        var sTemplate = _.template(this.PRE_LAYER_TMPL, {width: nWidth, height: nHeight});
        wel.prepend(sTemplate);
    },

    clearPreLayers : function(){
        var aLayers = this._aLayers;
        for(var litr = 0, count = aLayers.length; litr < count; litr++){
            aLayers[litr].clearPreLayer();
        }
    },
    clearLayers : function(){
        var aLayers = this._aLayers;
        for(var litr = 0, count = aLayers.length; litr < count; litr++){
            aLayers[litr].clearLayer();
        }
    },
    getLayersLength: function(){
        return this._aLayers.length;
    },

    getLayer: function(nLayer){
        return this._aLayers[nLayer];
    },

    getLayers: function(){
        return this._aLayers;
    },
    getMergedCanvas: function(bOnlyVisible){
        var bOnlyVisible = !!bOnlyVisible;

        var layers = this.getLayers();
        var visibleLayers = _.where(layers, {isVisible: bOnlyVisible});
        var canvas = document.createElement('canvas');
        var layer = layers[0].getLayerImageData();

        canvas.width = layer.width;
        canvas.height = layer.height;

        var cvsCtx = canvas.getContext('2d');

        cvsCtx.fillStyle = 'rgba(255,255,255,1)';
        cvsCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Merge Bottom To Top
        for (var i = visibleLayers.length - 1; i >= 0; i--) {
            var el = visibleLayers[i].getLayerElement();
            cvsCtx.drawImage(el, 0, 0);
        }

        return canvas;
    }
};