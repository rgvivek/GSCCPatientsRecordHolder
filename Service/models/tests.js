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

  this.getAllInvestigationCategories = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from investigation_category', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllTests = function(res) {
    connection.acquire(function(err, con) {
      con.query('select ts.*, tc.name as testcategoryname, ic.name as investigationcategoryname from tests ts inner join test_category tc on ts.testcategory=tc.code'+ 
        ' inner join investigation_category ic on ts.investigationcategory=ic.code', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getAllTestResults = function(patientId, res) {
    connection.acquire(function(err, con) {
      con.query('select tr.*, ts.name as testname, tc.name as testcategoryname, ic.name as investigationcategoryname from test_results tr'+
        ' inner join tests ts on ts.id=tr.testid'+
        ' inner join test_category tc on ts.testcategory=tc.code'+ 
        ' inner join investigation_category ic on ts.investigationcategory=ic.code'+
        ' where patientid = ? order by testname, conducteddate', patientId, function(err, result) {
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

  this.createInvestigationCategory = function(testCategory, res) {
    connection.acquire(function(err, con) {
      con.query('insert into investigation_category set ?', testCategory, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'Investigation category creation failed'});
        } else {
          res.send({status: 2, message: 'Investigation category created successfully', testCategoryId : result.insertId});
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

  this.addTestResult = function(testResult, res) {
    connection.acquire(function(err, con) {
      //testResult.creatededdate = new Date();
      con.query('insert into test_results set ?', testResult, function(err, result) {
        con.release();
        if (err) {
          console.log("Error :" + JSON.stringify(err))
          res.send({status: 1, message: 'Test result addition failed'});
        } else {
          res.send({status: 2, message: 'Test result added successfully', testResultId : result.insertId});
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

  this.updateInvestigationCategory = function(testCategory, res) {
    connection.acquire(function(err, con) {
      con.query('update investigation_category set ? where id = ?', [testCategory, testCategory.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Investigation Category update failed', error:err});
        } else {
          res.send({status: 2, message: 'Investigation Category updated successfully'});
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

  this.updateTestResult = function(testResult, res) {
    connection.acquire(function(err, con) {
      testResult.modifieddate = new Date();
      con.query('update test_results set ? where id = ?', [testResult, testResult.id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Test Result update failed'});
        } else {
          res.send({status: 2, message: 'Test Result updated successfully'});
        }
      });
    });
  };

  this.deleteTestResult = function(testResultId, res) {
    connection.acquire(function(err, con) {
      con.query('delete from test_result where id = ?', testResultId, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Test Result deleted failed'});
        } else {
          res.send({status: 2, message: 'Test Result deleted successfully'});
        }
      });
    });
  };

}

module.exports = new Tests();
