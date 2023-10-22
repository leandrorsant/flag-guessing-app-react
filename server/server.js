require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const BodyParser = require( 'body-parser' );

const uri = process.env.DATABASE_URL

mongoose.connect(uri)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', ()=> console.log('Connected to database'))

// Parse request of content-type - application/x-www-form-urlencoded
app.use( BodyParser.urlencoded( { extended: false } ) );

// Parse request of content-type - application/json
app.use( BodyParser.json() );



app.get( '/', function( req, res ) {
	res.json( {
		status: "OK"
	} );
} );

app.get( '/test', function( req, res ) {
	res.json( {
		status: "Hehehe Test"
	} );
} );

const usersRouter = require('./routes/users.js');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Methods', '*');
	next();
  });
  

app.use('/users', usersRouter)

app.listen( 5000, () => {
	console.log( "Server Run:" + 5000 );
} );



