var menuView;

var myConfiguration = function(){
	var api = {};

	api.setup = function(){
		var htmlId = "menu";
		menuView = MenuView(htmlId);		
	};

	api.teardown = function(){
	};

	api.expectedMenuList = function(){
		var menuA = new Menu("menu_a");
		menuA.addSubMenu(new Menu("submenu_a_1"));
		menuA.addSubMenu(new Menu("submenu_a_2"));

		var menuB = new Menu("menu_b");
		menuB.addSubMenu(new Menu("submenu_b_1"));
		menuB.addSubMenu(new Menu("submenu_b_2"));		
		menuB.addSubMenu(new Menu("submenu_b_3"));		
		
		var menuC = new Menu("menu_c");
		menuC.addSubMenu(new Menu("submenu_c_1"));
		menuC.addSubMenu(new Menu("submenu_c_2"));
		menuC.addSubMenu(new Menu("submenu_c_3"));
		menuC.addSubMenu(new Menu("submenu_c_4"));

		var list = {};
		list[menuA.getTitle()] = menuA;
		list[menuB.getTitle()] = menuB;
		list[menuC.getTitle()] = menuC;

		return list;
	};	

	api.rebuildHtmlMenu = function(){
		var $menu = $("#menu").children(".menuItems");
		$menu.children(":eq(1)").append('<a id="menu_b" rel="submenu2" href="#">Menu b</a>');
		$menu.children(":eq(2)").append('<a id="menu_c" rel="submenu3" href="#">Menu c</a>');
	}

	return api;
}();

module("Menu View", myConfiguration);
//teardown para retornar os elementos da DOM

test("Creating menus according to the DOM", function(){
	equal(menuView.getMenuList().size(), 3, "Size should be an available method and return 3");
	var list = menuView.getMenuList();
	delete(list.size);
	deepEqual(list, myConfiguration.expectedMenuList(), "There should be a list with 3 menus");
});

test("Apply Permissions and Remove DOM", function(){

	var permissions = [];
	permissions["menu_a"] = true;
	permissions["menu_b"] = false;
	permissions["menu_c"] = false;

	menuView.setPermissions(new Permissions(permissions));

	menuView.actOverPermissions();

	var idMenu = "#menu_b";

	ok($("#menu").children(".menuItems").find(idMenu).length === 0, "There should not be a " + idMenu + " on the list");

	idMenu = "#menu_c";
	ok($("#menu").children(".menuItems").find(idMenu).length === 0, "There should not be a " + idMenu + " on the list");
	
	idMenu = "#menu_a"
	ok($("#menu").children(".menuItems").find(idMenu).length === 1, "There should not be a " + idMenu + " on the list");

	myConfiguration.rebuildHtmlMenu();
});

test("Apply Permissions do submenus and remove children from DOM", function(){
	var permissions = [];
	permissions["menu_a"] = true;
	permissions["menu_b"] = false;
	permissions["menu_c"] = true;
	permissions["submenu_a_1"] = true; 
	permissions["submenu_a_2"] = true;

	permissions["submenu_c_1"] = true;
	permissions["submenu_c_2"] = true;
	permissions["submenu_c_3"] = false;
	permissions["submenu_c_4"] = true;

	menuView.setPermissions(new Permissions(permissions));

	console.log(':: ACT ::');
	menuView.actOverPermissions();
	console.log(':: END ACT ::');
	
	var idSubmenu = "#submenu1";

	var condiction = ($(idSubmenu).children("a#submenu_a_1") !== undefined && $(idSubmenu).children("a#submenu_a_2") !== undefined);
	ok(condiction, "Both \"A\"'s submenus should exists");

	idSubmenu = "#submenu3";
	condiction = ($(idSubmenu).children("a#submenu_c_1") !== undefined && $(idSubmenu).children("a#submenu_c_2") !== undefined);
	ok(condiction, "Should C's first and second submenus not be undefined");

	ok($(idSubmenu).children("a#submenu_c_3").length === 0, "Should the third C's submenu be undefined");

	myConfiguration.rebuildHtmlMenu();
});