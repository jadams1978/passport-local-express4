const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaugeSchema = new Schema({
	leaguename:String,
	teames:Array
 
});



//const Team = mongoose.model('League', LeaugeSchema);

module.exports = mongoose.model('leagues', LeaugeSchema);
