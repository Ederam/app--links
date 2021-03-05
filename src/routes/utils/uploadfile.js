const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    upload = multer({dest: './archivos'});

router.get('/',(req,res)=>{
    res.sendFile('/index.htm', {root: __dirname});
})

router.post('/post',(req,res) =>{
    console.log(req.file);
    res.send('Archivo subido correctamente');
});

module.exports = router;