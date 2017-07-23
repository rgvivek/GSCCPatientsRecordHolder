var patients = require('./models/patients');
var patientHistory = require('./models/patientHistory');
var tests = require('./models/tests');
var medicines = require('./models/medicines');
var appointments = require('./models/appointments');
var User = require('./models/user');
var jwt    = require('jsonwebtoken');

module.exports = {
  configure: function(app, passport) {
    
    app.post('/authenticate', isLoggedIn, function(req, res, next) {
      var userId = req.decoded.id;
      console.log("userid" + req.decoded.id);
      var adminUser = new User();
      adminUser.findById( userId, function(err, user) {
        console.log("userid" + JSON.stringify(user));
        if (err || !user){
          res.send({status: 4, message: 'Session timeout. Re-login'});
        }else{
          res.send({status: 5, message: 'User session valid', user : user});
        } 
      });
    });

    app.post('/signUp', isLoggedIn, function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
      var username = req.body.username;
      var password = req.body.password;
      var adminUser = new User();
      adminUser.findOne({ 'username' :  username }, function(err, user) {
          if (err){
            res.send({status: 1, message: err}); 
          }
          if (user) {
            res.send({status: 3, message: 'Username already taken. Please try with another username.'}); 
          } else {
            var newUser            = new User();
            newUser.username    = username;
            newUser.firstname    = req.body.firstname;
            newUser.lastname    = req.body.lastname;
            newUser.isadmin    = req.body.isadmin;
            newUser.password = newUser.generateHash(password);

            adminUser.save(newUser, function(err) {
                if (err){
                  res.send({status: 1, message: err}); 
                }
                res.send({status: 6, message: 'signup successful'});
            });
          }
        });
    });

    app.post('/login', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
      passport.authenticate('local-login', function(err, user, info) {
        if (err) { 
          res.send({status: 1, message: err}); 
        }
        if (user) { 
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn : 1440 // expires in 24 hours
          });
          res.send({status: 0, message: 'Login Successful', token: token, user : user}); 
        }else{
          res.send({status: 3, message: 'Login Failed. Please verify the Username/Password'});
        }
      })(req, res, next);
    });
    
    app.get('/patients/', isLoggedIn, function(req, res, next) {
      patients.getAll(res);
    });

    app.get('/patients/:id/', isLoggedIn, function(req, res, next) {
      patients.get(req.params.id, res);
    });

    app.post('/patients/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        patients.update(req.body, res);
      }else{
        patients.create(req.body, res);
      }
    });

    app.put('/patients/', isLoggedIn, function(req, res, next) {
      patients.update(req.body, res);
    });

    app.delete('/patients/:id/', isLoggedIn, function(req, res, next) {
      patients.delete(req.params.id, res);
    });

    app.get('/patientHistory/:id/', isLoggedIn, function(req, res, next) {
      patientHistory.get(req.params.id, res);
    });

    app.post('/patientHistory/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        patientHistory.update(req.body, res);
      }else{
        patientHistory.create(req.body, res);
      }
    });

    app.post('/femalePatientHistory/', isLoggedIn, function(req, res, next) {
      patientHistory.updateFemale(req.body, res);
    });

    app.get('/testCategories/', isLoggedIn, function(req, res, next) {
      tests.getAllTestCategories(res);
    });

    app.get('/investigationCategories/', isLoggedIn, function(req, res, next) {
      tests.getAllInvestigationCategories(res);
    });

    app.get('/tests/', isLoggedIn, function(req, res, next) {
      tests.getAllTests(res);
    });

    app.post('/testCategories/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        tests.updateTestCategory(req.body, res);
      }else{
        tests.createTestCategory(req.body, res);
      }
    });

    app.post('/investigationCategories/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        tests.updateInvestigationCategory(req.body, res);
      }else{
        tests.createInvestigationCategory(req.body, res);
      }
    });

    app.post('/tests/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        tests.updateTest(req.body, res);
      }else{
        tests.createTest(req.body, res);
      }
    });

    app.get('/testReports/:id/', isLoggedIn, function(req, res, next) {
      tests.getAllTestResults(req.params.id, res);
    });

    app.post('/testReports/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        tests.updateTestResult(req.body, res);
      }else{
        tests.addTestResult(req.body, res);
      }
    });

    app.delete('/testReports/:id/', isLoggedIn, function(req, res, next) {
      tests.deleteTestResult(req.params.id, res);
    });

    app.get('/medicines/', isLoggedIn, function(req, res, next) {
      medicines.getAllMedicines( res);
    });

    app.post('/medicines/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        medicines.updateMedicine(req.body, res);
      }else{
        medicines.createMedicine(req.body, res);
      }
    });

    app.delete('/medicines/:id/', isLoggedIn, function(req, res, next) {
      medicines.deleteMedicine(req.params.id, res);
    });

    app.get('/medicinePurchase/', isLoggedIn, function(req, res, next) {
      medicines.getAllMedicinesPurchases(req.params.startDate, req.params.endDate, res);
    });

    app.post('/medicinePurchase/', isLoggedIn, function(req, res, next) {
      medicines.addMedicinePurchase(req.body, res);
    });

    app.get('/visits/:patientid/', isLoggedIn, function(req, res, next) {
      appointments.getAllVisits(req.params.patientid, res);
    });

    app.post('/visits/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        appointments.updateAppointment(req.body, res);
      }else{
        appointments.createAppointment(req.body, res);
      }
    });

    app.get('/doctors/', isLoggedIn, function(req, res, next) {
      appointments.getAllDoctors(res);
    });

    app.post('/doctors/', isLoggedIn, function(req, res, next) {
      if(req.body.id){
        appointments.updateDoctor(req.body, res);
      }else{
        appointments.createDoctor(req.body, res);
      }
    });

    app.get('/diagnosis/:patientid/', isLoggedIn, function(req, res, next) {
      appointments.getAllDiagnosis(req.params.patientid, res);
    });

    app.post('/diagnosis/', isLoggedIn, function(req, res, next) {
      appointments.saveDiagnosis(req.body, res);
    });

    app.get('/prescription/:patientid/', isLoggedIn, function(req, res, next) {
      appointments.getAllPrescription(req.params.patientid, res);
    });

    app.post('/prescription/', isLoggedIn, function(req, res, next) {
      appointments.savePrescription(req.body, res);
    });

    app.get('/medications/:patientid/', isLoggedIn, function(req, res, next) {
      appointments.getAllMedications(req.params.patientid, res);
    });

    app.get('/medications/:patientId/:appointmentId', isLoggedIn, function(req, res, next) {
      appointments.getAllMedicationsByAppointmentId(req.params.patientId, req.params.appointmentId, res);
    });

    app.post('/medications/', isLoggedIn, function(req, res, next) {
      appointments.saveMedicineCombination(req.body, res);
    });

    app.delete('/medications/:id/', isLoggedIn, function(req, res, next) {
      appointments.deleteMedicineCombination(req.params.id, res);
    });

    function isLoggedIn(req, res, next) {
      var token = req.headers['x-access-token'];
      console.log("new user is " + JSON.stringify(req.body));
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
          console.log('error' + err);
          if (err) {
            res.send({status: 4, message: 'Session timeout. Re-login'}); 
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;    
            next();
          }
        });

      }else{
        console.log('error d');
        res.send({status: 4, message: 'Session timeout. Re-login'});
      }
    }
  }
};
