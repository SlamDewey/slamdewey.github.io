# slamdewey.github.io
This is the repository for my personal website, written using the Angular CLI.

This `README.md` will be expanded as the site progresses in development.


The three main pages of the site are the:
 - [Home Page](https://github.com/SlamDewey/slamdewey.github.io/tree/master/src/app/home)
 - [Hobbies & Projects Page](https://github.com/SlamDewey/slamdewey.github.io/tree/master/src/app/projects)
 - [Gallery Page](https://github.com/SlamDewey/slamdewey.github.io/tree/master/src/app/gallery)


## Color Palette
This site uses a 5 color palette for styling.  You may see this in `styles.css` or below:
 - primary:     `#FA7921`
 - secondary:   `#942911`
 - tertiary:    `#0D3B66`
 - highlight:   `#FAF0CA`
 - compliment:  `#B0A3D4`
 
 
## Helper Scripts
There are a few helper scripts written for this project, giving myself a slightly less labor intensive job to perform certain actions.

### autobuilder.bat
An easy script to handle a few housekeeping items, as well as perform a git commit / push along with it.

### imageJsonBuilder.js
The images located in the gallery on this site are stored locally, in the `docs/assets/` folder in this repository, and there is a little chunk
of data stored about every single image.  For instance, each image has a 300px by 200px placeholder version which is used as a preview display, and 
each image has text/caption information associated with it.  This data is stored in [src/app/images.json](https://github.com/SlamDewey/slamdewey.github.io/blob/dev/src/app/images.json) and this text/caption data is edited manually.  Therefore, to add new image sets, I wrote [imageJsonBuilder.js](https://github.com/SlamDewey/slamdewey.github.io/blob/dev/imageJsonBuilder.js).  This script reads the old `images.json` file, copies over old content, and either overwrites or simply adds in new content as appropriate. 