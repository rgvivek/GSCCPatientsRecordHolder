var connection = require('../connection');
function Medicines() {
  this.getAllMedicines = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from medicines', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.createMedicine = function(medicine, res) {
    connection.acquire(function(err, con) {
      con.query('insert into medicines set ?', medicine, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'medicine creation failed'});
        } else {
          res.send({status: 2, message: 'medicine created successfully', medicineId : result.insertId});
        }
      });
    });
  };

  this.updateMedicine = function(medicine, res) {
    connection.acquire(function(err, con) {
      con.query('update medicines set ? where id = ?', [medicine, medicine.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'medicine update failed', error:err});
        } else {
          res.send({status: 2, message: 'medicine updated successfully'});
        }
      });
    });
  };

  this.deleteMedicine = function(medicineId, res) {
    connection.acquire(function(err, con) {
      con.query('delete from medicines where id = ?', medicineId, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'medicine deleted failed'});
        } else {
          res.send({status: 2, message: 'medicine deleted successfully'});
        }
      });
    });
  };

  this.addMedicinePurchase = function(medicine, res) {
    connection.acquire(function(err, con) {
      con.query('insert into medicines_purchase_log set ?', medicine, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'medicine purchase add failed'});
        } else {
          res.send({status: 2, message: 'medicine purchase add successful'});
        }
      });
    });
  };

  this.getAllMedicinesPurchases = function(startdate, enddate, res) {
    connection.acquire(function(err, con) {
      con.query('select * from medicines_purchase_log where createddate between ? and ?', [startdate, enddate], function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

}

module.exports = new Medicines();
