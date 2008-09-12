/*
Script: SubtleTemplate.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [copyright holders](http://).

*/
var SubtleTemplate = function(options){
	
	options = $merge({
		element:null,
		data:{}
	}, options);
	
	options.dad = new Element('div').adopt( options.element );
	
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
			
			if(this.element) var old_element = this.element;
			
			var dad = new Element('div',{
				'html': this.options.dad.get('html').substitute( this.options.data )
			});
			
			this.element = dad.removeChild(dad.childNodes[0]);
			
			if(this.options.data.id)
				this.element.set('id', this.options.data);
			else
				this.element.erase('id');
			
			
			if(old_element && old_element.parentNode){
				this.options.parent = old_element.parentNode;
				this.element.inject(old_element, 'after');
				
			}else if(this.options.parent)
				this.options.parent.adopt( this.element );
			
			
			if(old_element) old_element.destroy();
			
			this.fireEvent("populate");
			return this;
		},
		
		inject: function(parent){
			this.element.inject(parent);
			this.options.parent = parent;
			this.fireEvent("inject");
			return this;
		}
		
	});
	
	return Template;
};
