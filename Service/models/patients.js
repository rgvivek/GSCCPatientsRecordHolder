var connection = require('../connection');
function Patients() {
  this.getAll = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from patients', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.get = function(id, res) {
    connection.acquire(function(err, con) {
      con.query('select * from patients where id = ?', [id], function(err, result) {
        con.release();
        res.send(result[0]);
      });
    });
  };

  this.create = function(patient, res) {
    connection.acquire(function(err, con) {
      con.query('insert into patients set ?', patient, function(err, result) {
        console.log('jon' + JSON.stringify(result));
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO creation failed'});
        } else {
          res.send({status: 0, message: 'TODO created successfully'});
        }
      });
    });
  };

  this.update = function(patient, res) {
    connection.acquire(function(err, con) {
      con.query('update patients set ? where id = ?', [patient, patient.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'TODO update failed'});
        } else {
          res.send({status: 0, message: 'TODO updated successfully'});
        }
      });
    });
  };

  this.delete = function(id, res) {
    connection.acquire(function(err, con) {
      con.query('delete from patients where id = ?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete'});
        } else {
          res.send({status: 0, message: 'Deleted successfully'});
        }
      });
    });
  };
}

module.exports = new Patients();
