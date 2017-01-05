var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./models/user');
var AdminUser = new User();
module.exports = function(passport, connection) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    AdminUser.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        AdminUser.findOne({ 'username' :  username }, function(err, user) {
          if (err){
            return done(err);
          }
          if (user) {
            return done(null, false);//, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            var newUser            = new User();
            newUser.username    = username;
            newUser.name    = username;
            newUser.password = newUser.generateHash(password);

            AdminUser.save(newUser, function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
          }
        });
      });
    }
  ));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        AdminUser.findOne({ 'username' :  username }, function(err, user) {
          if (err){
            return done(err);
          }
          if (!user) {
            return done(null, false);//, req.flash('signupMessage', 'That email is already taken.'));
          } else if (user.password === 'admin'){
            console.log('inside password reset');
            var newUser            = new User();
            newUser.username    = username;
            newUser.name    = username;
            newUser.password = newUser.generateHash(password);

            AdminUser.save(newUser, function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
          } else if (!AdminUser.validPassword(user, password)){
            return done(null, false, 'Oops! Wrong password.'); // create the loginMessage and save it to session as flashdata
          } else{
            return done(null, user);
          }
        });
      });
    }
  ));
};