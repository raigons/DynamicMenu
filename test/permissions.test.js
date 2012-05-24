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