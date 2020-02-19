const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

//const helmet = require('helmet');
//const unless = require('express-unless');
//const http = require('http');
const db = require('./src/db/mysql.js');
const router = require('./src/router/router');



//response.setHeader('Content-Type', 'application/json');

const app = express();
// SENDGRID_API_KEY=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


// app middlewares:
app.use(morgan('dev'));
//app.use(cors());
// app.use(helmet());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.json());
// app.use(cors()); // allows all origins to make reqs to our server

if(process.env.NODE_ENV = 'development') {
    app.use(cors({origin: `http://localhost:3000`})); //if we r in dev mode we'll allow this domain
}


app.use(router);

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`Api is running on port ${port}- ${process.env.NODE_ENV}`);
});