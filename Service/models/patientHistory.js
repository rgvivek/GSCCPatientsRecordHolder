var connection = require('../connection');
function PatientHistory() {
  this.getAll = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from patienthistory', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.get = function(id, res) {
    connection.acquire(function(err, con) {
      con.query('select * from patienthistory ph left outer join patientgynaecologicalhistory pgh on (ph.id=pgh.patienthistoryid)  where patientid = ?', [id], function(err, result) {
        con.release();
        if(result.length>0){
          res.send(result[0]);
        }else{
          res.send({patientid:id});
        }
      });
    });
  };

  this.create = function(patientHistory, res) {
    connection.acquire(function(err, con) {
      con.query('insert into patienthistory set ?', patientHistory, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'Patient history creation failed'});
        } else {
          
          res.send({status: 2, message: 'Patient history created successfully', id : result.insertId});
        }
      });
    });
  };

  this.update = function(patientHistory, res) {
    connection.acquire(function(err, con) {
      con.query('update patienthistory set ? where patientid = ?', [patientHistory, patientHistory.patientid], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Patient history update failed'});
        } else {
          res.send({status: 2, message: 'Patient history updated successfully', id : patientHistory.id});
        }
      });
    });
  };

  this.updateFemale = function(patientHistory, res) {
    connection.acquire(function(err, con) {
      con.query('update patientgynaecologicalhistory set ? where patienthistoryid = ?', [patientHistory, patientHistory.patienthistoryid], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Patient history update failed'});
        } else {
          res.send({status: 2, message: 'Patient history updated successfully', id : patientHistory.id});
        }
      });
    });
  };

  this.delete = function(patientid, res) {
    connection.acquire(function(err, con) {
      con.query('delete from patienthistory where patientid = ?', [patientid], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete'});
        } else {
          res.send({status: 2, message: 'Deleted successfully'});
        }
      });
    });
  };
}

module.exports = new PatientHistory();
