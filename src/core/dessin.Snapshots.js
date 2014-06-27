Dessin.Snapshots = function(){
    this.$init.apply(this, arguments);
};

Dessin.Snapshots.prototype = {
    $init: function(htCanvasInfo){
        this._htCanvasInfo = htCanvasInfo;
        this.clearSnapShot();
    },
    /**
     * 기존 데이터를 초기화 시킨다.
     */
    clearSnapShot: function(){
        this._aRepository = [];
        this._nCursor = -1; //저장소 위치를 저장
        this._nCurrent = -1; //현재 위치를 저장
    },
    /**
     * 빈 이미지 데이터를 생성한다.
     * @returns {ImageData}
     * @private
     */
    _getBlankImageData : function(){
        var canvas = document.createElement('canvas'),
            context = canvas.getContext("2d");
        return context.createImageData(this._htCanvasInfo.defaultWidth,this._htCanvasInfo.defaultHeight);
    },
    /**
     * 커서를 한단계뒤로 이동
     * @returns {Object}
     * @private
     */
    _getPreviousData : function(){
        this._nCursor -= 1;
        return this._aRepository[this._nCursor];
    },
    /**
     * 커서를 한단계앞으로 이동
     * @returns {Object}
     * @private
     */
    _getNextData : function(){
        this._nCursor += 1;
        return this._aRepository[this._nCursor];
    },

    _spliceRepositoryByStart: function(nStart){
        //커서 이후의 데이터를 삭제
        this._aRepository.splice(nStart);

        var nRepositoryLastIndex = this._aRepository.length - 1;
        this._nCurrent = nRepositoryLastIndex;
        this._nCursor = nRepositoryLastIndex;
    },
    /**
     * 모든 레이어의 현재 스냅샷을 저장한다
     * @param oLayers
     */
    addSnapShot : function(oLayers){

        if (this._nCurrent !== this._nCursor) {
            this._spliceRepositoryByStart(this._nCursor+1);
        }
        //처음 저장하는 경우 빈이미지데이터를 저장
        if(this._aRepository.length < 1){
            this._addAllImageData(oLayers, true);
        }

        this._addAllImageData(oLayers, false);
    },

    _addAllImageData : function(oLayers, bEmptyImageData){
        var aStory = [];
        for(var i = 0, itr = oLayers.getLayersLength(); i < itr; i += 1){
            var oLayer = oLayers.getLayer(i);
            var nLayerId = oLayer.getLayerId();
            aStory.push({
                nLayerId: nLayerId,
                oSnapShot: this._getImageDataBy(bEmptyImageData,  oLayer)
            });
        }
        this._nCursor += 1;
        this._nCurrent += 1;
        this._aRepository[this._nCursor] = aStory;
    },

    _getImageDataBy: function(bEmptyImageData, oLayer){
        return bEmptyImageData ? this._getBlankImageData() : oLayer.getLayerImageData();
    },


    /**
     * 이전 그림을 가져온다
     * @returns {*}
     */
    undo :function(){
        var htData = this._getPreviousData();

        if(!htData){
            this._nCursor += 1; //커서를 되돌려 놓는다
            return false;
        }

        return this._aRepository[this._nCursor];
    },
    /**
     * 다음 그림을 가져온다
     * @returns {*}
     */
    redo : function(){
        var htData = this._getNextData();

        if(!htData){
            this._nCursor -= 1; //커서를 되돌려 놓는다
            return false;
        }

        return this._aRepository[this._nCursor];
    }
};