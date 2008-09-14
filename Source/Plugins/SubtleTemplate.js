/*
Script: SubtleTemplate.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [Thomas Aylott](http://subtlegradient.com/).

*/
var SubtleTemplate = new Class({
	
	Implements: Options,
	
	options:{
		tag:     'div',
		'class': '',
		html:    '{html}',
		data:    {}
	},
	
	/*
		initialize
		accepts elements or an object of options
	*/
	initialize:function(options){
		if($type(options)=='element')
			this.setElementOptions(options);
		else
			this.setOptions(options);
		
		this.template = new Class({ Extends:SubtleTemplate.Template });
		
		this.template.prototype.options = this.options;
		return this.template;
	},
	
	setElementOptions: function(element){
		if(!element) return this.fireEvent('error');
		element = $(element);
		
		this.setOptions({
			parent: element.parentNode ? $(element.parentNode) : null,
			tag:    element.get('tag'),
			'class':element.get('class'),
			html:   element.get('html')
		});
		
		element.dispose();
		element = null;
		
		return this;
	}
});
SubtleTemplate.Template = new Class({
	
	Implements: [Options, Events],
	
	initialize: function(data, options){
		this.setOptions(options);
		this.setOptions({ data:data });
		
		this.element = new Element(this.options.tag, { 'class': this.options['class'] });
		this.populate(this.options.data);
		
		return this.fireEvent("initialize");
	},
	
	populate: function(data, options){
		this.setOptions(options);
		this.setOptions({ data:data });
		
		this.element.set('html', this.options.html.substitute(this.options.data) );
		this.element.set('id', this.options.data.id );
		this.element.set('class', this.options.data['class'] );
		
		return this.fireEvent("populate");
	},
	
	inject: function(parent){
		this.element.inject( parent||this.options.parent );
		return this.fireEvent("inject");
	}
	
});
