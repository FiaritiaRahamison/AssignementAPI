let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let MatiereSchema = Schema({
    nom: String,
    image: String
});

MatiereSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('matiere', MatiereSchema);