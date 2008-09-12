/*
Script: PluginName.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [copyright holders](http://).

*/
var PluginName = new Class({
	
	Implements: [Options, Events],
	
	options: {
		
	},
	
	initialize: function(options){
		this.setOptions(options);
		
		$$('p').setStyle('background','blue');
		
		this.fireEvent("initialize");
	}
	
});
