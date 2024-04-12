let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
let Eleve = require('./eleve');
let Matiere = require('./matiere');

let AssignmentSchema = Schema({
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    note: Number,
    remarques: String,
    auteur: new Eleve(),
    matiere: new Matiere()
});

AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignment', AssignmentSchema);
