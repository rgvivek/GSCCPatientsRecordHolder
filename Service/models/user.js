var bcrypt   = require('bcrypt-nodejs');
var connection = require('../connection');
module.exports = function User(){
	this.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	this.validPassword = function(user, password) {
	    return bcrypt.compareSync(password, user.password);
	};
	this.findById = function(id, callBack) {
	    connection.acquire(function(err, con) {
	      con.query('select * from users where id = ?', [id], function(err, result) {
	        con.release();
	        callBack(err, result[0]);
	      });
	    });
	};
	this.findOne = function(user, callBack) {
		connection.acquire(function(err, con) {
	      con.query('select * from users where username = ?', [user.username], function(err, result) {
	        con.release();
	        callBack(err, result[0]);
	      });
	    });
	};
	this.save = function(newUser, callBack){
		connection.acquire(function(err, con) {
			con.query('insert into users set ?', newUser, function(err, result) {
	        	con.release();
	        	if (err) {
	        		callBack({status: 1, message: 'Error signing up'});
	        	}else{
	        		newUser.id = result.insertId;
	        		callBack();
	        	}
	        	//}
	      });
		});
	}
}
// create the model for users and expose it to our app
//module.exports = new User();//mongoose.model('User', userSchema);