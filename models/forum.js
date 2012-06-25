var Backbone = require("backbone");

exports.Post = Backbone.Model.extend({
	defaults: {
		user: "userid",
		message: "default message",
		timestamp: "insert time",
	}
});