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
      con.query('select a.*, d.name as doctorname from appointments a inner join doctors d on a.doctorid = d.id where patientid = ? order by id desc',patientId, function(err, result) {
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
      con.query('select mci.* from medicine_combinations_issued mci'+
        ' inner join appointments a on a.id = mci.appointmentid inner join '+
        'patients p on p.id=a.patientid where p.id = ?',patientId, function(err, medicineCombinations) {
          if(Array.isArray(medicineCombinations) && medicineCombinations.length > 0){
            var count = 0;
            medicineCombinations.forEach(function(medicineCombination){
              console.log("combination id on fetch : " + medicineCombination.id);
              con.query('select * from medicines_issued where combinationid = ?',medicineCombination.id, function(err1, medicines) {
                medicineCombination.medicines = medicines;
                count++;
                if(count >= medicineCombinations.length){
                  con.release();
                  res.send(medicineCombinations);
                }
              });
            });
          }else{
            con.release();
            res.send(medicineCombinations);
          }
      });
    });
  };

  this.getAllMedicationsByAppointmentId = function(patientId, appointmentId, res) {
    connection.acquire(function(err, con) {
      con.query('select mci.* from medicine_combinations_issued mci'+
        ' inner join appointments a on a.id = mci.appointmentid inner join '+
        'patients p on p.id=a.patientid where p.id = ? and a.id = ?',[patientId, appointmentId], function(err, medicineCombinations) {
          if(Array.isArray(medicineCombinations) && medicineCombinations.length > 0){
            var count = 0;
            for(var i=0; i< medicineCombinations.length; i++){
              var medicineCombination = medicineCombinations[i];
              console.log("combination id on fetch : " + medicineCombination.id);
              con.query('select * from medicines_issued where combinationid = ?',medicineCombination.id, function(err1, medicines) {
                if(Array.isArray(medicines) && medicines.length > 0){
                  setMedicines(medicineCombinations, medicines)
                }
                count++;
                if(count >= medicineCombinations.length){
                  con.release();
                  console.log("combination final : " + medicineCombinations);
                  res.send(medicineCombinations);
                }
              });
            };
          }
      });
    });
  };

  setMedicines = function(medicineCombinations, medicines){
    for(var i=0; i< medicineCombinations.length; i++){
        if(medicines[0].combinationid == medicineCombinations[i].id){
          medicineCombinations[i].medicines = medicines;
          break;
        }
    };
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

  this.createAppointment = function(appointment, res) {
    connection.acquire(function(err, con) {
      con.query('insert into appointments set ?', appointment, function(err, result) {
        if (err) {
          console.log("Error :" + JSON.stringify(err));
          con.release();
          res.send({status: 1, message: 'Appointment creation failed'});
        } else {
          con.query('update appointments set isactive = false where patientid = ? and id <> ?', [appointment.patientid, result.insertId], function(err1, result1) {
            con.release();
            if (err) {
              console.log("Error :" + JSON.stringify(err))
              res.send({status: 1, message: 'Appointment creation failed'});
            } else {
              res.send({status: 2, message: 'Appointment created successfully', appointmentId : result.insertId});
            }
          });
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
          res.send({status: 1, message: 'Appointment updation failed'});
        } else {
          res.send({status: 2, message: 'Appointment updated successfully', appointmentId : result.insertId});
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
      con.beginTransaction(function(err) {
        var combination = getCombination(medicineCombination);
        if(!medicineCombination.id){
          con.query('insert into medicine_combinations_issued set ?', combination, function(err, result) {
            if (err) {
              createMedicineCombinationFailed(con, err, res);
            } else {
              insertMedicine(medicineCombination.medicines, result.insertId, con, res);
              console.log("combinationid :" + medicineCombination.id);
              console.log("combinationid :" + JSON.stringify(result));
            }
          });
        }else{
          con.query('update medicine_combinations_issued set ? where id = ?', [combination, combination.id], function(err, result) {
            if (err) {
              createMedicineCombinationFailed(con, err, res);
            }else{
              con.query('delete from medicines_issued where combinationid = ?', combination.id, function(err1, result) {
                if (err1) {
                  createMedicineCombinationFailed(con, err1, res);
                }else{
                  insertMedicine(medicineCombination.medicines, combination.id, con, res);
                }
              });
            }
          });
        }
      });
    });
  };

  this.deleteMedicineCombination = function(medicineCombinationId, res) {
    connection.acquire(function(err, con) {
        con.query('delete mci, mi from medicine_combinations_issued mci inner join medicines_issued mi on mci.id = mi.combinationid where mci.id = ?', medicineCombinationId, function(err, result) {
          con.release();
          if (err) {
            console.log("Error :" + JSON.stringify(err))
            res.send({status: 1, message: 'combination delete failed'});
          } else {
            res.send({status: 2, message: 'combination deleted successfully'});
          }
        });
    });
  };

  var getCombination = function(medicineCombination){
      var combination = {};
      combination.id = medicineCombination.id;
      combination.appointmentid = medicineCombination.appointmentid;
      combination.name = medicineCombination.name;
      combination.dietaryrestrictions = medicineCombination.dietaryrestrictions;
      combination.consumptionmode = medicineCombination.consumptionmode;
      combination.timeofmedication = medicineCombination.timeofmedication;
      combination.stateformedication = medicineCombination.stateformedication;
      combination.priceperdose = medicineCombination.priceperdose;
      combination.totalprice = medicineCombination.totalprice;
      combination.totaldays = medicineCombination.totaldays;
      combination.totaldoses = medicineCombination.totaldoses;
      combination.discount = medicineCombination.discount;
      combination.additionalcomments = medicineCombination.additionalcomments;
      return combination;
  }

  var createMedicineCombinationFailed = function(con, err, res){
    con.rollback(function() {});
    res.send({status: 1, message: 'Medicine combination save failed'});
  }

  var insertMedicine = function(medicines, combinationId, con, res){
    console.log("starting to insert medicine"+JSON.stringify(medicines));
    var hasError = false;
    if(Array.isArray(medicines) && medicines.length > 0){
      var count = 0;
      var total = medicines.length;
      medicines.forEach(function(medicineIssued){
        medicineIssued.combinationid = combinationId;
        console.log("trying to insert"+JSON.stringify(medicineIssued));
        con.query('insert into medicines_issued set ?', medicineIssued, function(err, result) {
          if (err) {
            console.log("error"+JSON.stringify(err));
            hasError = true;
          };
          count++;
          if(count>=total){
            if(hasError){
                createMedicineCombinationFailed(con, null, res);
            }else{
              con.commit(function(err1) {
                if (err1) { 
                  createMedicineCombinationFailed(con, err1, res);
                }else{
                  res.send({status: 2, message: 'Medicine combination saved successfully', medicineCombinationId : combinationId});
                }
              });
            }
          }
        });
      });
    }else{
      createMedicineCombinationFailed(con, err, res);
    }
  }
}

module.exports = new Appointments();
