function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'Duplicate entry',
        field: err.sqlMessage.split("'")[1] 
      });
    }
  
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({ 
        message: 'Referenced entity not found' 
      });
    }
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: err.errors 
      });
    }
  
    res.status(500).json({ 
      message: err.message || 'Internal Server Error' 
    });
  }
  
  module.exports = errorHandler;