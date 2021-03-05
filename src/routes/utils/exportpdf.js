const express = require('express');
const router = express.Router();
//const app = express();
const path = require('path');
const multer = require('multer');

///SUBIDA DE ARCHIVO POR BOY-MULTIPARTY


const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const multiPartMiddleware = multipart({
    uploadDir: './subidas'
});


// EndPoint to Upload files
router.post('/api/subir', multiPartMiddleware, (req,res) => {
    res.json({
        'message': 'Fichero subido correctamente!'
    });
});

////SUBIDA DE ARCHIVO POR MULTER
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './subidos')
    },
    filename:(req,file, cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', (req,res) => {
    return res.send('This is the home page');
});

router.post('/exportpdf', upload.single('file'),(req,res) => {
    console.log(`Storage location is ${req.hostname}/${req.file.path}`);
    return res.send(req.file);
});
router.get('/exportpdf', (req, res) => {
    //console.log('prueba para ver cargue de vista')
    //res.send('Modulo de exportar pdf');
    res.render('utils/exportpdf');
});

router.post('/exportpdf', async (req, res) => {
    console.log(`Storage location is ${req.hostname}/${req.file.path}`);
    console.log(`Storage location is ${req.hostname}`);
    //return res.send(req.file);
    res.send(req.file);
    // const { id } = req.params;
    // const { title, description, url} = req.body; 
    // const newLink = {
    //     title,
    //     description,
    //     url
    // };
    // await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Archivo Subido Satisfactoriamente');
    res.redirect('/links');
});


module.exports = router;