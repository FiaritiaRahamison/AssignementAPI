const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const subject = require('./routes/subject');
const user = require('./routes/user');
const assignment = require('./routes/assignments');
const cors = require('cors');
const { auth, setupPassport } = require('./utils/passport');


app.use(cors());

const mongoose = require('mongoose');
const { check } = require('./utils/jwt');
const ROLES = require('./utils/enums');
mongoose.Promise = global.Promise;

// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://fiaritianaliarilalarahamison:mdpprom13@projectassignment.6iht2ej.mongodb.net/assignmentsMEAN?retryWrites=true&w=majority&appName=projectAssignment';


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

//initialiser passport pour la gestion de token
setupPassport();

// Subject
app.route(prefix + '/subjects')
  .post(auth,check(ROLES.admin),subject.postSubject)
  .get(auth,check(ROLES.admin,ROLES.teacher),subject.getSubjects)
  .put(auth,check(ROLES.admin),subject.updateSubject);

app.route(prefix + '/subjects/:id')
  .get(auth,subject.getSubject)
  .delete(auth,check(ROLES.admin),subject.deleteSubject);


// User
app.route(prefix + '/users')
  .post(auth,check(ROLES.admin),user.postUser)
  .get(auth,check(ROLES.admin,ROLES.teacher),user.getUsers);

app.route(prefix + '/users/:id')
  .get(auth,user.getUser)
  .delete(auth,check(ROLES.admin),user.deteleUser)
  .put(auth,check(ROLES.admin),user.updateUser);

app.route(prefix + '/users/login')
  .post(user.loginUser);

app.route(prefix + '/teachers')
  .get(auth,check(ROLES.admin),user.getTeachers);

app.route(prefix + '/students')
  .get(auth,check(ROLES.admin,ROLES.teacher),user.getStudents);

// Assignments
app.route(prefix + '/assignments')
.post(auth,check(ROLES.teacher),assignment.postAssignment)
.get(auth,assignment.getAssignments);

app.route(prefix + '/assignments/done')
  .get(auth,check(ROLES.teacher,ROLES.student),assignment.getAssignmentsDone);

app.route(prefix + '/assignments/toDo')
  .get(auth,check(ROLES.student),assignment.getAssignmentsToDo);

app.route(prefix + '/assignments/marked')
  .get(auth,check(ROLES.student,ROLES.teacher),assignment.getAssignmentsMarked);

app.route(prefix + '/assignments/average')
  .get(auth,check(ROLES.student, ROLES.teacher),assignment.getAverageMarkBySubject);

app.route(prefix + '/assignments/result/:id')
  .post(auth,check(ROLES.teacher),assignment.addNote)
  .get(auth,assignment.getAssignmentResult);

app.route(prefix + '/assignment/:id')
  .post(auth,check(ROLES.student),assignment.addResult)
  .get(auth,assignment.getAssignment)
  .put(auth,check(ROLES.teacher),assignment.updateAssignment)
  .delete(auth,check(ROLES.teacher, ROLES.admin),assignment.deleteAssignment);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


