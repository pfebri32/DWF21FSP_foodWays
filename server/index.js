const express = require('express');
const router = require('./src/routes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT, () => {
  console.log(`Your server is start on port ${process.env.PORT}...`);
});
