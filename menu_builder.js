;
(function(window, $){

	var MenuBuilder = null;

	var mainMenus = {};

	var permissions;

	var emitter = null;

	window.MenuBuilder = MenuBuilder = function(mainMenuNames, emitterObject){

		var api = {};	

		mainMenus = mainMenuNames;

		emitter = emitterObject;

		mainMenus.size = function() {
			
			var total = 0;

			for(var key in this){
				if(typeof this[key] !== 'function'){				
					total++;
				}
			}

			return total;
		};

		api.getNumberOfMenuItems = function(){
			return mainMenus.size();
		}

		var menuExists = function(menuName){
			return (mainMenus[menuName] !== undefined && mainMenus[menuName] !== null);
		}

		api.getMenuList = function(){
			return mainMenus;
		}

		api.getMenu = function(menuName){
			if(!menuExists(menuName)){
				var submenuGot = null;
				$.each(mainMenus, function(index, menu){
					if(typeof menu !== 'function'){
						var subMenu = menu.getSubMenu(menuName);
						if(subMenu){
							submenuGot = subMenu;
							return false;
						}
					}
				});
				return submenuGot;
			}
			return mainMenus[menuName];
		}

		api.menu = function(key){
			api.selectedMenu = api.getMenu(key);
			return api;
		}

		api.hasSubMenus = function(){
			return api.selectedMenu.hasSubMenus();
		}

		api.setPermissions = function(contract){
			permissions = contract;
		}

		api.processPermissions = function(){
			$.each(mainMenus, function(name, menu){
				if(typeof menu !== 'function'){
					if(!permissions.isAllowed(menu.getTitle())){
						emitter.emit("removeMenu", menu.getTitle());
					}else{
						verifySubmenusPermissions(menu);
					}
				}
			});
		}

		var verifySubmenusPermissions = function(menu){
			$.each(menu.getAllSubmenus(), function(submenuName, subMenu){
				if(!permissions.isAllowed(subMenu.getTitle())){
					emitter.emit("removeSubMenu", menu.getTitle(), subMenu.getTitle());
				}
			});
		}

		api.on = function(actionName, action){
			emitter.on(actionName, action);
		}	

		api.isAllowed = function(){
			if(api.selectedMenu === undefined || api.selectedMenu === null)
				return false;
			return permissions.isAllowed(api.selectedMenu.getTitle());
		}

		return api;
	};

})(window, jQuery);