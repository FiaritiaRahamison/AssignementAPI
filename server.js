let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let subject = require('./routes/subject');
let user = require('./routes/user');
let assignment = require('./routes/assignments');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://projetAngular:1234567891@cluster0.xycinrx.mongodb.net/assignments?retryWrites=true&w=majority&appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

// Subject
app.route(prefix + '/subjects')
  .post(subject.postSubject)
  .get(subject.getSubjects)
  .put(subject.updateSubject);

app.route(prefix + '/subjects/:id')
  .get(subject.getSubject)
  .delete(subject.deleteSubject);


// User
app.route(prefix + '/users')
  .post(user.postUser)
  .get(user.getUsers)
  .put(user.updateUser);

app.route(prefix + '/users/:id')
  .get(user.getUser)
  .delete(user.deteleUser);

// Assignments
app.route(prefix + '/assignments')
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment)
  .get(assignment.getAssignments);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


