let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
let User = require('./user');

let EleveSchema = Schema({
    user: new User(),
    nom: String,
    photo: String
});

EleveSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('eleve', EleveSchema);
