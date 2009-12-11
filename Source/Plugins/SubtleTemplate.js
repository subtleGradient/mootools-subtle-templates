/*
---
provides: [SubtleTemplate]
description: "Define templates in HTML. From Elements or Strings. Populate, re-populate, again and again super-fast. Modify templates AFTER you use them! Update all instances instantly."

license: MIT-style
author: Thomas Aylott
copyright: Copyright © 2006–2009 Thomas Aylott

requires: 
- core:1.2/Utils
- core:1.2/Class
- core:1.2/Events
- core:1.2/Options
- core:1.2/Element
...
*/
var SubtleTemplate = new Class({
	
	Implements: Options,
	
	options:{
		subTemplateClass:'SubtleTemplate',
		tag:     'div',
		id:      '',
		'class': '',
		html:    '{html}'
	},
	
	kids:[],
	
	/*
		initialize
		accepts elements or an object of options
	*/
	initialize:function(options){
		if($type(options)=='element')
			this.setElementOptions(options);
		else
			this.setOptions(options);
		
		this.TemplateClass = new Class({
			
			Extends: SubtleTemplate.Template,
			
			data: {}
			
		});
		
		this.TemplateClass.instance = this;
		this.TemplateClass.kids = this.kids;
		this.TemplateClass.options = this.options;
		this.TemplateClass.updateTemplate = this.updateTemplate.bind(this);
		
		return this.TemplateClass;
	},
	
	setElementOptions: function(element){
		if(!element) return this.fireEvent('error');
		element = $(element);
		
		this.parseSubTemplates(element);
		
		if(Browser.Engine.trident)element.getElements('*').each(function(el){
			// Edit this list to include 
			// all attribute names whose value you may set in your html templates
			// which you will then update to some value which contains a space
			// 'id class name value for title alt src rel cite'.split(' ')
			['abbr',  'above', 'accept', 'accesskey', 'action', 'align', 'alink', 'alt', 'archive', 'autostart', 'axis', 'background', 'balance', 'behavior', 'below', 'bgcolor', 'bgproperties', 'border', 'bordercolor', 'bordercolordark', 'bordercolorlight', 'bottommargin', 'cabbase', 'cellpadding', 'cellspacing', 'charset', 'checked', 'cite', 'class', 'classid', 'clear', 'clip', 'code', 'codebase', 'codetype', 'color', 'cols', 'colspan', 'compact', 'content', 'controls', 'coords', 'data', 'datapagesize', 'datetime', 'declare', 'defer', 'delay', 'dir', 'direction', 'disabled', 'dynsrc', 'enctype', 'face', 'for', 'frame', 'frameborder', 'framespacing', 'gutter', 'headers', 'height', 'hidden', 'href', 'hreflang', 'hspace', /*'http-equiv',*/ 'id', 'ismap', 'label', 'lang', 'language', 'left', 'leftmargin', 'link', 'longdesc', 'loop', 'lowsrc', 'marginheight', 'marginwidth', 'maxlength', 'mayscript', 'media', 'method', 'multiple', 'name', 'noexternaldata', 'noresize', 'noshade', 'nowrap', /*'onblur', 'onchange', 'onclick', 'ondblclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onresize', 'onselect', 'onsubmit', 'onunload',*/ 'pagex', 'pagey', 'pointsize', 'readonly', 'rel', 'rev', 'rightmargin', 'rows', 'rowspan', 'rules', 'runat', 'scope', 'scrollamount', 'scrolldelay', 'scrolling', 'selected', 'shape', 'size', 'span', 'src', 'standby', 'start', 'style', 'summary', 'tabindex', 'target', 'title', 'top', 'topmargin', 'truespeed', 'type', 'usemap', 'valign', 'value', 'valuetype', 'visibility', 'vlink', 'volume', 'vspace', 'width', 'wrap', 'xmlns']
			.each(function(property){try{
				var val = el.getProperty(property);
				if(val && $type(val)=='string')
					el.setProperty(property, el.getProperty(property) + ' HACKED_FOR_IE');
			}catch(e){};});
		});
		
		this.setOptions({
			parent: element.parentNode ? $(element.parentNode) : null,
			tag:    element.get('tag'),
			id:     element.get('id'),
			'class':element.get('class'),
			html:   element.get('html').replace(/ ?HACKED_FOR_IE/g,'')
		});
		
		element.dispose();
		element = null;
		
		return this;
	},
	
	subTemplates:{},
	parseSubTemplates: function(element){
		var subTemplateElements = element.getElements('.'+this.options.subTemplateClass);
		subTemplateElements.each(function(subTemplateElement){
			var key = subTemplateElement.removeClass(this.options.subTemplateClass).get('class');
			if (!key) return;
			new Element('span',{ 'class':this.options.subTemplateClass+'-'+key.camelCase() }).inject(subTemplateElement, 'before');
			this.subTemplates[key] = new SubtleTemplate(subTemplateElement);
		},this);
	},
	
	updateTemplate: function(fn){
		try{console.log( "updateTemplate", fn );}catch(e){};
		if($type(fn) != 'function') return this;
		var element = new Element(this.options.tag, { 'class': this.options['class'], html: this.options.html });
		
		this.setElementOptions(fn.run(this,element) || element);
		
		try{console.log( pp(this.kids) );}catch(e){};
		this.kids.each(function(kid){ if (kid.populate) kid.populate({}, this.options); },this);
		
		return this;
	}
	
});
SubtleTemplate.Template = new Class({
	
	Implements: Events,
	
	data:{},
	
	initialize: function(data, options){
		if($type(data)=='array' && /^(object|hash)$/.test($type(data[0]))){
			var instances = [];
			data.each(function(dataSet,index){
				instances[index] = new this.constructor(dataSet, options);
			}, this);
			return instances;
		}
		
		this.constructor.kids.push(this);
		
		if(options){
			this.element = options.element; delete options.element;
			this.constructor.instance.setOptions(options);
		}
		if(data) this.data = $merge(this.data, data);
		
		this.element = this.element || new Element(this.constructor.instance.options.tag);
		this.populate();
		
		return this.fireEvent("initialize");
	},
	
	populate: function(data, options){
		// try{console.log( data, options );}catch(e){};
		this.constructor.instance.setOptions(options);
		if(data) this.data = $merge(this.data, data);
		
		this.element.set({
			'html': this.constructor.instance.options.html.substitute(this.data),
			'class':(this.data.html_class||this.constructor.instance.options['class']||'').substitute(this.data),
			'id':   (this.data.html_id||'').substitute(this.data)
		});
		
		this.populateSubTemplates(this.data);
		
		return this.fireEvent("populate");
	},
	
	populateSubTemplates: function(data){
		var self = this;
		Hash.each(this.constructor.instance.subTemplates, function(subTemplate,key){
			
			try{console.log( self.constructor.instance.options.subTemplateClass+'-'+key.camelCase() );}catch(e){};
			var elementForKey = self.element.getElement('.'+ self.constructor.instance.options.subTemplateClass+'-'+key.camelCase() )
			
			if ($type(data[key])=='array') data[key].each(function(dataForKey){
				
				new subTemplate(dataForKey).element.inject(elementForKey, 'before');
				
			});
			
			elementForKey.dispose();
		});
	},
	
	toElement: function(){
		return this.element;
	},
	
	inject: function(parent){
		this.element.inject( parent || this.parent || this.constructor.instance.options.parent );
		return this.fireEvent("inject");
	}
	
});
