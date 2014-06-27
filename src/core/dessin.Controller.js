Dessin.Controller = function(){
    this.$init.apply(this, arguments)
};

Dessin.Controller.prototype = {
    $init : function(welStageWrapper, htOptions){
        //로컬저장소에서 가져옴
        this.oPersistentStore = new Dessin.PersistentStore({ delay : 250 });
        this.welStageWrapper = welStageWrapper;

        this.oModel = new Dessin.Model({
            "aSelectedColors" : this.oPersistentStore.getItem("Dessin.Colors"),
            "nSelectedToolNumber" : this.oPersistentStore.getItem("Dessin.Tool"),
            "defaultWidth" : htOptions.defaultWidth,
            "defaultHeight" : htOptions.defaultHeight
        });

        var htCanvasInfo = {
            "defaultLayerCount": htOptions.defaultLayerCount,
            "defaultWidth": htOptions.defaultWidth,
            "defaultHeight": htOptions.defaultHeight
        };
        this.oLayers = new Dessin.Layers(this.welStageWrapper, htCanvasInfo);
        this.oSnapshots = new Dessin.Snapshots(htCanvasInfo);

        $(this.oModel).on("model.pick", $.proxy(this._setColorToPersistentStore, this))
                        .on("model.tool", $.proxy(this._setToolToPersistentStore, this));

    },

    _setColorToPersistentStore : function(e,data){
        this.oPersistentStore.setItem("Dessin.Colors",data.colors);
    },

    _setToolToPersistentStore : function(e,data){
        //pick tool은 저장하지 않음
        if(data.tool == Dessin.TOOL.PICK){
            return false;
        }
        this.oPersistentStore.setItem("Dessin.Tool", data.tool);
    },

    addSnapShots: function(){
        this.oSnapshots.addSnapShot(this.oLayers);
    },

    undo: function(){
        var aSnapshot = this.oSnapshots.undo();

        if (aSnapshot.length === 0) {
            return false;
        }

        _.each(aSnapshot, $.proxy(this._putLayerImageData, this));

    },
    redo: function(){
        var aSnapshot = this.oSnapshots.redo();

        if (aSnapshot.length === 0) {
            return false;
        }

        _.each(aSnapshot, $.proxy(this._putLayerImageData, this));

    },

    _putLayerImageData: function(curData){
        var nLayerId = curData.nLayerId;
        var layer = this.oLayers.getLayer(nLayerId);
        var destCanvas = layer.getLayerElement(),
            destContext = layer.getLayerContext();
        var newCanvas = this._saveCanvas(curData.oSnapShot),
            nWidth = destCanvas.width,
            nHeight = destCanvas.height;
        layer.clearLayer();
        destContext.drawImage(newCanvas, 0, 0, nWidth, nHeight);
    },

    setPreLayerZoomLevel: function(){
        var nScale = this.oModel.getZoomLevel();
        var nWidth = this.oModel.getOriginCanvasWidth() * nScale,
            nHeight = this.oModel.getOriginCanvasHeight() * nScale;
        this.getCurrentLayer().setPreLayerWidth(nWidth);
        this.getCurrentLayer().setPreLayerHeight(nHeight);
    },

    setCurrentLayerNumber: function(nLayer){
        this.oModel.setCurrentLayerNumber(nLayer);
        this.oLayers.appendPreLayerBy(this.getCurrentLayer());
        this.setPreLayerZoomLevel();
    },

    getCurrentLayer: function(){
        var nCurrentLayerNumber = this.oModel.getCurrentLayerNumber();
        return this.oLayers.getLayer(nCurrentLayerNumber);
    },

    getLayer : function(layerId){
        return this.oLayers.getLayer(layerId);
    },


    /**
     * Get Merged Canvas
     * @param bOnlyVisible
     * @returns Canvas Element
     */
    zoomIn: function(sType){
        var oModel = this.oModel;

        if (oModel.isAvailAddZoomLevel() === false) {
            return;
        }

        oModel.addZoomLevel();
        oModel.setZoomType(sType);

        this._resizeCanvas(oModel);
    },
    zoomOut: function(sType){
        var oModel = this.oModel;

        if (oModel.isAvailSubtractZoomLevel() === false) {
            return;
        }

        oModel.subtractZoomLevel();
        oModel.setZoomType(sType);

        this._resizeCanvas(oModel);
    },
    zoomMove: function(sType){
        if (this.oModel.getZoomLevel() > 1) {
            this.oModel.setZoomType(sType);
        }
    },

    _saveCanvas: function(imageData){
        var tempCanvas = $("<canvas>")
            .attr("width", imageData.width)
            .attr("height", imageData.height)[0];
        var context = tempCanvas.getContext("2d");
        context.putImageData(imageData, 0, 0);
        return tempCanvas;
    },

    _resizeCanvas: function(oModel){
        var nLevel = oModel.getZoomLevel(),
            nWidth = oModel.getOriginCanvasWidth() * nLevel,
            nHeight = oModel.getOriginCanvasHeight() * nLevel,
            oLayers = this.oLayers,
            oLayer = null,
            oCanvasStore = null,
            context = null;
        //모든 Layer 리사이징
        for (var itr = 0, count = oLayers.getLayersLength(); itr < count; itr += 1) {
            oLayer = oLayers.getLayer(itr);
            context = oLayer.getLayerContext();
            //사이즈 변경시 데이터가 삭제되기 때문에 현재 이미지를 저장
            oCanvasStore = this._saveCanvas(oLayer.getLayerImageData());
            //사이즈를 변경
            oLayer.setLayerWidth(nWidth);
            oLayer.setLayerHeight(nHeight);
            context.imageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.oImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.drawImage(oCanvasStore, 0, 0, nWidth, nHeight);
        }

        //선택되 layer의 가상 canvas 리사이징
        this.setPreLayerZoomLevel();

        //마우스 포인터를 나타내는 canvas 리사이징
        var welSurface = this.welStageWrapper.find('#_surface');
        welSurface.attr("width", nWidth);
        welSurface.attr("height", nHeight);

        //현재 캔버스 사이즈를 저장
        oModel.setCanvasSize(nWidth, nHeight);
    },

    clearAllLayers : function(){
        this.oLayers.clearLayers();
        this.oSnapshots.clearSnapShot();
    }
};