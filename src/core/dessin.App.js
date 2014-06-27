// Dessin Entry Point
Dessin.App = function(){
    this.$init.apply(this, arguments);
};

Dessin.App.prototype = {
    DEFAULT_LAYER_COUNT : 3,
    DEFAULT_WIDTH : 250,
    DEFAULT_HEIGHT : 250,
    $init: function(wel, htOptions){
        this.nLayerCount = htOptions.nLayerCount || this.DEFAULT_LAYER_COUNT;
        this.nWidth = htOptions.nWidth || this.DEFAULT_WIDTH;
        this.nHeight = htOptions.nHeight || this.DEFAULT_HEIGHT;
        this.welStageWrapper = wel;
        this._preLoadResources();
        this.oController = new Dessin.Controller(this.welStageWrapper, {
            "defaultLayerCount" : this.nLayerCount,
            "defaultWidth" : this.nWidth,
            "defaultHeight" : this.nHeight,
            "oPainter" : this
        });
        this.oModel = this.oController.oModel;
        this.oLayers = this.oController.oLayers;
    },

    _preLoadResources: function(){
        Dessin.Utility.setBrushImage(Dessin.BRUSH.RES_BRUSH_IMAGE_URL);
        Dessin.Utility.setBrushImage(Dessin.BRUSH.RES_CRAYON_IMAGE_URL);
        Dessin.Utility.setBrushImage(Dessin.BRUSH.RES_AIR_BRUSH_IMAGE_URL);
        Dessin.Utility.setBrushImage(Dessin.BRUSH.RES_PATTERN_IMAGE_URL);
    },

    undo: function(){
        this.oController.undo();
    },

    redo: function(){
        this.oController.redo();
    },

    draw: function(drawObjects){
        this.oController.draw(drawObjects);
    },

    getCurrentLayer: function(){
        return this.oController.getCurrentLayer();
    },

    setCurrentLayerNumber: function(nLayer){
        this.oController.setCurrentLayerNumber(nLayer);
    },

    getLayer: function(nLayer){
        return this.oController.getLayer(nLayer);
    },

    addSnapShots: function(){
        this.oController.addSnapShots();
    },

    clearAllPreLayers: function(){
        this.oLayers.clearPreLayers();
    },

    zoomIn: function(sZoomType){
        this.oController.zoomIn(sZoomType);
        this.clearAllPreLayers();
    },

    zoomOut: function(sZoomType){
        this.oController.zoomOut(sZoomType);
        this.clearAllPreLayers();
    },

    zoomMove: function(sType){
        this.oController.zoomMove(sType);
    },

    setZoomType: function(sZoomType){
        this.oModel.setZoomType(sZoomType);
    },

    resetLayers : function(){
        this.oController.clearAllLayers();
    }
};

