const gulp = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const htmlReplace = require('gulp-html-replace');
const merge = require('gulp-merge-json');
const fs = require('fs');
const {
    resolve
} = require('path');
const {
    task
} = require('gulp');

/**
 * Autobuild manager - Contains all the properties and methods to handle the gulp tasks
 */
class AutoBuildManager {
    constructor() {
        this.pluginFolder = 'plugins';
        this.pluginsList = [];
        this.viewsPath = 'classroom/Views/';
        this.views = [
            'header.html',
            'sidebar_student.html',
            'sidebar_teacher.html',
            'sidebar_manager.html',
            'sidebar_groupadmin.html',
            'home_topbar.html',
            'studentProfilePanel.html',
            'studentHelpPanel.html',
            'sandboxPanel.html',
            'studentActivitiesPanel.html',
            'teacherProfilePanel.html',
            'teacherClassesPanel.html',
            'teacherActivitiesPanel.html',
            'teacherHelpPanel.html',
            'groupAdminAppsPanel.html',
            'groupAdminHelpPanel.html',
            'groupAdminProfilePanel.html',
            'groupAdminUsersPanel.html',
            'managerProfilePanel.html',
            'managerAppsPanel.html',
            'managerUsersPanel.html',
            '_newExercicesPanel.html',
            'idePanel.html',
            'home_footer.html',
        ];
        this.temporaryViewsFolder = 'gulp/temp-views';
        this.pluginsFolderInClassroom = 'classroom/assets/plugins';
    }

    async init() {
        // Add the plugins to the pluginsList
        await this.loadPluginsList();
        if (this.pluginsList.length) {
            await this.loadFilesList();
            console.log(this.pluginsList);
            await this.emptyPluginsFolderInClassroom();
            this.createPluginsFolderInClassroom();
            await this.populatePluginsFolderInClassroom();
        }
    }


