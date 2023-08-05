const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

// find the styles css file
const files = getFilesFromPath('./dist/housingstreet', '.css');
let data = [];

const files1 = getFilesFromPath('./dist/housingstreet/assets/bootstrap/css', '.css');
let data1 = []

const files2 = getFilesFromPath('./dist/housingstreet/assets/resources/css/', '.css');
let data2 = []
if (!files && files.length <= 0) {
  console.log("cannot find style files to purge");
  return;
}

for (let f of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes('./dist/housingstreet/' + f) + "kb";
  var o = { "file": f, "originalSize": originalSize, "newSize": "" };
  data.push(o);
}

for (let f of files1) {
    // get original file size
    const originalSize = getFilesizeInKiloBytes('./dist/housingstreet/assets/bootstrap/css/' + f) + "kb";
    var o = { "file": f, "originalSize": originalSize, "newSize": "" };
    data1.push(o);
  }
for (let f of files2) {
// get original file size
    const originalSize = getFilesizeInKiloBytes('./dist/housingstreet/assets/resources/css/' + f) + "kb";
    var o = { "file": f, "originalSize": originalSize, "newSize": "" };
    data2.push(o);
    }

console.log("Run PurgeCSS...");

exec("purgecss -css dist/housingstreet/*.css --content dist/housingstreet/index.html dist/housingstreet/*.js -o dist/housingstreet/", function (error, stdout, stderr) {

console.log("PurgeCSS done");
  console.log();

  for (let d of data) {
    // get new file size
    const newSize = getFilesizeInKiloBytes('./dist/housingstreet/' + d.file) + "kb";
    d.newSize = newSize;
  }


  console.table(data);
});
exec("purgecss -css dist/housingstreet/assets/bootstrap/css/*.css --content dist/housingstreet/index.html dist/housingstreet/*.js -o dist/housingstreet/assets/bootstrap/css/", function (error, stdout, stderr) {
    console.log("PurgeCSS done");
    
  
    for (let d of data1) {
      // get new file size
      const newSize = getFilesizeInKiloBytes('./dist/housingstreet/assets/bootstrap/css/' + d.file) + "kb";
      d.newSize = newSize;
    }
  
    console.table(data1);
  });
exec("purgecss -css dist/housingstreet/assets/resources/css/*.css --content dist/housingstreet/index.html dist/housingstreet/*.js -o dist/housingstreet/assets/resources/css/", function (error, stdout, stderr) {

console.log("PurgeCSS done");
    console.log();

    // for (let d of data2) {
    // // get new file size
    // const newSize = getFilesizeInKiloBytes('./dist/housingstreet/assets/resources/css/' + d.file) + "kb";
    // d.newSize = newSize;
    // }


    console.table(data2);
});

function getFilesizeInKiloBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = fs.readdirSync(dir);
  console.log(123,files)
  return files.filter(e => path.extname(e).toLowerCase() === extension);
}