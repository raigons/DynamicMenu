var Permissions = function(contracts){

	Permissions.SIMPLE_CONVERTOR = "simple";

	this.configuration = [];

	if(contracts !==  undefined)
		this.configuration = contracts;
}

Permissions.fn = Permissions.prototype;

Permissions.fn.isAllowed = function(itemName){
	if(this.configuration[itemName] === undefined)
		return true;
	return this.configuration[itemName] === true;
}

Permissions.fn.convertPermissions = function(permissions, type){
	var convertor = this.convertors(type);
	convertor(permissions);
};

Permissions.fn.convertors = function(type){
	return this.typeConvertors()[type];
}

Permissions.fn.typeConvertors = function(){

	var self = this;

	var types = {};

	types.simple = function(permissions){
		for(var menuName in permissions){
			self.configuration[menuName] = permissions[menuName];
		}		
	};

	return types;
}