Dessin.Touch = {
    _isMobile : function(){
        var filter = "win16|win32|win64|mac";
        if( navigator.platform  ){
            if( filter.indexOf(navigator.platform.toLowerCase())<0 ){
                return true;
            }else{
                return false;
            }
        }
    },
    _isTouch : function(){
        return "ontouchend" in document;
    },
    hasRealTouch : function(){
        return this._isMobile() && this._isTouch();
    },
    touchEvent : function(){
        var bSupportTouch = this.hasRealTouch();
        return {
            touchStartEvent : bSupportTouch ? "touchstart" : "mousedown",
            touchStopEvent : bSupportTouch ? "touchend touchcancel" : "mouseup",
            touchMoveEvent : bSupportTouch ? "touchmove" : "mousemove"
        }
    }
}