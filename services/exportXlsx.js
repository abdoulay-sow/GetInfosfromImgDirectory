var fs = require('fs');
const exifParser = require('exif-parser');
var excel = require('excel4node');

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
  if (metadatas && metadatas.tags && metadatas.tags.GPSLatitude) {
    return {
      name: this.getFileName(fileName),
      lat: metadatas.tags.GPSLatitude,
      long: metadatas.tags.GPSLongitude
    }
  }
  
}

exports.generateExel = (infos) => {
  if(infos.length > 0) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Faces');

    worksheet.cell(1, 1).string('Nom');
    worksheet.cell(1, 2).string('Latitude');
    worksheet.cell(1, 3).string('Longitude');

    infos.forEach((info, i) => {
      let j = i + 2;
      for (let key in info) {          
        let k = 1;
        if (key === 'name') {
          worksheet.cell(j, k).string(info.name);
        }
        if (key === 'lat') {            
          worksheet.cell(j, k+1).number(info.lat);
        }
        if (key === 'long') {            
          worksheet.cell(j, k+2).number(info.long);
        }
      }
    });

    return workbook;    

  }
}
