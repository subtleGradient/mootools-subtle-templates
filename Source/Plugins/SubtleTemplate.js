/*
Script: SubtleTemplate.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [Thomas Aylott](http://subtlegradient.com/).

*/
var SubtleTemplate = function(options){
	if(!options.element) return;
	
	options.element = $(options.element).dispose();
	
	options = $merge({
		tag: options.element.get('tag'),
		html: options.element.get('html'),
		data:{}
	}, options);
	
	options.element = null;
	
	var Template = new Class({
		
		Implements: [Options, Events],
		
		options: options,
		
		initialize: function(data, ops){
			this.setOptions(ops);
			
			this.populate(data);
			
			this.fireEvent("initialize");
		},
		
		populate: function(data){
			this.options.data = $merge(this.options.data, data);
			
			this.element = this.element || new Element(this.options.tag);
			
			this.element.set('html', this.options.html.substitute(this.options.data) );
			
			this.fireEvent("populate");
			return this;
		},
		
		inject: function(parent){
			this.element.inject(parent);
			this.fireEvent("inject");
			return this;
		}
		
	});
	
	return Template;
};
