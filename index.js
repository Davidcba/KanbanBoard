'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
// Inits
const app = express();

// Configs
app.set('port', process.env.PORT || 3000) ;
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'),'partials' ),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
}));
app.set('view engine', '.hbs');

// Middleware

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


// Variables
app.use((req, res, next) =>{
    next();
});


// Routes
app.use(require('./routes/auth'));
app.use('/proyects',require('./routes/proyectos'));
app.use('/',require('./routes/auth'));
app.use('/dashboard',require('./routes/tablero'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('Api corriendo en  http://localhost:'+ app.get('port'));
} );

