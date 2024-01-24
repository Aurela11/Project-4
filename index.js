const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express ();
const port = 3000;

 const userRouters = require('./routes/users');
 const taskRouters = require('./routes/events');

app.use(cors());
app.use(bodyParser.json());



app.use('/api/users',userRouters);
app.use('/api/events',taskRouters);


 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
 })
 