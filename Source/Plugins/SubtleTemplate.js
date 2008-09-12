/*
Script: SubtleTemplate.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [copyright holders](http://).

*/
var SubtleTemplate = new Class({
	
	Implements: [Options, Events],
	
	options: {
		
	},
	
	initialize: function(options){
		this.setOptions(options);
		
		$$('p').setStyle('background','blue');
		
		this.fireEvent("initialize");
	}
	
});
