require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});