# Gulp Starter Pack
This package intended to solve common front-end development tasks. Works best for psd/sketch/figma/xd to html, php projects and save you a lot of time setting up local environment

### Dependencies
Name               | Minimum required version                                                      
:------------------|:----------------------------------
NPM                | v6.4.1
Node.js            | v10.14.2


## How to start
* `npm i` - install npm dependencies
* `gulp` - run dev-server
* `gulp build` - build project from sources


### Main tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`gulp default`          | will start all tasks required by project in dev mode: initial build, watch files, run server with livereload
`gulp build`            | build production-ready project (with code optimizations)

### Other tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`gulp css` 	                    | compile .sass/.scss to .css. Included [autoprefixer](https://github.com/postcss/autoprefixer)
`gulp html`                     | compile html templates templates
`gulp script`                   | minifies `./src/js/` .js code into separate files into `./projectName/js` 
`gulp otf2ttf`                  | convert otf to ttf format
`gulp svgSprite`                | create svg sprite for all svg image -> create only one svg, where you can use by call svg and id of image in this .svg file
`gulp images`                   | convert to webp and compress png, jpg, svg and other format
`gulp generate-favicon`         | generate favicon images in `src/img/favicon`
`gulp check-for-favicon-update` | check for update for generate-favicon

### Npm update task
Task name          | Description                                                      
:------------------|:----------------------------------
`npm install lodash@latest` 	                    | update to latest version "lodash"
