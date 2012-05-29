module("Permissions");

test("Set simple permissions - only main menu", function(){
	var permissions = [];
	permissions["menu a"] = true;
	permissions["menu b"] = false;
	permissions["menu c"] = false;
	permissions["menu d"] = true;

	var contract = new Permissions(permissions);

	ok(contract.isAllowed("menu a"), "There should be a permission Ok to 'menu a'");
	ok(!contract.isAllowed("menu b"), "There should not be a permission Ok to 'menu b'");
});

test("Translating Permissions from Server response to system understandable", function(){
	var contract = new Permissions();

	var responsePermissions = {
		menu_a: false, 
		menu_b: true, 
		menu_c: true, 
		menu_d: false, 
		menu_e: true, 
		menu_f: true
	};

	contract.convertPermissions(responsePermissions, Permissions.SIMPLE_CONVERTOR);
	assertPermissions(contract);
});

function assertPermissions(permissions){
	start();
	ok(!permissions.isAllowed("menu_a"), "Menu a should not be allowed");
	ok(permissions.isAllowed("menu_b"), "Menu b should be allowed");
	ok(permissions.isAllowed("menu_c"), "Menu c should be allowed");	
	ok(!permissions.isAllowed("menu_d"), "Menu d should not be allowed");
	ok(permissions.isAllowed("menu_e"), "Menu e should be allowed");	
	ok(permissions.isAllowed("menu_f"), "Menu f should be allowed");	

}

asyncTest("Get list of permissions", function(){
	mockGetSimplePermissions();
	var permissions = new Permissions();

	permissions.getPermissions().always(function(response){
		assertPermissions(permissions);
	});
});

function mockGetSimplePermissions(){
	var mock = {
		url: "Permissions/GetLista",
		status: 200,
		type: 'get', 
		contentType: 'json', 
		responseTime: 100,
		responseText: {
			data: {
					menu_a: false, 
					menu_b: true, 
					menu_c: true, 
					menu_d: false, 
					menu_e: true, 
					menu_f: true
			}			
		}
	};	
	$.mockjax(mock);
}