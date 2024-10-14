const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const authRoutes = require('./routes');

app.use(bodyParser.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
