module("Menu object");

test("Setting names", function(){
	var menu = new Menu("Menu a");
	equal(menu.getTitle(), "Menu a", "Menu title should be 'Menu a'");	
});

test("Setting child", function(){
	var menu = new Menu("Menu a");

	var submenu = new Menu("Submenu a-1");

	menu.addSubMenu(submenu);

	ok(menu.hasSubMenus(), "Menu should have submenus");
	equal(menu.numberOfSubMenus(), 1, "Menu should have one submenu");
});

test("Test run over submenus", function(){

	var menu = new Menu("Menu a");
	var submenu = new Menu("SubMenu a");

	var subsubMenu1 = new Menu("A SubSubMenu a-a");
	var subsubMenu = new Menu("B SubSubMenu a-a");

	var thirdLevelSubMenu = new Menu("SubSubMenu a-a sub 1");
	subsubMenu1.addSubMenu(thirdLevelSubMenu);

	submenu.addSubMenu(subsubMenu1);
	submenu.addSubMenu(subsubMenu);


	menu.addSubMenu(submenu);

	ok(menu.containsSubMenu(submenu.getTitle()), "Menu should contains submenu called 'SubMenu a'");
	ok(!menu.containsSubMenu(subsubMenu.getTitle()), "Menu should contains a submenu called '" + subsubMenu.getTitle() + "'");

	equal(menu.getSubMenu("B SubSubMenu a-a"), subsubMenu, "Sub menu 'B SubSubMenu -a-a' should have been found 2 level under root");
	equal(menu.getSubMenu("C SubSubMenu a-a"), null, "There should not be a 'C SubSubMenu -a-a into any levels of the menu tree");

	var expectedSubmenuList = {};

	expectedSubmenuList[submenu.getTitle()] = submenu;
	expectedSubmenuList[subsubMenu1.getTitle()] = subsubMenu1;
	expectedSubmenuList[subsubMenu.getTitle()] = subsubMenu;
	expectedSubmenuList[thirdLevelSubMenu.getTitle()] = thirdLevelSubMenu;

	deepEqual(menu.getAllSubmenus(), expectedSubmenuList, "There should be a list with all submenus");
});