/*
Script: SubtleTemplate.js
	MooTools - My Object Oriented JavaScript Tools.

License:
	MIT-style license.

Copyright:
	Copyright (c) 2006-2007 [Thomas Aylott](subtlegradient.com).

*/
var SubtleTemplate = new Class({
	
	Implements: Options,
	
	options:{
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
			tag:    element.get('tag'),
			id:     element.get('id'),
			'class':element.get('class'),
			html:   element.get('html').replace(/ ?HACKED_FOR_IE/g,'')
		});
		element.getParent() && this.setOptions({
			parent: element.getParent()
		});
		
		element.dispose();
		element = null;
		
		return this;
	},
	
	updateTemplate: function(fn){
		if($type(fn) != 'function') return this;
		var element = new Element(this.options.tag, { 'class': this.options['class'], html: this.options.html });
		
		this.setElementOptions(fn.run(this,element) || element);
		
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
		var tag = this.element.get('tag');
		//table items must be in a table for .set('html') to work properly
		var container, match = tag.match(/^(t[dhr]|tbody|tfoot|thead)$/i));
		
		if (match){
			container = new Element('table');
			var tag = match[1];
			if (tag == 'td' || tag == 'th' || tag == 'tr'){
				container = new Element('tbody').inject(container);
				if (tag != 'tr') container = new Element('tr').inject(container);
			}
			container.adopt(this.element);
		}
		
		this.populate();
		
		return this.fireEvent("initialize");
	},
	
	populate: function(data, options){
		this.constructor.instance.setOptions(options);
		if(data) this.data = $merge(this.data, data);
		
		this.element.set({
			'html': this.constructor.instance.options.html.substitute(this.data),
			'class':(this.data.html_class||this.constructor.instance.options['class']||'').substitute(this.data),
			'id':   (this.data.html_id||'').substitute(this.data)
		});
		return this.fireEvent("populate");
	},
	
	toElement: function(){
		return this.element;
	},
	
	inject: function(parent){
		this.element.inject( parent || this.parentNode || this.constructor.instance.options.parent );
		return this.fireEvent("inject");
	}
	
});


// SubtleTemplate
// SubtleTemplate.Template
// SubtleTemplate.Template.Subclass
// 
// template: SubtleTemplate instance
// rows: SubtleTemplate.Template.Subclass instance

// Row = new SubtleTemplate();
// row1 = new Row();

// row1.template.TemplateClass == Row

