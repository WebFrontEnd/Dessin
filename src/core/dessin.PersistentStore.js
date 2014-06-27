Dessin.PersistentStore = function(options){
	this.options = _.extend({
		clearable : true,       // automatically Clear if an error
		delay : 2000,
		maximum : 5    // max Data : MB
	}, options);

	this.$init();
};

Dessin.PersistentStore.prototype = {

	$init : function(){
		if (typeof localStorage == "undefined" && typeof globalStorage != "undefined")
			window.localStorage = globalStorage[location.hostname];
		this.localStorage = window.localStorage;
		// undefined localStorage if it doesn't already exist
		if (!this.localStorage) this.localStorage = {
			getItem: function(name) {
				this.data = window.name ? window.name.evalJSON() : {};
				return $(this.data[name] || JSON.stringify(this.data[name] = {}));
			}, setItem: function(name, data) {
				this.data[name] = data.evalJSON();
				window.name = JSON.stringify(this.data);
			}, removeItem: function(name) {
				delete this.data[name];
				window.name = JSON.stringify(this.data);
			}
		};
	},

    getItem : function(name){
        try {
            return JSON.parse((this.localStorage.getItem(name)).toString());
        } catch(e) {
            this.options.clearable;
        }
    },

    setItem : function(name, data){
        if (data !== undefined || data !== null) this.data = data;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(function() {
            if (this.size(true, name) > this.options.maximum * 1048576) return;
            try {
                this.localStorage.setItem(name, JSON.stringify(this.data));
            } catch(e) {
                this.options.clearable && this.set({});
            }
        }.bind(this), this.options.delay)
    },

	// remove item
	remove: function(name) {
		this.localStorage.removeItem(name);
	},

	// remove all items
	clear: function() {
        var size = this.localStorage.length;
        if (!size){
            window.name = '{}';
        }else{
            for (var i = 0; i < size; i++) {
                this.remove(this.localStorage.key(i));
            }
        }

	},

	// size of localStorage
	size: function(bytes,name) {
        var oItem = this.getItem(name);
        if(!oItem){
            return false;
        }
		var data = JSON.stringify(oItem).length;
		return bytes ? data : data > 1024 ? (function() {
			data = (data / 1024).round().toString();
			var reg = /(^[+-]?\d+)(\d{3})/;
			while (reg.test(data)) data = data.replace(reg, '$1' + ',' + '$2');
			return data  + 'kb';
		})() : data + 'bytes';
	}
};