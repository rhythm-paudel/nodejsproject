require('dotenv').config();
const { log } = require('console');
const express = require('express');
const app = express();
const path = require('path');
const {logger,logEvents }= require('./middleware/logEvents')
const errorHandler= require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;

//^-> begin with,, $=> ends with,, | => or,, (something)? ==>optional


//Connect to mongoDB
connectDB();

//custom middleware logger
app.use(logger)
app.use(credentials)
app.use(cors(corsOptions)); // cors stand for cross origin resource sharing
app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use(cookieParser())
app.use(express.static(path.join(__dirname,'/public')))
app.use('/',require('./routes/root'))
app.use('/register',require('./routes/register'))
app.use('/auth',require('./routes/auth'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/logout'))
app.use(verifyJWT)
app.use('/employees',require('./routes/api/employees'))
//Route handlers


app.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }
    else if(req.accepts('json')){
        res.json({error:"404 not found"});
    }else{
        res.type('txt').send("404  nottt t found")
    }
    
})

app.use(errorHandler);

mongoose.connection.once('open',()=>{
    console.log('Connected to mongo DB');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    
})

