module.exports = {
	getTime: function() {
	  return new Date().getTime() / 1000;
	},

	getTimeRound: function() {
	  return Math.round(module.exports.getTime());
	}
}