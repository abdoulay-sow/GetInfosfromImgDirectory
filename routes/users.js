var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path'),
  os = require('os');

const exportXlsxService = require('../services/exportXlsx');

/* GET users listing. */
router.get('/', function(req, res, next) {  
  res.render('export', { title: 'Hey', message: 'Hello there!'});
});

router.post('/', function(req, res, next) {    
  fs.mkdir(path.join(__dirname, 'uploads'), (err) => { 
    if (err) { 
        return 'OK'; 
    } 
    console.log('Directory created successfully!'); 
  }); 
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    try{      
      let pathEx = path.join(__dirname, 'uploads', filename);      

      if(!fs.existsSync(pathEx)) {        
        let saveTo = path.join(__dirname, 'uploads', filename);
        file.pipe(fs.createWriteStream(saveTo));        
      }      
    } catch (e) {
      // console.log('error ', e)
    }
  });

  req.busboy.on('finish', function() {    
    const CHILD_FOLDER = [];
    const faceInfos = [];
    let directoryUploads = path.join(__dirname, 'uploads')
    let directoryMiniUploads = path.join(__dirname, 'uploads', 'mini')
    let face = null;        

    fs.readdirSync(directoryUploads).map(fileName => { 
      if(fs.lstatSync(path.join(directoryUploads, fileName)).isFile()) {
        CHILD_FOLDER.push(path.join(directoryUploads, fileName));
      }      
    })
    CHILD_FOLDER.map(file => {      
      face = exportXlsxService.addInfos(file);

      if (face) {
        faceInfos.push(face);
      }
    }); 
    fs.rmdirSync(directoryUploads, { recursive: true });        
    if(faceInfos.length > 0) {      
      let report = exportXlsxService.generatexlsx(faceInfos);
      res.send({content: report.toString('base64')});
  
    }    
  })
  req.pipe(req.busboy);
});

module.exports = router;
