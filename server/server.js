const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const dns = require('dns');
const os = require('os');
const passport = require("passport");
const session = require("express-session");
const cors = require('cors');
dotenv.config();

//init mongoDB
//require('./src/db');

const PORT = 8080;

const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

require("./config/passport")(passport);

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


// Routes
app.use('/users', userRoutes);

//-----------------------Cross-Origin Resource Sharing-----------------
app.use(cors({
    origin: 'http://localhost',
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors())

app.all('', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
});

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    next(err);
    next();
});

/*app.get('/',(res, rsp) => {
    rsp.send('E-Portfolio')
})
app.listen(PORT, () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log(`Express server listening on `+ add + `:${PORT}`)
     })
})*/



// mongodb environment variables
const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_PORT
} = process.env;
// Connection URL
const url =`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`;

// Use connect method to connect to MongoDB after a safe delay as it takes time to install mongoDB in docker for the first time. Can remove delay after 1st run.
// no need for delay if running mongoDb locally
setTimeout(connect, 10000);

function connect(){
    mongoose
    //.connect('mongodb+srv://qunzhi:test123@cluster0.7wtff.mongodb.net/e-portfolio?retryWrites=true&w=majority')
        .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to mongoDB")
        app.listen(PORT, () => {
            dns.lookup(os.hostname(), function (err, add, fam){
                console.log(`Express server listening on `+ add + `:${PORT}`)
            })
         })
    })
    .catch(err => {
        console.log(err);
    });
}
