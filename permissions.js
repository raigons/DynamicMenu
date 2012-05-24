var Permissions = function(contracts){
	this.configuration = [];
	this.configuration = contracts;
}

Permissions.fn = Permissions.prototype;

Permissions.fn.isAllowed = function(itemName){
	if(this.configuration[itemName] === undefined)
		return true;
	return this.configuration[itemName] === true;
}