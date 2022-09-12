const fs = require('fs');
const { exit } = require('process');
var images = require("./images.json");

// does images.json exist?
if (images === undefined) {
  console.error("images.json not found");
  exit(1);
}

var new_images = {}
new_images.img_path = images.img_path;
new_images.placeholder_path = images.placeholder_path;
new_images.directories = images.directories;
new_images.img = {};

images.directories.forEach(folder => {
  var filenames = fs.readdirSync(images.img_path + folder + "/");
  filenames.forEach(filename => {
    // create empty image set
    var imageSet = [];
    // loop through all images in folder
    filenames.forEach(filename => {
      imgEntry = undefined;

      // check if folder was already known:
      if (images.img[folder] !== undefined) {
        // check if file was already known:
        images.img[folder].forEach(existingImgEntry => {
          // try to find file in old json list
          if (existingImgEntry.filename === filename) {
            // if it exists, copy over data
            imgEntry = existingImgEntry;
            return;
          }
        });
      }

      // if the entry did not exist in previous json file
      if (imgEntry === undefined) {
        // create new entry data
        imgEntry = {
          "filename": filename,
          "img_src": images.img_path + folder + '/' + filename,
          "placeholder_src": images.placeholder_path + folder + '/' + filename,
          "caption": ""
        }
      }
      // add file to imageSet
      imageSet.push(imgEntry);
    });

    new_images.img[folder] = imageSet;
  });
});

fs.writeFileSync('./images.json', JSON.stringify(new_images), err => {
  if (err)
    console.error(err);
});

console.log("Successfully updated images.json");

var totalImageCount = 0;

for (const [folder, images] of Object.entries(new_images.img)) {
  var imageCountInFolder = images.length;
  console.log("\t" + folder + ": " + imageCountInFolder + " images");
  totalImageCount += imageCountInFolder;
}

console.log("images.json now tracks a total of " + totalImageCount + " images.");