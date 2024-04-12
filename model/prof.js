let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
let User = require('./user');

let ProfSchema = Schema({
    user: new User(),
    nom: String,
    photo: String
});

ProfSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('prof', ProfSchema);