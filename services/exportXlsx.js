var fs = require('fs');
const exifParser = require('exif-parser');
var excel = require('node-excel-export');

exports.isHiddenFile = fileName => {
  return (/(^|\/)\.[^\/\.]/g).test(fileName);
}

exports.getFileMetadata = (fileName) => {
  try {
    let buffer = fs.readFileSync(fileName, (err, data) => {          
      if (err) throw err;          
    });
    return exifParser.create(buffer).parse();
  } catch(e) {
    // console.log('Err ', e);
  }
  
}

exports.getFileName = (fileName) => {
  return fileName.substring(
    fileName.lastIndexOf("/") + 1, 
    fileName.lastIndexOf(".")
  );
}

exports.isNeeded = fileName => {
  
  if (fs.lstatSync(fileName).isFile()) {    
    if(this.isHiddenFile(fileName)) {      
      return;
    }
    return true;
  }   
}



exports.addInfos = (fileName) => {
  let metadatas = this.getFileMetadata(fileName);
  
  
  let name = this.getFileName(fileName.replace(/____/g, '/'))  
  let chemin = fileName.split("uploads")[1].split('.')[0].replace(/____/g, '/').replace(/\//g, '')
  if (metadatas && metadatas.tags && metadatas.tags.GPSLatitude) {
    return {
      nom: this.getFileName(fileName.replace(/____/g, '/')),
      lat: metadatas.tags.GPSLatitude,
      lng: metadatas.tags.GPSLongitude,
      repertoire: chemin.replace(name, '')
    }
  }
  
}

exports.generatexlsx = (infos) => {
  let styles = {
    headerDark: {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            // underline: true            
        },   
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        }     
    }    
  };

  // Array of objects representing heading rows
  let heading = [];

  // export structure
  let specification = {
    repertoire: { // <- the key should match the actual data key
        displayName: 'Repertoire', // <- Here you specify the column header
        headerStyle: styles.headerDark, // <- Header style        
        width: 220 // <- width in pixels
    },
    nom: {
        displayName: 'Nom',
        headerStyle: styles.headerDark,
        width: 200 // <- width in chars (when the number is passed as string)
    },
    lat: {
        displayName: 'Latitude',
        headerStyle: styles.headerDark,
        // cellStyle: styles.cellPink, // <- Cell style
        width: 200 // <- width in pixels
    },
    lng: {
        displayName: 'Longitude',
        headerStyle: styles.headerDark,
        // cellStyle: styles.cellPink, // <- Cell style
        width: 200 // <- width in pixels
    }
  };

  let dataset = [];  
  infos.forEach((info, i) => {
    dataset.push(
      {
        repertoire: info.repertoire, 
        nom: info.nom, 
        lat: info.lat, 
        lng: info.lng}
    )        
  });

  let report = excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
            name: 'Faces', // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            specification: specification, // <- Report specification
            data: dataset // <-- Report data
        }
    ]
  );  

  return report;

}

