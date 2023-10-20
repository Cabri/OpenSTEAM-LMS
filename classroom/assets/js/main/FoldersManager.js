
class FoldersManager {
    /**
     * Creates an instance of Folders.
     * @public
     */
    constructor() {
        this.userFolders = [];
        this.viewModal = ["#create-folder-manager", "#delete-folder-manager", "#update-folder-manager"];
        this.actualFolder = null;
        this.treeFolder = $("#breadcrumb");
        this.dragula = null;
        this.parent = null;
        this.objectToMove = null;
        this.objectId = null;
        this.isSeek = false;
        this.icons = {}
    }

    init() {
        this.dragula = dragula();
        this.getAllUserFolders().then(res => {
            this.userFolders = res;
            setTimeout(() => {
                this.dragulaInitObjects();
            }, 200);
        })

        $('#dashboard-activities-teacher').on('click', () => {
            this.resetTreeFolders();
            if ($_GET('panel') == "classroom-dashboard-activities-panel-teacher") {
                this.createTreeFolders();
            }
        })

        $('body').on('click', '.folder-card', function () {
            if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
                let id = $(this).attr('data-id');
                foldersManager.openFolder(id);
            }
        })

        $('body').on('click', '.folder-list', function () {
            if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
                let id = $(this).attr('data-id');
                foldersManager.openFolder(id);
            }
        })
    }


    openFolderModal() {
        this.resetInputs();
        pseudoModal.openModal("folder-manager-modal");
        $("#create-folder-manager").show();
    }

    persistCreateFolder() {
        let name = $("#folder_create_name").val(),
            parent = this.actualFolder;

        if (name.length > 0 && name.length <= 31) {
            this.createFolder(name, parent).then(res => {
                if (!res.hasOwnProperty("error")) {
                    this.userFolders.push(res);
                    this.refreshSettings(this.actualFolder);
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.created", "success");
                } else {
                    if (res.error == "folderNameInvalid") {
                        displayNotification('#notif-div', "classroom.activities.foldersMessages.errorLenght", "error");
                    } else {
                        displayNotification('#notif-div', "classroom.activities.foldersMessages.errorCreate", "error");
                    }
                }
            })
        } else {
            displayNotification('#notif-div', "classroom.activities.foldersMessages.errorLenght", "error");
        }
    }

    persistDeleteFolder() {
        let id = this.actualFolder,
            parent = this.getFolderById(this.actualFolder).parentFolder;

        if ($("#validation-delete-folder").val() == $("#validation-delete-folder").attr("placeholder")) {
            this.deleteFolderById(id).then(res => {
                if (!res.hasOwnProperty("error")) {
                    this.getAllUserFolders().then(res => {
                        this.refreshSettings();
                        this.userFolders = res;
                        let backToId = parent ? parent.id : null;
                        this.goToFolder(backToId);
                    })
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.deleted", "success");
                } else {
                    displayNotification('#notif-div', "classroom.activities.foldersMessages.errorDelete", "error");
                }
            })
        } else {
            displayNotification('#notif-div', "manager.input.writeDelete", "error");
        }
    }

    persistUpdateFolder() {
        let id = this.actualFolder,
            name = $("#folder_update_name").val();

        this.updateFolderById(id, name).then(res => {
            if (!res.hasOwnProperty("error")) {
                this.replaceFolderData(res);
                let parentId = this.getFolderById(id).parentFolder != null ? this.getFolderById(id).parentFolder.id : null;
                this.refreshSettings(parentId);
                displayNotification('#notif-div', "classroom.activities.foldersMessages.updated", "success");
            } else {
                displayNotification('#notif-div', "classroom.activities.foldersMessages.errorUpdate", "error");
            }
        })
    }

    deleteFolder(folderId) {
        this.resetInputs();
        this.actualFolder = folderId;
        
        // display title of folder in deleting message
        const folderTitle = this.getFolderById(folderId).name;
        const options = `{"folderName": "${folderTitle}"}`;
        document.getElementById('delete-folder-text').setAttribute("data-i18n-options", options);

        pseudoModal.openModal("folder-delete-modal");
    }

    updateFolder(folderId) {
        this.resetInputs();
        this.actualFolder = folderId;
        let folder = this.getFolderById(folderId);
        $("#folder_update_name").val(folder.name);
        pseudoModal.openModal("folder-manager-modal");
        $("#update-folder-manager").show();
    }

    refreshSettings(location = null) {
        this.parent = null;
        this.actualFolder = null;
        this.displayAndDragulaInitObjects();
        if (location) {
            this.goToFolder(location);
        }
        this.resetInputs();
    }

    resetInputs() {
        this.viewModal.forEach(view => {
            $(view).hide();
        });

        $("#folder_create_name").val("");
        $("#folder_update_name").val("");
        $("#folders-tree-content-modal").html("");
        $("#folders-seek-tree-content-modal").html("");
        $('#validation-delete-folder').val("");

        pseudoModal.closeAllModal();
    }

    seekFolderModal() {
        this.moveToFolderModal(null, null, true);
        pseudoModal.openModal("folders-seek");
    }

    persistGoToSelected() {
        let folderId = $("input[name='tree-structure']:checked").attr("data-id");
        if (folderId == "0") {
            folderId = null;
        }
        this.goToFolder(folderId);
        this.resetInputs();
    }
    /**
     * Utils
     */

    getFolderById(id) {
        return this.userFolders.find(folder => folder.id == id);
    }

    replaceFolderData(folder) {
        let index = this.userFolders.findIndex(f => f.id == folder.id);
        this.userFolders[index] = folder;
    }

    openFolder(folderId) {
        this.actualFolder = folderId;
        this.addTreeFolder(this.getFolderById(folderId));
        this.displayAndDragulaInitObjects();
    }

    addTreeFolder(folder) {
        if (this.treeFolder.html() == "") {
            this.resetTreeFolders();
        }

        let breadCrumbFolderItems = document.querySelectorAll(".folder-breadcrumb-item"),
            alreadyExist = false;

        breadCrumbFolderItems.forEach(e => {
            if (e.dataset.id == folder.id) {
                alreadyExist = true;
            }
        });
        
        if (!alreadyExist) {
            this.treeFolder.append(`<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span> <button class="btn c-btn-outline-primary folder-breadcrumb-item" data-id="${folder.id}" onclick="foldersManager.goToFolder(${folder.id})"><i class="fas fa-folder-open folder-breadcrumb"></i> ${folder.name}</button>`);  
        }
    }

    goToFolder(folderId) {
        this.resetDashboardList();
        this.actualFolder = folderId;
        this.resetTreeFolders();
        if (folderId != null) {
            this.createTreeFolders();
        }
        this.displayAndDragulaInitObjects();
    }

    resetDashboardList() {
        document.getElementById("list-activities-teacher").innerHTML = "";
    }

    deleteFolderFromUserFolders(id) {
        let index = this.userFolders.findIndex(f => f.id == id);
        this.userFolders.splice(index, 1);
    }

    resetTreeFolders() {
        // only feed the breadcrumb when we're on the activity panel
        if ($_GET('nav') == 'dashboard-activities-teacher') {
            this.treeFolder.html(`<button class="btn c-btn-outline-primary" onclick="foldersManager.goToFolder(null)"
                data-i18n="classroom.ids.classroom-dashboard-activities-panel-teacher">
            </button>`);
        } else {
            this.treeFolder.html();
        }
        this.treeFolder.localize();
    }

    createTreeFolders() {
        let actualFolder = this.getFolderById(this.actualFolder),
            idOfParents = [actualFolder],
            parent = null;

        if (actualFolder != null && actualFolder.parentFolder != undefined) {
            parent = actualFolder.parentFolder;
        }

        while (parent) {
            idOfParents.push(parent);
            parent = this.getFolderById(parent.id).parentFolder;
        }

        if (this.treeFolder.html() == "") {
            this.resetTreeFolders();
        }

        idOfParents.reverse().forEach(folder => {
            if (folder != null && folder.id != undefined) {
                this.treeFolder.append(`<span class="chevron-breadcrumb"> <i class="fas fa-chevron-right"></i> </span>  <button class="btn c-btn-outline-primary" onclick="foldersManager.goToFolder(${folder.id})"><i class="fas fa-folder-open folder-breadcrumb"></i> ${folder.name}</button>`);
            }
        });
    }

    displayAndDragulaInitObjects() {
        Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(() => {
            teacherActivitiesDisplay();
            this.dragulaInitObjects();
        });
    }

    createRandomString() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    moveToFolderModal(id, itemType, seek = false) {
        this.objectToMove = itemType;
        this.objectId = id;
        this.isSeek = seek;

        const foldersWithoutParent = this.userFolders.filter(folder => folder.parentFolder == null);
        let folderTreeContent = !seek ? $("#folders-tree-content-modal") : $("#folders-seek-tree-content-modal"),
            content = "",
            rootFolderTranslation = i18next.t("classroom.activities.rootFolder");

        folderTreeContent.html("");
        if (foldersWithoutParent.length > 0) {
            let randomString = this.createRandomString();
            content += `<ul id="folders-move-to-list">`;
            content += `<li>
                            <input type="radio" name="tree-structure" data-id="0" id="${randomString}">
                                <label for="${randomString}">${rootFolderTranslation}</label>
                            </input>
                            
                        `;
            foldersWithoutParent.forEach(folder => {
                content += this.makeContentForTree(folder);
            });

            content += `</li></ul>`;
        }
        folderTreeContent.html(content);
        pseudoModal.openModal("folders-move-to");
    }
    // ${seek ? "" : this.createChildActivitiesUl(null)}

    createChildUl(folder) {
        let children = this.userFolders.filter(f => f.parentFolder != null),
            content = "";
        children = children.filter(child => child.parentFolder.id == folder);
        if (children.length > 0) {
            content += `<li>`;
            children.forEach(child => {
                content += this.makeContentForTree(child);
            });
            content += `</li>`;
        }
        return content;
    }

    makeContentForTree(item) {
        let radioString = this.makeTreeWithOutInitialFolderAndChildren(item);
        let content = `<ul>
                        ${radioString}
                        
                        ${this.createChildUl(item.id)}
                    </ul>`
        return content;
    }
    // ${this.isSeek ? "" : this.createChildActivitiesUl(item.id)}

    makeTreeWithOutInitialFolderAndChildren(folder) {
        let content = "",
            randomString = this.createRandomString(),
            isOneOfParents = false,
            hasParentFolder = folder.parentFolder != null;

        // check if the folder is a parents of the actual folder
        let folderToCheck = folder;
        while (hasParentFolder) {
            let parentFolder = this.getFolderById(folderToCheck.parentFolder.id);
            if (parentFolder.id == this.objectId) {
                isOneOfParents = true;
            }
            hasParentFolder = parentFolder.parentFolder != null;
            if (hasParentFolder) {
                folderToCheck = parentFolder;
            }
        }
        if ((folder.id == this.objectId && this.isSeek == false) || (isOneOfParents && this.isSeek == false)) {
            content = `<label>📁 - ${folder.name}</label>`;
        } else {
            content = `<input type="radio" name="tree-structure" id="${randomString}" data-id="${folder.id}">
                                <label for="${randomString}"><i class="fas fa-folder-open folder-breadcrumb"></i> - ${folder.name}</label>
                            </input>`;
        }
        return content;
    }

    createChildActivitiesUl(folder) {
        let myActivities = Main.getClassroomManager()._myTeacherActivities,
            children = [],
            content = "";

        if (folder != null) {
            children = myActivities.filter(child => child.folder != null);
            children = children.filter(child => child.folder.id == folder);
        } else {
            children = myActivities.filter(child => child.folder == null);
        }

        if (children.length > 0) {
            content += `<ul>`;
            children.forEach(child => {
                console.log(child);
                content += `<li>
                                <label> <img src="${this.icons.hasOwnProperty(child.type) ? this.icons[child.type] : "💻"}" alt="${child.type}" class="folder-icons"> ${child.title}</label>
                            </li>`;
            });
            content += `</ul>`;
        }
        return content;
    }

    persistMoveToFolder() {
        let folderId = $("input[name='tree-structure']:checked").attr("data-id");
        if (folderId == "0") {
            folderId = null;
        }
        if (this.objectToMove == "folder") {
            this.moveFolderToFolder(this.objectId, folderId).then(res => {
                this.manageResponseFromMoved(res);
            })
        } else if (this.objectToMove == "activity") {
            this.moveActivityToFolder(this.objectId, folderId).then(res => {
                this.manageResponseFromMoved(res);
            })
        } else if (this.objectToMove == "course") {
            this.moveCourseToFolder(this.objectId, folderId).then(resMove => {
                coursesManager._requestGetMyCourseTeacher().then((res) => {
                    coursesManager.myCourses = res;
                    this.manageResponseFromMoved(resMove);
                });
            })
        }
        this.resetInputs();
    }

    // WARNING
    manageResponseFromMoved(res) {
        if (!res.hasOwnProperty("error")) {
            this.getAllUserFolders().then(res => {
                this.userFolders = res;
                this.displayAndDragulaInitObjects();
                displayNotification('#notif-div', "classroom.activities.foldersMessages.movedTo", "success");
            })
        } else {
            displayNotification('#notif-div', "classroom.activities.foldersMessages.errorMovedTo", "success");
        }
    }

    dragulaInitObjects() {
        // Reset the dragula fields
        this.dragula.containers = [];

        let foldersArray = document.querySelectorAll('.folder-item'),
            activitiesArray = document.querySelectorAll('.activity-item'),
            activitiesListArray = document.querySelectorAll('.folder-item-list'),
            foldersListArray = document.querySelectorAll('.activity-item-list'),
            coursesListArray = document.querySelectorAll('.course-item-list'),
            coursesArray = document.querySelectorAll('.course-item'),
            dragableObjects = [],
            viewMode = null;


        // sometime classroomManager is not loader
        if (Main.getClassroomManager() != null) {
            viewMode = Main.getClassroomManager().displayMode; 
        } else {
            viewMode = localStorage.getItem('classroomViewMode') != null ? localStorage.getItem('classroomViewMode') : 'card'
        }

        if (viewMode == "list") {
            dragableObjects = [...foldersListArray, ...activitiesListArray, ...coursesListArray];
        } else {
            dragableObjects = [...foldersArray, ...activitiesArray, ...coursesArray, ];
        }


        dragableObjects.forEach(object => {
            object.style.touchAction = "none";
        });

        this.dragula = dragula(dragableObjects)
            .on('drop', function(el, target, source) {
                if (target != undefined && source != undefined) {
                    if ($(target).hasClass("folder-item") || $(target).hasClass("folder-item-list")) {
                        let elId = source.getAttribute('data-id'),
                            targetId = target.getAttribute('data-id');
                        
                        if ($(source).hasClass("folder-item") || $(source).hasClass("folder-item-list")) {
                            foldersManager.moveFolderToFolder(elId, targetId).then(res => {
                                foldersManager.manageResponseFromMoved(res);
                            })
                        } else if ($(source).hasClass("activity-item") || $(source).hasClass("activity-item-list")) {
                            foldersManager.moveActivityToFolder(elId, targetId).then(res => {
                                foldersManager.manageResponseFromMoved(res);
                            })
                        } else if ($(source).hasClass("course-item") || $(source).hasClass("course-item-list")) {
                            foldersManager.moveCourseToFolder(elId, targetId).then(resMove => {
                                coursesManager._requestGetMyCourseTeacher().then((res) => {
                                    coursesManager.myCourses = res;
                                    foldersManager.manageResponseFromMoved(resMove);
                                });
                            })
                        }
                    } else {
                        foldersManager.displayAndDragulaInitObjects();
                    }
                } else {
                    foldersManager.displayAndDragulaInitObjects();
                }
            }).on('shadow', function(el) { 
                document.querySelectorAll('.gu-transit').forEach(element => {
                    element.style.display = "none";
                })
            }).on('cancel', function() {
                foldersManager.displayAndDragulaInitObjects();
            }).on('over', function(el, container) {
                if (Main.getClassroomManager().displayMode == "list") {
                    if ($(container).hasClass("folder-item-list")) {
                        $(container).find(".folder-list").find(".list-folder-img-manager").attr("src", `${_PATH}assets/media/folders/folder_open_icon.svg`);
                        SVGInject($(container).find(".folder-list").find(".list-folder-img-manager"));
                    }
                } else {
                    if ($(container).hasClass("folder-item")) {
                        $(container).find(".folder-card").addClass('folder-open');
                    }
                }
            }).on('out', function(el, container) {
                if (Main.getClassroomManager().displayMode == "list") {
                    if ($(container).hasClass("folder-item-list")) {
                        $(container).find(".folder-list").find(".list-folder-img-manager").attr("src", `${_PATH}assets/media/folders/folder_close_icon.svg`);
                        SVGInject($(container).find(".folder-list").find(".list-folder-img-manager"));
                    }
                } else {
                    if ($(container).hasClass("folder-item")) {
                        $(container).find(".folder-card").removeClass('folder-open');
                    }
                }
            })
    }


    displayModeSwitch(display)  {
        if (display == "list") {
            Main.getClassroomManager().displayMode = "list";
            localStorage.setItem('classroomViewMode', "list");
            this.displayAndDragulaInitObjects();
        } else {
            Main.getClassroomManager().displayMode = "card";
            localStorage.setItem('classroomViewMode', "card");
            this.displayAndDragulaInitObjects();
        }
    }


    /**
     * XHR
    */

    createFolder($name, $parent = null) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=create_folder",
                data: {
                    name: $name,
                    parent: $parent
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    deleteFolderById(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=delete_folder",
                data: {
                    id: id,
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    updateFolderById(id, $name) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=update_folder",
                data: {
                    id: id,
                    name: $name
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getAllUserFolders() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get_all_user_folders",
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    moveActivityToFolder(activityId, folderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=moveActiToFolder",
                data: {
                    activityId: activityId,
                    folderId: folderId
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    moveFolderToFolder(folderId, destinationFolderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=moveFolderToFolder",
                data: {
                    folderId: folderId,
                    destinationFolderId: destinationFolderId
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    moveCourseToFolder(courseId, folderId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=moveCourseToFolder",
                data: {
                    courseId: courseId,
                    folderId: folderId
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }
}
// Initialize
const foldersManager = new FoldersManager();
foldersManager.init();


