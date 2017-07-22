var connection = require('../connection');
function Appointments() {
  
  this.getAllDoctors = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from doctors',function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllVisits = function(patientId, res) {
    connection.acquire(function(err, con) {
      con.query('select a.*, d.name as doctorname from appointments a inner join doctors d on a.doctorid = d.id where patientid = ? order by id',patientId, function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllDiagnosis = function(patientId, res) {
    connection.acquire(function(err, con) {
      con.query('select a.*, d.name as doctorname from diagnosis a inner join doctors d on a.doctorid = d.id where patientid = ? order by id',patientId, function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllAppointments = function(startDate, endDate, res) {
    connection.acquire(function(err, con) {
      con.query('select * from appointments where dateofappointment between ? and ?',[startDate, endDate], function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllMedications = function(patientId, res) {
    connection.acquire(function(err, con) {
      con.query('select * from medicine_combinations_issued mci'+
        ' inner join appointments a on a.id = mci.appointmentid inner join '+
        'patients p on p.id=a.patientid where p.id = ?',patientId, function(err, medicineCombinations) {
        medicineCombinations.forEach(function(medicineCombination){
          con.query('select * from medicines_issued where combinationid = ?',medicineCombination.id, function(err1, medicines) {
            con.release();
            medicineCombination.medicines = medicines
          });
        });
        res.send(medicineCombinations);
      });
    });
  };

  this.createDoctor = function(doctor, res) {
    connection.acquire(function(err, con) {
      con.query('insert into doctors set ?', doctor, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'doctor creation failed'});
        } else {
          res.send({status: 2, message: 'doctor created successfully', appointmentId : result.insertId});
        }
      });
    });
  };

  this.updateDoctor = function(doctor, res) {
    connection.acquire(function(err, con) {
      con.query('update doctors set ? where id = ?', [doctor, doctor.id], function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'doctor updation failed'});
        } else {
          res.send({status: 2, message: 'doctor updated successfully', appointmentId : result.insertId});
        }
      });
    });
  };

  this.createAppointment = function(doctor, res) {
    connection.acquire(function(err, con) {
      con.query('insert into appointments set ?', doctor, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'doctor creation failed'});
        } else {
          res.send({status: 2, message: 'doctor created successfully', doctorId : result.insertId});
        }
      });
    });
  };

  this.updateAppointment = function(appointment, res) {
    connection.acquire(function(err, con) {
      con.query('update appointments set ? where id = ?', [appointment, appointment.id], function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'appointment updation failed'});
        } else {
          res.send({status: 2, message: 'appointment updated successfully', appointmentId : result.insertId});
        }
      });
    });
  };

  this.saveDiagnosis = function(diagnosis, res) {
    connection.acquire(function(err, con) {
      con.query('insert into diagnosis set ?', diagnosis, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'diagnosis creation failed'});
        } else {
          res.send({status: 2, message: 'diagnosis created successfully', diagnosisId : result.insertId});
        }
      });
    });
  };

  this.saveMedicineCombination = function(medicineCombination, res) {
    connection.acquire(function(err, con) {
      con.beginTransaction(function(err, con) {
        var transactionSuccessful = true;
        if(medicineCombination.id){
          con.query('insert into medicine_combinations_issued set ?', medicineCombination.combination, function(err, result) {
            if (err) {
              this.createMedicineCombinationFailed(con, err, res);
              transactionSuccessful = false;
            } else {
              medicineCombination.id = result.insertId;
            }
          });
        }else{
          con.query('update medicine_combinations_issued set ? where id = ?', [medicineCombination.combination, medicineCombination.id], function(err, result) {
            if (err) {
              this.createMedicineCombinationFailed(con, err, res);
              transactionSuccessful = false;
            }else{
              con.query('delete from medicines_issued where combinationid = ?', medicineCombination.id, function(err, result) {
                if (err1) {
                  this.createMedicineCombinationFailed(con, err1, res);
                  transactionSuccessful = false;
                }
              });
            }
          });
        }
        if(transactionSuccessful){
          if(this.insertMedicine(medicineCombination, con, res)){
            con.commit(function(err1) {
              if (err1) { 
                this.createMedicineCombinationFailed(con, err1, res);
              }else{
                con.release();
                res.send({status: 2, message: 'Medicine combination saved successfully', medicineCombinationId : medicineCombination.id});
              }
            });
          }
        }
      });
    });
  };

  this.createMedicineCombinationFailed = function(con, err, res){
    con.rollback(function() {});
    con.release();
    res.send({status: 1, message: 'Medicine combination save failed'});
  }

  this.insertMedicine = function(medicineCombination, con, res){
    var medicinesListUpdated = true;
    if(Array.isArray(medicineCombination.medicines)){
      medicineCombination.medicines.forEach(function(medicineIssued){
        medicineIssued.combinationid = medicineCombination.id;
        con.query('insert into medicines_issued set ?', medicineIssued, function(err, result) {
          if (err) {
            this.createMedicineCombinationFailed(con, err, res);
            medicinesListUpdated = false;
          } 
        });
      });
    }
    return medicinesListUpdated;
  }

}

module.exports = new Appointments();
