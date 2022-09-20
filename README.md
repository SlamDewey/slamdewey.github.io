# slamdewey.github.io
This is the repository for Jared Massa's (@SlamDewey) Personal website, written using the Angular CLI.

This `README.md` will be expanded as the site progresses in development.

## Project Structure
The site presented here is quite simple and uses the standard component based structure of Angular applications.
The Angular Router is used to display different components as pages, however all pages feature the [site-header](https://github.com/SlamDewey/slamdewey.github.io/tree/master/src/app/shared/site-header) component as a side navigation bar.


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
The autobuilder script combines all the commands I would have to run to commit and push a functional update to the `dev` branch on this repo.
Essentially we have to rebuild the Angular application, so the compiled site files are available in the `docs/` folder (for github) and we
also have to create a `404.html` page which is a replica of our `index.html` because GitHub pages has some trouble working with the Angular router.
This copy/paste workaround means that one way or another, we always end up on the "index" and the Angular router is always activated.

The rest of the `.bat` file is for simply pushing the changes up to github on my `dev` branch (`master` branch is protected).
The only steps left for me to move a build into the production enviornment are to open (and merge) a pull request from `dev` -> `master`.
Then the master branch goes through an automatic build & deploy sequence, viewable in the (Action Tab)[https://github.com/SlamDewey/slamdewey.github.io/actions] of this repo.

### imageJsonBuilder.js
The images located in the gallery on this site are stored locally, in the `docs/assets/` folder in this repository, and there is a little chunk
of data stored about every single image.  For instance, each image has a 300px by 200px placeholder version which is used as a preview display, and 
each image has text/caption information associated with it.  This data is stored in (src/app/images.json)[https://github.com/SlamDewey/slamdewey.github.io/blob/dev/src/app/images.json] and this text/caption data is edited manually.  Therefore, to add new image sets, I wrote (imageJsonBuilder.js)[https://github.com/SlamDewey/slamdewey.github.io/blob/dev/imageJsonBuilder.js].

This script reads the old `images.json` file, copies over old content and either overwrites or simply adds in new content as appropriate. 

I don't have to run this script often, but it makes my life a whole lot easier to just specify a new image directory in the images.json, and run `imageJsonBuilder.js` and
`autobuilder.bat` to add any amount of new images almost directly into the production enviornment.