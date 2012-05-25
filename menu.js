;(function(window){

	var Menu = window.Menu = function(title){
		this.countSubMenus = 0;
		this.title = title;
		this.children = {};
	}

	Menu.prototype.getTitle = function() {
		return this.title;
	};

	Menu.prototype.addSubMenu = function(submenu) {
		this.children[submenu.getTitle()] = submenu;
		this.countSubMenus++;
	};

	Menu.prototype.hasSubMenus = function() {
		return this.numberOfSubMenus() > 0;
	};

	Menu.prototype.numberOfSubMenus = function() {
		return this.countSubMenus;
	};

	Menu.prototype.containsSubMenu = function(title) {
		return this.children[title] !== undefined;
	};

	Menu.prototype.getAllSubmenus = function() {
		if(!this.hasSubMenus()){
			return null;
		}else{
			var list = {};
			for(var childName in this.children){
				var menuChild = this.children[childName];
				list[menuChild.getTitle()] = menuChild;
				var children = menuChild.getAllSubmenus();
				if(children !== null){
					for(var nestChildrenName in children){
						list[children[nestChildrenName].getTitle()] = children[nestChildrenName];
					}					
				}
			}
			return list;
		}		
	};
		
	/*
	* recursive algorithm to find all submenus until an item does not have 
	* a submenu
	*/
	Menu.prototype.getSubMenu = function(subMenuName) {

		if(!this.hasSubMenus()){
			return null;
		}

		if(this.containsSubMenu(subMenuName)){
			return this.children[subMenuName];
		}

		return this.loopIntoChildrenMenus(subMenuName);
	};

	Menu.prototype.loopIntoChildrenMenus = function(subMenuName){
		for(var name in this.children){
			var childMenu = this.children[name];
			var submenu = childMenu.getSubMenu(subMenuName);
			if(submenu !== null && submenu !== undefined){
				return submenu;
			}
		}
		return null;		
	}

})(window);