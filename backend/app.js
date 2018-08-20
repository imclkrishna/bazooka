const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();


//routes
const creators   = require('./routes/creators');
const category   = require('./routes/category');
const states     = require('./routes/states');
const influencer = require('./routes/influencer');
const users      = require('./routes/users');


//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/key').mongoURI;

//console.log('1111111', mongoURI);
mongoose.connect(db, {useNewUrlParser:true})
.then((error,dbd)=>console.log("MongoDB connected again"))
.catch(err=>console.log(err));


app.use('/creators', creators);
app.use('/category', category);
app.use('/states', states);
app.use('/influencer',influencer);
app.use('/users', users);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(7000, () => console.log('Example app listening on port 7000!'));