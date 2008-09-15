/*
Script: Selectors.Children.js
	Specification Examples of Pseudo Selector :children.

License:
	MIT-style license.
*/

describe('SubtleTemplate', {

	'before all': function(){
		new Element('div', {id:'subtletemplate_demo'}).inject(document.body);
		
		template = new Element('div',{
			id:'subtletemplate',
			html:'<ul>\
					<li><b>{data1}</b></li>\
					<li><i>{data2}</i></li>\
					<li><u>{data3}</u></li>\
				</ul>'
		}).inject($('subtletemplate_demo'));
		
		new Element('div',{
			id:'mydiv_with_attributes',
			html:'<ul>\
					<li><input type="text" value="{data1}" /></li>\
					<li><input type="text" value="{data2}" /></li>\
					<li><input type="text" value="{data3}" /></li>\
				</ul>'
		}).inject($('subtletemplate_demo'));
		
		MyDiv_with_attributes = new SubtleTemplate($('mydiv_with_attributes'));
		
		demo = $('subtletemplate_demo');
		MyDiv = new SubtleTemplate(template);
	}

	,'after all': function(){
		template.destroy();
		demo.destroy();
		MyDiv_with_attributes=
		demo=
		MyDiv=
		null;
	}
	
	,after: function(){
		demo.empty();
	}
	
	,'should be created and injected and match the data': function(){
		var fred = new MyDiv({ data1:'fred' }).inject( demo );
		value_of( fred.element.get('text') ).should_match( 'fred' );
	}
	
	,'should allow updating the data later': function(){
		var fred = new MyDiv({ data1:'fred' }).inject( demo );
		value_of( fred.element.get('text') ).should_match( 'fred' );
		
		fred.populate({ data1:'updated' });
		value_of( fred.element.get('text') ).should_match( 'updated' );
	}
	
	,'should not break when you have spaces in your values': function(){
		// This is really to check for IE goofing up your html since it'll unquote attribute values in its view of the HTML, EG:
		//     <div class="something"> howdy </div>
		// In IE becomes:
		//     <DIV class=something> howdy </DIV>
		// Then, setting the class to "something else altogether" would result in this:
		//     <DIV class=something else=altogether> howdy </DIV>
		
		var fred = new MyDiv_with_attributes({ data1:'fred is my name' }).inject( demo );
		value_of( fred.element.getElement('input').get('value') ).should_be( 'fred is my name' );
		
		fred.populate({ data1:'derf is not my name' });
		value_of( fred.element.getElement('input').get('value') ).should_match( 'derf is not my name' );
	}

	,'should allow you to update the html of the template and rebuild everything': function(){
		
		var fred = new MyDiv({ data1:'fred' }).inject( demo );
		value_of( fred.element.get('text') ).should_match( 'fred' );
		
		var fred1 = new MyDiv({ data1:'fred1' }).inject( demo );
		value_of( fred1.element.get('text') ).should_match( 'fred1' );
		
		MyDiv.updateTemplate(function(templateClassInstance){
			this.getElement('li').set('html','{data1}{data1}');
		});
		value_of( fred.element.get('text') ).should_match( 'fredfred' );
		value_of( fred1.element.get('text') ).should_match( 'fred1fred1' );
		
	}

	,'should allow you to update the html to any random tag, even a new one': function(){
		
		var fred = new MyDiv({ data1:'fred' }).inject( demo );
		value_of( fred.element.get('text') ).should_match( 'fred' );
		value_of( fred.element.getElement('*').get('tag') ).should_be( 'ul' );
		
		var fred1 = new MyDiv({ data1:'fred1' }).inject( demo );
		value_of( fred1.element.get('text') ).should_match( 'fred1' );
		value_of( fred1.element.getElement('*').get('tag') ).should_be( 'ul' );
		
		MyDiv.updateTemplate(function(templateClassInstance){
			return new Element('div',{html:'{data1}{data1}'})
		});
		value_of( fred.element.getElement('*') ).should_be( null );
		value_of( fred.element.get('text') ).should_match( 'fredfred' );
		
		value_of( fred.element.getElement('*') ).should_be( null );
		value_of( fred1.element.get('text') ).should_match( 'fred1fred1' );
		
	}

});
