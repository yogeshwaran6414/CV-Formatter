require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cvRoutes = require('./routes/cv');
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/cv', cvRoutes);

app.use(errorHandler);
const { DB_user, DB_password } = process.env;
const DBurl = `mongodb+srv://${DB_user}:${DB_password}@cluster0.xduh9zw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const PORT = process.env.PORT || 4000;
mongoose.connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch(err => {
    logger.error('DB connection error', err);
    process.exit(1);
  });