    /**
     * Tasks related to the views files
     *
     */
    pluginViews() {
        return new Promise(async (resolve, reject) => {
            if (this.pluginsList.length) {
                // create the temporary Views folder
                this.createTemporaryViewsFolder();
                // check if there is no view plugin conflict
                if (this.checkViewConflict()) {
                    reject();
                } else {
                    // Add all the plugins view files in the temporary view folder
                    await this.addViewFilesInTemporaryFolder();
                    // Add all the view files that aren't changed by the plugin(s) in th temporary view folder
                    await this.addStandardViewFilesInTemporaryFolder();
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Tasks related to the image files
     */
    async pluginImages() {
        return new Promise(async (resolve, reject) => {
            if (this.pluginsList.length) {
                // check if there aren't image filename duplicate
                if (this.checkForDuplicateInArray(this.pluginsList.images)) {
                    console.error('Error: there is a duplicate in the plugin(s) css filenames')
                    return reject();
                }
                // copy image files into the plugins folder in classroom folder
                await this.copyImageFilesToClassroom();
                resolve();
            } else {
                resolve();
            }
        });
    }

    /**
     * Tasks related to the css files
     */
    async pluginCss() {
        return new Promise(async (resolve, reject) => {
            if (this.pluginsList.length) {
                // check if there aren't css filename duplicate
                if (this.checkForDuplicateInArray(this.pluginsList.css)) {
                    console.error('Error: there is a duplicate in the plugin(s) css filenames')
                    return reject();
                }
                // copy css files into the plugins folder in classroom folder
                await this.copyCssFilesToClassroom();
                // add the css links into the head in the header.html file in the temporary views folder
                await this.addCssLinksInHead();
                resolve();
            } else {
                resolve();
            }
        });
    }

    /**
     * Tasks related to the js files
     */
    async pluginJs() {
        return new Promise(async (resolve, reject) => {
            if (this.pluginsList.length) {
                // check if there aren't js filename duplicate
                if (this.checkForDuplicateInArray(this.pluginsList.js)) {
                    console.error('Error: there is a duplicate in the plugin(s) js filenames')
                    return reject();
                }
                // copy js files into the plugins folder in classroom folder
                await this.copyJsFilesToClassroom();
                // add the js links into the footer in the home-footer.html file in the temporary views folder
                await this.addJsLinksInFooter();
                resolve();
            } else {
                resolve();
            }
        });
    }

    /**
     * Create the temporary Views folder
     */
    createTemporaryViewsFolder() {
        if (!fs.existsSync(this.temporaryViewsFolder)) {
            fs.mkdirSync(this.temporaryViewsFolder);
            console.log('📁  folder created:', this.temporaryViewsFolder);
        }
    }

    /**
     * Create the plugins folder in classroom folder (assets)
     */
    createPluginsFolderInClassroom() {
        if (!fs.existsSync(this.pluginsFolderInClassroom)) {
            fs.mkdirSync(this.pluginsFolderInClassroom);
            console.log('📁  folder created:', this.pluginsFolderInClassroom);
        }
    }

    /**
     * Remove all files in the plugins folder in classroom folder
     */
    emptyPluginsFolderInClassroom() {
        return new Promise((resolve, reject) => {
            fs.rm(this.pluginsFolderInClassroom, {
                recursive: true,
                force: true
            }, () => resolve());
        });
    }

    /**
     * Add all the required folders in the plugins
     */
    populatePluginsFolderInClassroom() {
        return new Promise(async (resolve, reject) => {
            await this.createFolder(`${this.pluginsFolderInClassroom}/css`);
            await this.createFolder(`${this.pluginsFolderInClassroom}/js`);
            await this.createFolder(`${this.pluginsFolderInClassroom}/images`);
            resolve();
        });
    }

    createFolder(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    fs.mkdir(path, (err) => {
                        if (err) {
                            reject();
                            return console.error(err);
                        }
                        console.log('📁  folder created:', path);
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Copy all the image files in the plugins folder to the images folder in the plugins folder which is in classroom folder
     */
    copyImageFilesToClassroom() {
        return new Promise((resolve, reject) => {
            let promises = [];
            this.pluginsList.forEach((plugin) => {
                plugin.images.forEach((imageFile) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            gulp.src(`${this.pluginFolder}/${plugin.name}/public/images/${imageFile}`).pipe(gulp.dest(`${this.pluginsFolderInClassroom}/images/`)).on('finish', () => {
                                resolve();
                            });
                        })
                    );
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Copy all the css files in the plugins folder to the css folder in the plugins folder which is in classroom folder
     */
    copyCssFilesToClassroom() {
        return new Promise((resolve, reject) => {
            let promises = [];
            this.pluginsList.forEach((plugin) => {
                plugin.css.forEach((cssFile) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            gulp.src(`${this.pluginFolder}/${plugin.name}/public/css/${cssFile}`).pipe(gulp.dest(`${this.pluginsFolderInClassroom}/css/`)).on('finish', () => {
                                resolve();
                            });
                        })
                    );
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Copy all the js files in the plugins folder to the js folder in the plugins folder which is in classroom folder
     */
    copyJsFilesToClassroom() {
        return new Promise((resolve, reject) => {
            let promises = [];
            this.pluginsList.forEach((plugin) => {
                plugin.js.forEach((jsFile) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            gulp.src(`${this.pluginFolder}/${plugin.name}/public/js/${jsFile}`).pipe(gulp.dest(`${this.pluginsFolderInClassroom}/js/`)).on('finish', () => {
                                resolve();
                            });
                        })
                    );
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Add all the plugins css links in the head (header.html)
     */
    addCssLinksInHead() {
        return new Promise((resolve, reject) => {
            let cssLinks = [];
            this.pluginsList.forEach((plugin) => {
                plugin.css.forEach((cssFile) => {
                    cssLinks.push(
                        `<link rel="stylesheet" href="assets/plugins/css/${cssFile}?version=1.1">\n`
                    );
                });
            });
            let headerCssPattern = /<!-- PLUGIN CSS-->([\s\S]*?)<!-- END PLUGIN CSS -->/;
            let cssLinksString = cssLinks.join('');
            gulp.src(`${this.temporaryViewsFolder}/header.html`, {
                base: './'
            })
            .pipe(replace(headerCssPattern, cssLinksString))
            .pipe(gulp.dest(`./`))
            .on('finish', () => {
                resolve();
            });
        });
    }

    /**
     * Add all the plugins js links in the footer (home-footer.html)
     */
    addJsLinksInFooter() {
        return new Promise((resolve, reject) => {
            let jsLinks = [];
            this.pluginsList.forEach((plugin) => {
                plugin.js.forEach((jsFile) => {
                    jsLinks.push(
                        `<script src="assets/plugins/js/${jsFile}?version=1.1"></script>\n`
                    );
                });
            });
            let headerJsPattern = /<!-- PLUGIN SCRIPTS-->([\s\S]*?)<!-- END PLUGIN SCRIPTS -->/;
            let jsLinksString = jsLinks.join('');
            gulp.src(`${this.temporaryViewsFolder}/home_footer.html`, {
                base: './'
            })
            .pipe(replace(headerJsPattern, jsLinksString))
            .pipe(gulp.dest(`./`))
            .on('finish', () => {
                resolve();
            });
        });
    }

    /**
     * Check if there is any plugin in the plugins folder and add it to the pluginsList with all the standards properties
     */
    loadPluginsList() {
        return new Promise((resolve, reject) => {
            fs.access(this.pluginFolder, (err) => {
                if (err) {
                    resolve();
                } else {
                    fs.readdir(this.pluginFolder, (err, files) => {
                        files.forEach(file => {
                            let currentPlugin = {
                                name: file,
                                views: [],
                                css: [],
                                js: [],
                                images: []
                            };
                            this.pluginsList.push(currentPlugin);
                        });
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Check if there are files in the plugin subfolders and add their name to the pluginsList
     */
    async loadFilesList() {
        return new Promise(async (resolve, reject) => {
            await this.loadPluginsFilesList('Views', 'views');
            await this.loadPluginsFilesList('public/css', 'css');
            await this.loadPluginsFilesList('public/js', 'js');
            await this.loadPluginsFilesList('public/images', 'images');
            resolve();
        });
    }

    /**
     * Method that search for files in a folder and then add their name to the relevant list
     */
    async loadPluginsFilesList(path, listName) {
        return new Promise(async (resolve, reject) => {
            this.pluginsList.forEach(async (plugin) => {
                let currentFolder = `${this.pluginFolder}/${plugin.name}/${path}`;
                await this.readFolderForList(plugin, currentFolder, listName);
                resolve();
            });
        });
    }


    /**
     * Method that returns a promise after reading a folder in a plugin and adding all filenames in the relevant list
     * @param {*} plugin
     * @param {*} folder
     * @param {*} list
     */
    async readFolderForList(plugin, folder, list) {
        return new Promise((resolve, reject) => {
            fs.readdir(folder, (err, files) => {
                if (files) {
                    try {
                        files.forEach(file => {
                            if (file != '.gitkeep') {
                                this.pluginsList[this.pluginsList.indexOf(plugin)][list].push(file);
                            }
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    console.error(`Folder ${folder} doesn't exist! Skipping!`);
                    resolve();
                }
            });
        }).catch((error) => {
            console.error(`Couldn't get ${folder} for ${plugin.name} (${error})`);
        });
    }

    /**
     * Check if there is no specific view file used in two plugins
     * @returns {boolean} True if there is duplicate view file
     */
    checkViewConflict() {
        let viewFiles = [];
        let alreadySeen = [];
        this.pluginsList.forEach((plugin) => {
            viewFiles = viewFiles.concat(plugin.views);
        });

        for (let file of viewFiles) {
            if (alreadySeen[file]) {
                console.error(`Warning: conflict detected in views file: ${file}`);
                return true;
            } else {
                alreadySeen[file] = true;
            }
        }
        return false;
    }

    /**
     * Add all the view files listed in the different plugins into the temporary views folder
     */
    addViewFilesInTemporaryFolder() {
        return new Promise((resolve, reject) => {
            const promises = [];
            this.pluginsList.forEach((plugin) => {
                plugin.views.forEach((view) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            gulp.src(`${this.pluginFolder}/${plugin.name}/Views/${view}`).pipe(gulp.dest(`${this.temporaryViewsFolder}/`)).on('finish', () => {
                                resolve();
                            });
                        })
                    );
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Add all the standard view files that aren't changed by the plugin(s) in the temporary view folder
     */
    addStandardViewFilesInTemporaryFolder() {
        return new Promise((resolve, reject) => {
            // get the list of needed standard view files
            let standardViewFiles = this.views;
            let customViewFiles = [];
            this.pluginsList.forEach((plugin) => {
                plugin.views.forEach((view) => {
                    customViewFiles.push(view);
                });
            });
            standardViewFiles = standardViewFiles.filter((file) => {
                return !customViewFiles.includes(file);
            });
            // adding the standard files into the temporary view files
            const promises = [];
            standardViewFiles.forEach((file) => {
                promises.push(
                    new Promise((resolve, reject) => {
                        gulp.src(`${this.viewsPath}${file}`).pipe(gulp.dest(`${this.temporaryViewsFolder}/`)).on('finish', () => {
                            resolve();
                        });
                    })
                );
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    }

    /**
     * Return true if an array contain duplicate values otherwise return false
     * @param {*} array
     */
    checkForDuplicateInArray(array) {
        if (array) {
            let alreadySeen = [];
            for (let element of array) {
                if (alreadySeen[element]) {
                    return true;
                } else {
                    alreadySeen[element] = true;
                }
            }
        }
        return false;
    }

    /**
     * Concatenate all the view files in the temp-views folder
     */
    homeConcat() {
        if (this.pluginsList.length) {
            return gulp.src([
                'gulp/temp-views/header.html',
                'gulp/temp-views/sidebar_student.html',
                'gulp/temp-views/sidebar_teacher.html',
                'gulp/temp-views/sidebar_manager.html',
                'gulp/temp-views/sidebar_groupadmin.html',
                'gulp/temp-views/home_topbar.html',
                'gulp/temp-views/studentProfilePanel.html',
                'gulp/temp-views/studentHelpPanel.html',
                'gulp/temp-views/sandboxPanel.html',
                'gulp/temp-views/studentActivitiesPanel.html',
                'gulp/temp-views/teacherProfilePanel.html',
                'gulp/temp-views/teacherClassesPanel.html',
                'gulp/temp-views/teacherActivitiesPanel.html',
                'gulp/temp-views/teacherHelpPanel.html',
                'gulp/temp-views/groupAdminHelpPanel.html',
                'gulp/temp-views/groupAdminProfilePanel.html',
                'gulp/temp-views/groupAdminUsersPanel.html',
                'gulp/temp-views/groupAdminAppsPanel.html',
                'gulp/temp-views/managerProfilePanel.html',
                'gulp/temp-views/managerAppsPanel.html',
                'gulp/temp-views/managerUsersPanel.html',
                'gulp/temp-views/_newExercicesPanel.html',
                'gulp/temp-views/idePanel.html',
                'gulp/temp-views/home_footer.html',


            ]).pipe(concat('home.html'))
                .pipe(gulp.dest('classroom/'))
        } else {
            return gulp.src([
                'classroom/Views/header.html',
                'classroom/Views/sidebar_student.html',
                'classroom/Views/sidebar_teacher.html',
                'classroom/Views/sidebar_manager.html',
                'classroom/Views/sidebar_groupadmin.html',
                'classroom/Views/home_topbar.html',
                'classroom/Views/studentProfilePanel.html',
                'classroom/Views/studentHelpPanel.html',
                'classroom/Views/sandboxPanel.html',
                'classroom/Views/studentActivitiesPanel.html',
                'classroom/Views/teacherProfilePanel.html',
                'classroom/Views/teacherClassesPanel.html',
                'classroom/Views/teacherActivitiesPanel.html',
                'classroom/Views/teacherHelpPanel.html',
                'classroom/Views/groupAdminHelpPanel.html',
                'classroom/Views/groupAdminProfilePanel.html',
                'classroom/Views/groupAdminUsersPanel.html',
                'classroom/Views/groupAdminAppsPanel.html',
                'classroom/Views/managerProfilePanel.html',
                'classroom/Views/managerAppsPanel.html',
                'classroom/Views/managerUsersPanel.html',
                'classroom/Views/_newExercicesPanel.html',
                'classroom/Views/idePanel.html',
                'classroom/Views/home_footer.html',

            ]).pipe(concat('home.html'))
                .pipe(gulp.dest('classroom/'))
        }
    }

    /**
     * Remove the temp-views folder
     */
    removeTemporaryViewsFolder() {
        return new Promise((resolve, reject) => {
            if (this.pluginsList.length) {
                fs.rm(this.temporaryViewsFolder, {
                    recursive: true,
                    force: true
                }, () => resolve());
            } else {
                resolve();
            }
        });
    }
}

let autoBuildManager = new AutoBuildManager();

// Naming the tasks
const init = () => { return autoBuildManager.init() };
init.displayName = 'init';

const pluginViews = () => { return autoBuildManager.pluginViews() };
pluginViews.displayName = 'plugin views';

const pluginImages = () => { return autoBuildManager.pluginImages() };
pluginImages.displayName = 'plugin images';

const pluginCss = () => { return autoBuildManager.pluginCss() };
pluginCss.displayName = 'plugin css';

const pluginJs = () => { return autoBuildManager.pluginJs() };
pluginJs.displayName = 'plugin js';

const homeConcat = () => { return autoBuildManager.homeConcat() };
homeConcat.displayName = 'home concat';

const removeTemporaryViewsFolder = () => { return autoBuildManager.removeTemporaryViewsFolder() };
removeTemporaryViewsFolder.displayName = 'remove temporary views folder';

// Queueing all the tasks
autoBuild = gulp.series(
    init,
    pluginViews,
    pluginImages,
    pluginCss,
    pluginJs,
    homeConcat,
    removeTemporaryViewsFolder
);

autoBuild.displayName = "Classroom: gulp series";

module.exports = {
    autoBuild
};
