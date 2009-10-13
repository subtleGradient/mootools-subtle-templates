/**
 *  Manages multiple instances of SubtleTemplate so that a single data object can render to numerous locations.
 *  When the data is updated, each DOM element is re-rendered.
 */

SubtleTemplate.Manager = new Class({
	Implements: [Options, Events],
	options: {
		//build: $empty(template, element, instance),
		//destroy: $empty,
		templates: {/*
			name: instanceOfSubtleTemplate,
			name2: instanceOfSubtleTemplate2,
			etc.
		*/},
		//what this manager is stored as on the DOM elements it creates
		storedAs: 'SubtleTemplate.Manager',
		//a method used to parse the data
		parser: $lambda
	},

	/**
	 *  passed the data for this instance and options (defined above)
	 */

	initialize: function(data, options) {
		this._handleData(data);
		this.setOptions(options);
		this.addTemplates(this.options.templates);
	},

	templates: {},
	rendered: {},
	data: {},


	/**
	 *  adds an instance of subtleTemplate to the manager
	 *  name - (string) the name of the template
	 *  subtleTemplate - (object) instance of SubtleTempalte
	 */
	addTemplate: function(name, subtleTemplate) {
		return this.templates[name] = subtleTemplate;
	},


	/**
	 *  adds numerous templates from an object of key/values that are name/subtleTempalte
	 */

	addTemplates: function(templates) {
		$each(templates || this.options.templates, function(element, name){
			this.addTemplate(name, element);
		}, this);
		return this.templates;
	},


	/**
	 *  handles data being added; stores it as a hash and calls _parseData
	 *  data - (object) the raw data to be injected into templates
	 * 
	 */

	_handleData: function(data) {
		this.rawdata = $merge(this.rawdata, data);
		this.data = $H($unlink(this.rawdata));
		this.options.parser.call(this, this.data);
	},

	/**
	 *  updates all the rendered DOM elements with new data
	 *  data - (object) the new data for the instance; can be partial or complete
	 */

	update: function(data){
		this._handleData(data);
		//for each template
		$each(this.rendered, function(rendered, template){
			//get the rendered pointer to a SubtleTemplate instance
			rendered.each(function(subtmpl) {
				//populate the DOM element; preserve it's class property
				subtmpl.populate(this.data.getClean(), {'class': $(subtmpl).get('class')});
				this.fireEvent('build', [template, $(subtmpl), this]);
			}, this);
		}, this);
		return this;
	},

	/**
	 * builds a specific subtle template into a DOM element, always returning a new instance of SubtleTemplate
	 * template - (string) the name of the registered SubtleTemplate to instantiate
	 */

	build: function(template) {
		var prev = this.rendered[template];
		//get the template
		var tmpl = this.templates[template];
		//if no template, or this instance has been destroyed; return
		if (!tmpl || this.destroyed) return null;
		//if there aren't any previous renditions for this template; we're making the first, so make an array for them
		if (!this.rendered[template]) this.rendered[template] = [];
		//remove any instances whose elements have been destroyed
		else this.rendered[template] = this.rendered[template].filter(function(rend){ return $(rend); });

		//create a new instance of SubtleTemplate
		var rendered = new tmpl(this.data.getClean());
		this.rendered[template].push(rendered);
		var element = $(rendered);
		//store a pointer to it
		if (this.options.storedAs) element.store(this.options.storedAs, this);
		this.fireEvent('build', [template, element, this]);
		return rendered;
	},

	/**
	 * destroys all the rendered elements and disables this instance
	 */

	destroy: function(){
		//loop through all the templates and destroy their DOM elements
		$each(this.rendered, function(rendered, template){
			rendered.each(function(subtmpl) {
				$(subtmpl).destroy();
			});
		});
		//remove all pointers to the pre-existing templates
		this.rendered = {};
		//mark this instance as dead
		this.destroyed = true;
		return this.fireEvent('destroy');
	}

});