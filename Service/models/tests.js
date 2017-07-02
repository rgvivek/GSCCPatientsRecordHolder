var connection = require('../connection');
function Tests() {
  this.getAllTestCategories = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from test_category', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllTests = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from tests', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.createTestCategory = function(testCategory, res) {
    connection.acquire(function(err, con) {
      con.query('insert into test_category set ?', testCategory, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'Test category creation failed'});
        } else {
          res.send({status: 2, message: 'Test category created successfully', testCategoryId : result.insertId});
        }
      });
    });
  };

  this.createTest = function(test, res) {
    connection.acquire(function(err, con) {
      con.query('insert into tests set ?', test, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'Test creation failed'});
        } else {
          res.send({status: 2, message: 'Test created successfully', testId : result.insertId});
        }
      });
    });
  };

  this.updateTestCategory = function(testCategory, res) {
    connection.acquire(function(err, con) {
      con.query('update test_category set ? where id = ?', [testCategory, testCategory.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Test Category update failed', error:err});
        } else {
          res.send({status: 2, message: 'Test Category updated successfully'});
        }
      });
    });
  };

  this.updateTest = function(test, res) {
    connection.acquire(function(err, con) {
      con.query('update tests set ? where id = ?', [test, test.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Test update failed'});
        } else {
          res.send({status: 2, message: 'Test updated successfully'});
        }
      });
    });
  };

}

module.exports = new Tests();
