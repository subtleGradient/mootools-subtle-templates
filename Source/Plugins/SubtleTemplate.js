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
		id:      '',
		'class': '',
		html:    '{html}',
		data:    {}
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
		
		this.template = new Class({ Extends:SubtleTemplate.Template, options:this.options });
		
		this.template.kids = this.kids;
		this.template.updateTemplate = this.updateTemplate.bind(this);
		
		return this.template;
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
	
	updateTemplate: function(fn){
		if($type(fn) != 'function') return this;
		var element = new Element(this.options.tag, { 'class': this.options['class'], html: this.options.html });
		
		this.setElementOptions(fn.run(this,element) || element);
		
		this.kids.each(function(kid){ kid.populate({}, this.options); },this);
		
		return this;
	}
	
});
SubtleTemplate.Template = new Class({
	
	Implements: [Options, Events],
	
	initialize: function(data, options){
		this.constructor.kids.push(this);
		if(options) this.setOptions(options);
		if(data)    this.setOptions({ data:data });
		
		this.element = new Element(this.options.tag);
		this.populate();
		
		return this.fireEvent("initialize");
	},
	
	populate: function(data, options){
		if(options) this.setOptions(options);
		if(data)    this.setOptions({ data:data });
		
		this.element.set({
			'html': this.options.html.substitute(this.options.data),
			'class':(this.options.data.html_class||this.options['class']||'').substitute(this.options.data),
			'id':   (this.options.data.html_id||'').substitute(this.options.data)
		});
		
		return this.fireEvent("populate");
	},
	
	inject: function(parent){
		this.element.inject( parent||this.options.parent );
		return this.fireEvent("inject");
	}
	
});
