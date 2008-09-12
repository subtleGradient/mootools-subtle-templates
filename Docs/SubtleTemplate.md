Class: SubtleTemplate {#SubtleTemplate}
===============================

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Notes:

- SubtleTemplate requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Implements:

[Options][]
[Events][]

### Syntax:

	var myThing = new SubtleTemplate([options]);

### Arguments:

1. options  - (*object*, optional) All the [Events][] options in addition to options below.

#### Options:

* option1 - (*integer*: defaults to 0     ) lorem ipsum.
* option2 - (*integer*: defaults to 0     ) lorem ipsum.
* option3 - (*boolean*: defaults to true  ) If set to true,  lorem ipsum.
* option4 - (*boolean*: defaults to false ) If set to true,  lorem ipsum.
* option5 - (*boolean*: defaults to true  ) If set to true,  lorem ipsum.
* option6 - (*boolean*: defaults to false ) If set to false, lorem ipsum.
* option7 - (*boolean*: defaults to false ) If set to true,  lorem ipsum.
* option8 - (*boolean*: defaults to false ) If set to true,  lorem ipsum.
* option9 - (*boolean*: defaults to false ) If set to true,  lorem ipsum.

### Returns:

* (*object*) A new SubtleTemplate instance.

## Events:

### eventName

* (*function*) Function to do stuff.

#### Signature:

	onEventName(arg1, arg2)

#### Arguments:

1. arg1 - (*object*) Lorem ipsum.
2. arg2 - (*object*) Lorem ipsum.

### Examples:

	var myThing = new SubtleTemplate({
		optionl: 1,
		option8: true
	});

### Demos:

- SubtleTemplate - <http://demos.mootools.net/SubtleTemplate>
