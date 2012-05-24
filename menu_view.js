;
(function(window, $){

	var MenuView = null;

	window.MenuView = MenuView = function(htmlId){
		var api = {};

		var $html = null;

		var menuBuilder;

		var init = function(htmlId){
			$html = $("#" + htmlId);
			menuBuilder = MenuBuilder(configMenus(), new Emitter());

			menuBuilder.on("removeMenu", removeMenu);
			menuBuilder.on("removeSubMenu", removeSubMenu);
		}

		var configMenus = function(){
			var $menus = $html.children(".menuItems").children('li');
			var listMenus = {};
			$menus.each(function(){
				var menuId = $(this).children("a").attr("id");
				var menu = new Menu(menuId);
				addSubMenus($(this), menu);

				listMenus[menu.getTitle()] = menu;
			});
			return listMenus;
		}

		var addSubMenus = function($menu, menu){
			var submenuDivId = $menu.children("a").attr("rel");
			if(submenuDivId !== undefined){
				$submenuDiv = $("#" + submenuDivId)
				$.each($submenuDiv.children("a"), function(i, elementSubmenu){
					menu.addSubMenu(new Menu(elementSubmenu.id));
				});
			}
		};

		api.getMenuList = function(){
			return menuBuilder.getMenuList();
		}

		api.setPermissions = function(permission){
			menuBuilder.setPermissions(permission);			
		};

		api.actOverPermissions = function(){
			menuBuilder.processPermissions();
		};

		var removeMenu = function(name){
			$html.children(".menuItems").find("#"+name).remove();
		}

		var removeSubMenu = function(menuName, submenuName){
			var submenuHtmlId = $html.children(".menuItems").find("#"+menuName).attr('rel');			
			var submenuHtml = $("#"+submenuHtmlId).children("a#" + submenuName);
			$(submenuHtml[0]).remove();
		}

		init(htmlId);

		return api;
	}

})(window, jQuery);