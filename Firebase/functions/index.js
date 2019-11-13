const express = require('express'); //import express
const bodyParser = require("body-parser"); //used to extract information from forms
const app = express(); //initiale a new express application
const userRouter = require("./backend/routes/user"); //load routes for users
const electionBodyRouter = require("./backend/routes/electionBody");
const voteRouter = require("./backend/routes/vote");
const electionRouter = require("./backend/routes/election");
const analyticsRouter = require("./backend/routes/analytics");
const functions = require('firebase-functions');
const clientRouter = require("./backend/routes/client");
var path = require('path');

/*
Set up mongodb/mongoose
*/
const mongoose = require('mongoose');
let uri = "mongodb://easyvote:passw0rd@ds243963.mlab.com:43963/easyvote"
mongoose.connect(uri, {useNewUrlParser: true}).then(()=>{
	console.log("Connected to Database");

}).catch((err)=>{
	console.log(`Error in connection to DB ${err}`);
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

/*
Configure routes
*/
app.use('/user', userRouter);
app.use('/electionBody', electionBodyRouter);
app.use('/vote', voteRouter);
app.use('/election', electionRouter);
app.use('/analytics', analyticsRouter);
app.use('/client', clientRouter);

// 404 route
app.get('*', function(req, res){
  // respond with html page
  if (req.accepts('html')) {
    res.status(404);
    res.sendFile(path.join(__dirname + '/assets/404.html'));
  }
  else if (req.accepts('json')) {
    // Respond with json.
    res.status(404).send({ error: 'Not found' });
  }
  else {
    // Default to plain-text. send()
    res.status(404).type('txt').send('Not found');
  }
});

/*
Run server
*/
/*
app.listen(port, ()=> {
	console.log(`App is listening on port ${port}`);
})
*/
// https://easyvote-f20bf.firebaseapp.com
exports.app = functions.https.onRequest(app);
