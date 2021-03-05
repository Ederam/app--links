const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const PDF = require('pdfkit');
const fs =  require('fs');
const multipart = require('connect-multiparty');
//const rest = new  require('rest-mssql-nodeje');//SE AGREGA PARA IMPORTAR CONEXION A SQL SERVER

const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'faztmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});
var doc = new PDF();

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/utils/exportPDF'));
app.use(require('./routes/utils/uploadfile'));
app.use('/links', require('./routes/links'));
//app.use('/utils', require('./routes/utils'));
//app.use('/utils', require('./routes/utils/exportPDF'));
//app.use('/utils', require('./routes/utils/uploadfile'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

//este codigo es para ejecutar la funcion de carag de archivos
app.use(express.json());
app.use(express.urlencoded({ext: true }));
// codgio agregado para subir archivos con multipart
app.use

/*
//Generacion de PDF
doc.pipe(fs.createWriteStream(__dirname + '/example.pdf'));

doc.text('Hola Mundo con PDFKit',{
  align: 'center'
});

var parrafo = 'Lorem ipsum dolor sit amet consectetur adipiscing elit, vitae massa hac non leo velit, dictumst sagittis gravida risus libero bibendum. Ut proin quisque sodales tortor ultricies vivamus duis maecenas, commodo himenaeos gravida nascetur feugiat nunc arcu mattis, viverra nostra mus facilisis cras sapien dapibus. Quam congue felis ultrices ligula nullam quis lacinia curabitur pellentesque fames, posuere orci eu hac blandit mus at placerat semper massa aliquam, dui diam convallis cum tempus sagittis laoreet arcu vestibulum.' +

doc.text('Lorem ipsum dolor sit amet consectetur adipiscing elit, vitae massa hac non leo velit, dictumst sagittis gravida risus libero bibendum. Ut proin quisque sodales tortor ultricies vivamus duis maecenas, commodo himenaeos gravida nascetur feugiat nunc arcu mattis, viverra nostra mus facilisis cras sapien dapibus. Quam congue felis ultrices ligula nullam quis lacinia curabitur pellentesque fames, posuere orci eu hac blandit mus at placerat semper massa aliquam, dui diam convallis cum tempus sagittis laoreet arcu vestibulum.' + __dirname,{
  columns: 3,
  align: 'justify'
});

doc.image(__dirname+'/public/img/logo.png',{
  //scale: 3
});

doc.end();
console.log('Archivo generado');
*/

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});