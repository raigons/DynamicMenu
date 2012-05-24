;(function(window, $){
	var Emitter;

	var events;	
	
	Emitter = window.Emitter = function(){		
		events = {};
	};

	var api = Emitter.prototype;

	api.on = function(event, action){
		if(!events[event]){
			events[event] = [];			
		}
		events[event].push(action);
	};

	api.events = function(){
		return events;
	};

	api.emit = function(){
		var args = [].slice.apply(arguments);		
		var event = args.shift(); 

		if(events[event]){
			$.each(events[event], function(i, callback){
				callback.apply(null, args);
			});
		}
	};

})(window, jQuery);
