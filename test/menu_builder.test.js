module("Menu Builder");

test("Adding menu Names", function(){
	var menu = {};
	menu["a"] = "menu a";
	menu["b"] = "menu b";
	menu["c"] = "menu c";

	var menuBuilder = MenuBuilder(menu);

	equal(menuBuilder.getNumberOfMenuItems(), 3, "Should menu have 3 items for menu");

	equal(menuBuilder.getMenu("a"), "menu a", "Menu 'a' should contains 'menu a'");
});

test("Adding menus with submenus", function(){
	var menuList = {};	

	var menuA = new Menu("menu a");
	menuA.addSubMenu(new Menu("submenu a-a"));
	menuA.addSubMenu(new Menu("submenu a-b"));

	var menuB = new Menu("menu b");
	var submenuBA = new Menu("submenu b-a");
	menuB.addSubMenu(submenuBA);
	menuB.addSubMenu(new Menu("submenu b-b"));

	var menuC = new Menu("menu c");


	menuList[menuA.getTitle()] = menuA;
	menuList[menuB.getTitle()] = menuB;
	menuList[menuC.getTitle()] = menuC;

	var menuBuilder = MenuBuilder(menuList);

	ok(menuBuilder.menu("menu a").hasSubMenus(), "It was expected a to have submenus");
	ok(!menuBuilder.menu("menu c").hasSubMenus(), "It was expected c to not have submenus");

	equal(menuBuilder.getMenu("submenu b-a"), submenuBA, "Method 'getMenu' also should be able to get submenus");
});

test("Nested submenus", function(){
	var menuList = {};

	var menuA = new Menu("Menu a");
	var submenu = new Menu("SubMenu a");

	var subsubMenu1 = new Menu("A SubSubMenu a-a");
	var subsubMenu = new Menu("B SubSubMenu a-a");

	submenu.addSubMenu(subsubMenu1);
	submenu.addSubMenu(subsubMenu);
	menuA.addSubMenu(submenu);

	//menu B
	var menuB = new Menu("menu b");
	var submenuBA = new Menu("submenu b-a");
	menuB.addSubMenu(submenuBA);

	menuB.addSubMenu(new Menu("submenu b-b"));

	menuList[menuA.getTitle()] = menuA;
	menuList[menuB.getTitle()] = menuB;

	var menuBuilder = MenuBuilder(menuList);

	equal(menuBuilder.getMenu("B SubSubMenu a-a"), subsubMenu, "Method 'getMenu' also should be able to get submenus");
	equal(menuBuilder.getMenu("A SubSubMenu a-a"), subsubMenu1, "Method 'getMenu' also should be able to get submenus");
	equal(menuBuilder.getMenu("C SubSubMenu a-a"), null, "Method 'getMenu' also should be able to retur null for non existing submenus");	
});

test("Adding menus, submenus and Permissions", function(){
	var menuList = {};	

	var menuA = new Menu("menu a");
	menuA.addSubMenu(new Menu("submenu a-a"));
	menuA.addSubMenu(new Menu("submenu a-b"));

	var menuB = new Menu("menu b");
	menuB.addSubMenu(new Menu("submenu b-a"));
	menuB.addSubMenu(new Menu("submenu b-b"));

	var menuC = new Menu("menu c");


	menuList[menuA.getTitle()] = menuA;
	menuList[menuB.getTitle()] = menuB;
	menuList[menuC.getTitle()] = menuC;

	var menuBuilder = MenuBuilder(menuList);

	var permissions = [];
	permissions["menu a"] = true;
	permissions["menu b"] = false;
	permissions["menu c"] = false;
	permissions["menu d"] = true;
	permissions["submenu a-a"] = false;

	var contract = new Permissions(permissions);

	menuBuilder.setPermissions(contract);

	ok(menuBuilder.menu("menu a").isAllowed(), "Menu a should be Allowed");
	ok(!menuBuilder.menu("menu b").isAllowed(), "Menu b should not be allowed");

	ok(!menuBuilder.menu("menu e").isAllowed(), "An inexisting menu should not be allowed");

	ok(!menuBuilder.menu("submenu a-a").isAllowed(), "SubMenu a-a should not be allowed");
});

test("Test emit events", function(){
	var menuList = {};	

	var menuA = new Menu("menu a");
	menuA.addSubMenu(new Menu("submenu a-a"));
	menuA.addSubMenu(new Menu("submenu a-b"));

	var menuB = new Menu("menu b");

	var menuC = new Menu("menu c");


	menuList[menuA.getTitle()] = menuA;
	menuList[menuB.getTitle()] = menuB;
	menuList[menuC.getTitle()] = menuC;


	var permissions = [];
	permissions["menu a"] = true;
	permissions["menu b"] = false;
	permissions["menu c"] = false;
	permissions["menu d"] = true;
	permissions["submenu a-a"] = false;
	permissions["submenu a-b"] = true;

	var contract = new Permissions(permissions);
	var emitter = {
		emitCalled: 0,
		events: {},
		on: function(action, callback){
			this.events[action] = callback;
		}, 
		emit: function(){
			var args = [].slice.apply(arguments);
			var action = args.shift();
			this.events[action].apply(null, args);
		}
	}

	var menuBuilder = MenuBuilder(menuList, emitter);
	menuBuilder.setPermissions(contract);

	
	var removeCalled = 0;
	var menuNameList = [];
	menuBuilder.on("removeMenu", function(menuName){
		removeCalled += 1;
		menuNameList.push(menuName);
	});

	var removeSubMenuCalled = 0;
	var submenuParams = [];
	menuBuilder.on("removeSubMenu", function(menuName, subMenuName){
		removeSubMenuCalled += 1;
		submenuParams = [menuName, subMenuName];
	});

	menuBuilder.processPermissions();

	equal(removeCalled, 2, "The Action 'removeMenu' should have been called 2 times");
	equal(removeSubMenuCalled, 1, "The Action 'removeSubMenu' should have been called 2 times");
	deepEqual(menuNameList, ["menu b", "menu c"], "Actions params must be informed");
	deepEqual(submenuParams, ["menu a", "submenu a-a"]);
});
