window.localStorage.classroomActivity = null
window.localStorage.autocorrect = false
let Activity = {
    autocorrection: false
}

function $_GET(param) {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );
    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

$(document).ready(function () {
    $(".dropdown-toggle").dropdown();
});
let ClassroomSettings = {
    willAutocorrect: false,
    lastPage: [],
    isEvaluation: true,
    studentCount: 0,
    activity: false,
    activityInWriting: false,
    status: null,
    classroom: null,
    project: null,
    firstLevel: ["classroom-dashboard-activities-panel-teacher",
        "classroom-dashboard-classes-panel-teacher",
        "classroom-dashboard-sandbox-panel",
        "classroom-dashboard-profil-panel-teacher",
        "classroom-dashboard-activities-panel",
        "classroom-dashboard-profil-panel",
        "classroom-dashboard-help-panel",
    ],
    teacherPanels: ['classroom-dashboard-activities-panel-teacher', 'classroom-dashboard-activities-panel-library-teacher', 'classroom-dashboard-new-activity-panel', 'classroom-dashboard-new-activity-panel2', 'classroom-dashboard-new-course-panel2', 'classroom-dashboard-new-activity-panel3', 'classroom-dashboard-form-classe-panel', 'classroom-dashboard-classes-panel-teacher', 'classroom-table-panel-teacher', 'classroom-dashboard-help-panel-teacher', 'classroom-dashboard-profil-panel-teacher', 'classroom-table-panel-teacher-code'

    ],
    studentPanels: ['classroom-dashboard-activities-panel', 'classroom-dashboard-activity-panel-success', 'classroom-dashboard-activity-panel-fail', 'classroom-dashboard-activity-panel-correcting', 'classroom-dashboard-help-panel', 'classroom-dashboard-profil-panel', ''

    ],
    mixPanels: ['classroom-dashboard-ide-panel', 'classroom-dashboard-sandbox-panel', 'classroom-dashboard-sandbox-creation', 'classroom-dashboard-activity-panel'],
    managerPanels: ['manager-dashboard-main', 'manager-apps-main', 'classroom-dashboard-profil-panel-manager'],
    groupAdminPanels: ['groupadmin-dashboard-users', 'groupadmin-apps-main', 'classroom-dashboard-profil-panel-groupadmin', 'groupadmin-dashboard-help'],
    treeStructure: {
        "classroom-dashboard-activities-panel-teacher": {
            "classroom-dashboard-new-activity-panel": {},
            "classroom-dashboard-new-activity-panel3": {},
            "classroom-dashboard-new-activity-panel2": {},
            "classroom-dashboard-activity-panel": {}
        },
        "classroom-dashboard-classes-panel-teacher": {
            "classroom-dashboard-form-classe-panel": {},
            "classroom-table-panel-teacher": {
                "classroom-table-panel-teacher-code": {}
            }
        },
        "classroom-dashboard-sandbox-panel": {
            "classroom-dashboard-sandbox-creation": {},
            "classroom-dashboard-ide-panel": {}
        },
        "classroom-dashboard-profil-panel-teacher": {
            "classroom-dashboard-account-panel-teacher": {},
            "classroom-dashboard-help-panel-teacher": {}
        },
        "classroom-dashboard-activities-panel": {
            "classroom-dashboard-activity-panel": {}
        },
        "classroom-dashboard-profil-panel": {},
        "classroom-dashboard-help-panel": {}
    }
}
let Breadcrumb = {
    "dashboard-activities": "classroom-dashboard-activities-panel",
    "dashboard-sandbox": "classroom-dashboard-sandbox-panel",
    "dashboard-help": "classroom-dashboard-help-panel",
    "dashboard-profil": "classroom-dashboard-profil-panel",
    "dashboard-activities-teacher": "classroom-dashboard-activities-panel-teacher",
    "dashboard-classes-teacher": "classroom-dashboard-classes-panel-teacher",
    "dashboard-sandbox-teacher": "classroom-dashboard-sandbox-panel",
    "dashboard-profil-teacher": "classroom-dashboard-profil-panel-teacher"
}

let displayPanel = new DisplayPanel()
let URLServer = window.location.origin
if (/[0-9a-z]{5}/.test($_GET('option'))) {
    ClassroomSettings.classroom = $_GET('option')
}
if (/WK[0-9]{1,9}/.test($_GET('option'))) {
    ClassroomSettings.activity = $_GET('option')
}
if (/AC[0-9]{1,9}/.test($_GET('option'))) {
    ClassroomSettings.exercise = $_GET('option')
}

if (/[0-9a-z]{13}/.test($_GET('option'))) {
    ClassroomSettings.project = $_GET('option')
}

$('.classroom-navbar-button').click(function () {
    try {
        pseudoModal.closeAllModal()
    } catch (e) {
        console.log('pseudoModal is not defined')
    }
})
$('#return-last-panel').click(function () {
    ClassroomSettings.lastPage.shift()
    let lastPage = ClassroomSettings.lastPage.shift()
    navigatePanel(lastPage.history, lastPage.navbar)

})
$('body').on('click', '.breadcrumb-clickable', function (e) {
    if (e.target.getAttribute('data-nav') && e.target.getAttribute('data-panel')) {
        navigatePanel(e.target.getAttribute('data-panel'), e.target.getAttribute('data-nav'));
    }
})
$('body').on('mouseenter mouseleave', '.dropdown-act', function () {
    $(this).find('.span-act').toggle()
    $(this).find('.fa-cog').toggle()
})

$('input[type=radio][name=isEval-activity-form]').change(function () {
    if (ClassroomSettings.isEvaluation == true) {
        ClassroomSettings.isEvaluation = false
    } else {
        ClassroomSettings.isEvaluation = true
    }
});

function autocorrectSwitch() {
    if (ClassroomSettings.willAutocorrect == true) {
        ClassroomSettings.willAutocorrect = false
    } else {
        ClassroomSettings.willAutocorrect = true
    }
}

$('body').on('click', '.fa-share', function () {
    ClassroomSettings.project = $(this).attr('data-link')
    if (UserManager.getUser().isRegular) {
        $('#list-student-share-modal').html('')
        Main.getClassroomManager()._myClasses.forEach(element => {
            $('#list-student-share-modal').append(classeList(element))
        })
        pseudoModal.openModal('share-project-modal')
    } else {
        if (!Main.getClassroomManager()._myTeachers) {
            Main.getClassroomManager().getTeachers(Main.getClassroomManager()).then(function () {
                Main.getClassroomManager().shareProject(ClassroomSettings.project, [Main.getClassroomManager()._myTeachers[0].user.id]).then(function () {
                    displayNotification('#notif-div', "classroom.notif.shareProjectTeacher", "success")

                })

            })
        } else {
            Main.getClassroomManager().shareProject(ClassroomSettings.project, [Main.getClassroomManager()._myTeachers[0].user.id]).then(function () {
                displayNotification('#notif-div', "classroom.notif.shareProjectTeacher", "success")

            })
        }
    }
})

/**
 * Go back to the current classroom from the code display panel
 */
function backToClassroomFromCode() {
    let link = ClassroomSettings.classroom;
    if (link) {
        navigatePanel('classroom-table-panel-teacher', 'dashboard-classroom-teacher', link);
    }
}

/**
 * Navigate trough panels
 * @param {string} id - The destination panel
 * @param {string} idNav - The destination nav (the current "tab")
 * @param {string} option - The option (current classroom, activity etc.)
 * @param {string} interface - The interface (if the target is an interface or an activity using one)
 * @param {boolean} skipConfirm - If set to true, the exit confirmation prompt won't be displayed
 * @param {boolean} isOnpopstate - If set to true, the current navigation won't be saved in history (dedicated to onpopstate events)
 */
function navigatePanel(id, idNav, option = "", interface = '', isOnpopstate = false) {
    // If there is any working activity tracker, send the tracking data and stop it
    if (typeof Main.activityTracker != 'undefined' && Main.activityTracker.getIsTracking()) {
        Main.activityTracker.saveTimePassed();
        Main.activityTracker.stopActivityTracker();
    }
    $('.classroom-navbar-button').removeClass("active");
    $('.dashboard-block').hide();
    $('#' + id).show();
    $('#' + idNav).addClass("active");
    if (id == 'resource-center-classroom') {
        $('#classroom-dashboard-activities-panel-library-teacher').html('<iframe id="resource-center-classroom" src="/learn/?use=classroom" frameborder="0" style="height:80vh;width:80vw"></iframe>');
    }
    ClassroomSettings.lastPage.unshift({
        history: id,
        navbar: idNav
    });
    if ($_GET('panel') == 'classroom-dashboard-activity-panel') {
        document.querySelector('#activity-content').innerHTML = '';
    }
    let state = {};
    var title = '';
    let endUrl = idNav;
    if (option != "") {
        endUrl += '&option=' + option;
    }
    if (id == 'classroom-dashboard-ide-panel' || id == 'classroom-dashboard-activity-panel') {
        endUrl += '&interface=' + interface;
    }
    let link = window.location.origin + window.location.pathname + "?panel=" + id + "&nav=" + endUrl;
    if (!isOnpopstate) {
        history.pushState(state, title, link);
    }
    let formateId = id.replace(/\-/g, '_');
    if (displayPanel[formateId]) {
        displayPanel[formateId](option);
    }
    // Breadcrumb management
    let breadcrumbElt = document.getElementById('breadcrumb');
    let innerBreadCrumbHtml = '';
    let currentBreadcrumbStructure = findCurrentPanelInTreeStructure(id, ClassroomSettings.treeStructure);
    for (let i = 0; i < currentBreadcrumbStructure.length - 1; i++) {
        // Define the last element of the breadcrumb
        if (i == currentBreadcrumbStructure.length - 2) {
            innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary" onclick="navigatePanel('${currentBreadcrumbStructure[i]}', '${idNav}')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span></button>`;
            // Define all the elements of the breadcrumb except the last
        } else {
            innerBreadCrumbHtml += `<button class="btn c-btn-outline-primary last" onclick="navigatePanel('${currentBreadcrumbStructure[i]}', '${idNav}')"><span data-i18n="[html]classroom.ids.${currentBreadcrumbStructure[i]}">${currentBreadcrumbStructure[i]}</span><i class="fas fa-chevron-right ml-2"></i></button>`;
        }
    }
    breadcrumbElt.innerHTML = innerBreadCrumbHtml;
    $('#breadcrumb').localize();

    $('.tooltip').remove()
    $('.leader-line').remove()
    $('[data-toggle="tooltip"]').tooltip()
}

/**
 * History navigation
 */
window.onpopstate = () => {
    if ($_GET('panel') && $_GET('nav')) {
        navigatePanel($_GET('panel'), $_GET('nav'), option = $_GET('option'), interface = $_GET('interface'), true);
    }
};

/**
 * Browse the tree structure to find the path to the current panel
 * @param {string} searchedPanel - The current panel id
 * @param {object} treeStructure - The tree structure (ClassroomSettings.treeStructure)
 * @param {string} currentPanel - Don't give any argument to this parameter (it's used by the recursion)
 * @param {array} history - Don't give any argument to this parameter (it's used by the recursion)
 * @returns {array} - Returns the array containing the path to the current panel
 */
function findCurrentPanelInTreeStructure(searchedPanel, treeStructure = null, currentPanel = null, history = []) {
    // Init
    if (currentPanel == null) {
        currentPanel = treeStructure;
    }

    // Loop with recursivity
    for (let child in currentPanel) {
        history.push(child);
        if (searchedPanel == child) {
            return history;
        } else {
            if (typeof (currentPanel[child]) === 'object') {
                let result = findCurrentPanelInTreeStructure(searchedPanel, currentPanel, currentPanel[child], history);
                if (result != false) {
                    return result;
                }
            }
            history.pop();
        }
    }
    return false;
}

// Add activity modal (Classroom management) -> Resource Bank button
function goToResourceBank() {
    Modal.prototype.closeAllModal();
    navigatePanel('classroom-dashboard-activities-panel-library-teacher', 'dashboard-activity-teacher');
}

// Add activity modal (Classroom management) -> Resource Bank button
function goToActivityPanel() {
    Modal.prototype.closeAllModal();
    navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
}

// Add activity modal (Classroom management) -> Resource Bank button
function goToCreateActivityPanel() {
    Modal.prototype.closeAllModal();
    navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher');
}

//prof-->demoStudent
function modeApprenant() {
    window.localStorage.showSwitchTeacherButton = 'true';
    Main.getClassroomManager().getDemoStudent(ClassroomSettings.classroom)
}

$('body').on('change', '#list-classes input', function () {
    ClassroomSettings.classroom = $(this).val()
})

$('body').on('change', '#is-anonymised', anonymizeStudents);

function anonymizeStudents() {
    let index = 1;
    if ($('#is-anonymised').is(':checked')) {
        $('.username').each(function (el) {
            $('.username')[el].children[0].setAttribute('src', _PATH + 'assets/media/alphabet/A.png')
            $('.username')[el].children[0].setAttribute('alt', '')
            $('.username')[el].children[0].setAttribute('anonymized', 'true')
            $('.username')[el].children[1].innerHTML = "Elève n° " + index
            $('.username')[el].children[1].setAttribute('title', '')
            index++
        })
    } else {
        let students = getClassroomInListByLink(ClassroomSettings.classroom)[0].students;
        displayStudentsInClassroom(students);
    }
}

function listeModeApprenant() {
    pseudoModal.openModal('list-classes-modal')
}

//demoStudent-->prof
function modeProf() {
    Main.getClassroomManager().getTeacherAccount(ClassroomSettings.classroom).then(() => {
        window.localStorage.showSwitchTeacherButton = 'false';
    });
}

// Hide the switch teacher mode button when irrelevant
if (document.getElementById('teacherSwitchButton') && window.localStorage.showSwitchTeacherButton == 'true') {
    document.getElementById('teacherSwitchButton').style.display = 'block';
}

if (document.getElementById('settings-student') && window.localStorage.showSwitchTeacherButton == 'true') {
    document.getElementById('settings-student').style.display = 'none';
}

$('#code-copy').click(function () {
    let self = $(this)
    docopy(self)
})

// .new-student-modal removed
$('body').on('click', '#add-student-dashboard-panel', function () {
    pseudoModal.openModal('add-student-modal');
});


if (document.querySelector('#update-classroom-student-button')) {
    document.querySelector('#update-classroom-student-button').addEventListener('click', (e) => {
        e.preventDefault();
        pseudoModal.openModal('update-classroom-student-modal');
    });

    document.querySelector('#create-classroom-student-button').addEventListener('click', (e) => {
        e.preventDefault();
        pseudoModal.openModal('create-classroom-student-modal');
    });
}




//banque de ressources-->copier une activité
window.addEventListener('storage', () => {
    if (window.localStorage.copyActivity) {
        Activity = JSON.parse(window.localStorage.copyActivity)
        Activity.isFromClassroom = true
        delete window.localStorage.copyActivity
        if (Activity.array) {
            Main.getClassroomManager().addActivities(Activity).then(function (response) {
                for (let i = 0; i < response.length; i++) {
                    addTeacherActivityInList(response[i])
                }
                teacherActivitiesDisplay()
                displayNotification('#notif-div', "classroom.notif.addActivities", "success")
            })
        } else {
            /* i18next.t("classroom.notif.saveProject") */
            Main.getClassroomManager().addActivity(Activity).then(function (response) {
                if (response.errors) {
                    for (let error in response.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    }
                } else {
                    addTeacherActivityInList(response);
                    teacherActivitiesDisplay();
                    displayNotification('#notif-div', "classroom.notif.addActivity", "success");
                }
            })
        }
    }
    //new sandbox--> save
    try {
        addProjectInList(JSON.parse(window.localStorage.saveProject))
        delete window.localStorage.saveProject
    } catch (e) {}
})

//profil prof-->paramètres
$('#settings-teacher').click(function () {
    if (UserManager.getUser().isFromGar) {
        if (document.getElementById('teacher-account-button')) {
            document.getElementById('teacher-account-button').style.display = 'none';
        }
        if (document.querySelector('[data-i18n="classroom.modals.settingsTeacher.description"]')) {
            document.querySelector('[data-i18n="classroom.modals.settingsTeacher.description"]').style.display = 'none';
        }
    }
    pseudoModal.openModal('settings-teacher-modal');
});

//profil élève-->paramètres
$('#settings-student').click(function () {
    getAndDisplayStudentPassword('#password-display-area');
    pseudoModal.openModal('settings-student-modal');
});

document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
    if (e.target.id == 'pwd-change-modal') {
        e.stopPropagation();
        resetStudentPassword('#password-display-area');
    }
});

//profil prof-->aide
$('#help-teacher').click(function () {
    navigatePanel('classroom-dashboard-help-panel-teacher', 'dashboard-profil-teacher')

})
//dropdow-accessibility
$('#accessDropdown').click(function () {
    $('#access-dropdown').toggle()
})

var accessForm = document.querySelector('#access-form');
if (accessForm) {
    accessForm.addEventListener("change", function (e) {
        updateWebsiteAcessibility($(this));
    });
}

//navbar prof-->new sandbox
$('.open-ide').click(function () {
    let option = $(this).attr('data-interface')
    if (UserManager.getUser().isRegular) {
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox-teacher', option)
    } else {
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', option)
    }
})
//sandbox-->projet
$('body').on('click', '.sandbox-card', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        ClassroomSettings.project = $(this).attr('data-href').replace(/.+link=([0-9a-z]{13}).+/, '$1')
        ClassroomSettings.interface = $(this).attr('data-href').replace(/.+(arduino|python|microbit|adacraft|stm32|esp32).+/, '$1')
        if (UserManager.getUser().isRegular) {
            navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox-teacher', ClassroomSettings.project, ClassroomSettings.interface)
        } else {
            navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', ClassroomSettings.project, ClassroomSettings.interface)
        }
    }
})
//sandbox dropdown-->delete
$('body').on('click', '.modal-teacherSandbox-delete', function () {
    let confirm = window.confirm("Etes vous sur de vouloir supprimer le projet?")
    if (confirm) {
        let link = $(this).parent().parent().parent().parent().attr('data-href').replace(/\\(arduino|microbit|python|adacraft|stm32|esp32)\\\?link=([0-9a-f]{13})/, "$2")
        Main.getClassroomManager().deleteProject(link).then(function (project) {
            deleteSandboxInList(project.link)
            sandboxDisplay()
            displayNotification('#notif-div', "classroom.notif.deleteProject", "success")
        })
    }
})
//increment counter when selecting student
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('student-id') || e.target.classList.contains('list-students-classroom')) {
        let selectedStudentNumber = 0, 
        studentCheckboxesElts = document.querySelectorAll('#list-student-attribute-modal .student-id');
        for (let checkboxElt of studentCheckboxesElts) {
            if (checkboxElt.checked) selectedStudentNumber++;
        }
        for (let numberDisplayElt of document.querySelectorAll('.student-number')) {
            numberDisplayElt.innerHTML = selectedStudentNumber;
        }
        if(selectedStudentNumber > 0) {
            document.querySelector('#attribute-activity-to-students').removeAttribute('disabled');
        } else {
            document.querySelector('#attribute-activity-to-students').setAttribute('disabled', '');
        }
    }
});

//sandbox dropdown-->duplicate
$('body').on('click', '.modal-teacherSandbox-duplicate', function () {
    let link = $(this).parent().parent().parent().parent().attr('data-href')
    link = link.replace(/.+link=([0-9a-f]{13}).+/, '$1')
    ClassroomSettings.interface = $(this).parent().parent().parent().parent().attr('data-href').replace(/.+(arduino|python|microbit|adacraft|stm32|esp32).+/, '$1')
    Main.getClassroomManager().duplicateProject(link).then(function (project) {
        ClassroomSettings.project = project.link
        addSandboxInList(project)
        navigatePanel('classroom-dashboard-ide-panel', 'dashboard-sandbox', project.link, ClassroomSettings.interface)

    })
})

//sandbox dropdown-->share
$('body').on('click', '#share-project-to-students-close', function () {
    let linkProject = ClassroomSettings.project
    let usersInput = $(this).parent().find(".student-id")
    let idUsers = []
    usersInput.each(function () {
        if ($(this).is(':checked')) {
            idUsers.push($(this).val())
        }
    })
    Main.getClassroomManager().shareProject(linkProject, idUsers).then(function (project) {
        displayNotification('#notif-div', "classroom.notif.shareProject", "success")
        $('.student-number').html(0)
        pseudoModal.closeAllModal()
    })
})

//navbar-->mes activités
$('#dashboard-activities, .activity-panel-link').click(function () {
    navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities')
})
//activity-->validate
// Add more validate options for the activities 


function defaultProcessValidateActivity() {
    $("#activity-validate").attr("disabled", "disabled");
    let interface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)
    if (interface == undefined || interface == null) {
        correction = 2
        Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 3).then(function (activity) {
            if (typeof activity.errors != 'undefined') {
                for (let error in activity.errors) {

                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    $("#activity-validate").attr("disabled", false);
                }
            } else  {
                navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities');
                actualizeStudentActivities(activity, correction);
                $("#activity-validate").attr("disabled", false);
            }
        })
        window.localStorage.classroomActivity = null
    } else if (Activity.autocorrection == false) {
        correction = 1
        let interface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)[2]
        let project = window.localStorage[interface + 'CurrentProject']
        Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interface, Activity.id).then(function (activity) {
            if (typeof activity.errors != 'undefined') {
                for (let error in activity.errors) {
                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    $("#activity-validate").attr("disabled", false);
                }
            } else  {
                actualizeStudentActivities(activity, correction)
                $("#activity-validate").attr("disabled", false);
                navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
            }
        })
    } else {

        $("#activity-validate").attr("disabled", false);
        window.localStorage.autocorrect = true
    }
}

function saveActivity() {
    $("#activity-save").attr("disabled", true);
    correction = 0
    let interface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)[2]
    let project = window.localStorage[interface + 'CurrentProject']
    Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interface, Activity.id, correction).then(function (activity) {
        actualizeStudentActivities(activity, correction)
        $("#activity-save").attr("disabled", false);
        displayNotification('#notif-div', "classroom.notif.savedProject", "success")
        Main.getClassroomManager().getStudentActivities(Main.getClassroomManager()).then(() => {
            let navParam = {
                "panel": $_GET('panel'),
                "nav": $_GET('nav'),
                "option": $_GET('option'),
                "interface": 'savedActivities'
            };
            navigatePanel(navParam.panel, navParam.nav, navParam.option, navParam.interface);
        });
    })
}

//sandbox-->créer une activité
$('body').on('click', '.sandbox-action-add', function () {
    if (UserManager.getUser().isRegular) {
        navigatePanel('classroom-dashboard-sandbox-creation', 'dashboard-sandbox-teacher')
    } else {
        navigatePanel('classroom-dashboard-sandbox-creation', 'dashboard-sandbox')
    }
})

function studentActivitiesDisplay() {

    let activities = Main.getClassroomManager()._myActivities;
    let index = 1;
    document.querySelector('#new-activities-list').innerHTML = '';
    document.querySelector('#current-activities-list').innerHTML = '';
    document.querySelector('#saved-activities-list').innerHTML = '';
    document.querySelector('#done-activities-list').innerHTML = '';

    activities.newActivities.forEach(element => {
        $('#new-activities-list').append(activityItem(element, "newActivities"))
        index++
    });

    activities.savedActivities.forEach(element => {
        $('#saved-activities-list').append(activityItem(element, "savedActivities"))
        index++
    });

    activities.currentActivities.forEach(element => {
        $('#current-activities-list').append(activityItem(element, "currentActivities"))
        index++
    });
    activities.doneActivities.forEach(element => {
        $('#done-activities-list').append(activityItem(element, "doneActivities"))
        index++
    });
    
    if (activities.doneActivities.length < 1) {
        $('#average-score').hide()
    } else {
        $('#number-activities-done').html(activities.doneActivities.length)
        $('#score-student').html($('#body-table-bilan .bilan-success').length)
        $('#average-score').show()
    }

    if (index == 1) {
        $('#bilan-student').hide()
    } else {
        $('#bilan-student').show()
    }

    $('[data-toggle="tooltip"]').tooltip()

}

function sandboxDisplay(projects = Main.getClassroomManager()._myProjects) {
    $('#sandbox-container-list').html(`
    <h3 class="section-title section-new">` + i18next.t('classroom.sandbox.mine') + ` </h3>
    <div id="mine-sandbox">
    </div>
    <h3 class="section-title section-current">` + i18next.t('classroom.sandbox.shared') + `</h3>
    <div id="shared-sandbox"></div>`)
    projects.forEach(element => {
        $('#mine-sandbox').append(teacherSandboxItem(element))
    });
    let sharedProjects = Main.getClassroomManager()._sharedProjects
    if (!sharedProjects.length) {
        if (UserManager.getUser().isRegular) {
            $('#shared-sandbox').html(`
            <p>${i18next.t('classroom.sandbox.teacherSharedDescription')}</p>
            `);
        } else {
            $('#shared-sandbox').html(`
            <p>${i18next.t('classroom.sandbox.studentSharedDescription')}</p>
            `);
        }
    }
    sharedProjects.forEach(element => {
        $('#shared-sandbox').append(teacherSandboxItem(element))
    });
}

function classroomsDisplay() {
    let noContentDiv = `
    <p class="no-content-div">
        <img src="${_PATH}assets/media/my_classes.svg" alt="Icône classe" class="hue-rotate-teacher"> 
        <b data-i18n="classroom.classes.noClasses">Vous n'avez pas encore de classe</b>
        <span id="no-content-div__bottom-text"  data-i18n="classroom.classes.createClassNow">Commencez par créer une classe dès maintenant !</span>
    </p>`

    // Hide the "add a class" button in the gar user context
    if (UserManager.getUser().isFromGar) {
        document.querySelector('.buttons-interactions button.teacher-new-classe').style.display = 'none';
        noContentDiv = `
        <p class="no-content-div">
            <img src="${_PATH}assets/media/my_classes.svg" alt="Icône classe" class="hue-rotate-teacher"> 
            <b data-i18n="classroom.classes.noClasses">Vous n'avez pas encore de classe</b>
        </p>`
    }

    // Display the classes from cached data
    $('.list-classes').html(``);
    let classes = Main.getClassroomManager()._myClasses;
    if (classes.length) {
        classes.forEach(classroom => {
            $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
        });
    } else {
        $('.list-classes').append(noContentDiv).localize();
    }
    // Get the classes from the database and refresh the panel it there are differences
    Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
        $('.list-classes').html(``);
        let classes = Main.getClassroomManager()._myClasses;
        if (classes.length) {
            classes.forEach(classroom => {
                $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
            });
        } else {
            $('.list-classes').append(noContentDiv).localize();

            startAttachment = LeaderLine.pointAnchor({
                element: document.getElementById('no-content-div__bottom-text'),
                x: -10,
            })
            endAttachment = LeaderLine.pointAnchor({
                element: document.getElementById('teacher-new-classroom-btn'),
                y: "110%"
            })

            new LeaderLine(
                startAttachment,
                endAttachment, {
                color: 'var(--classroom-primary)',
                path: "arc",
                startSocket: "left",
                endSocket: "bottom",
                endPlug: "arrow2",
                startSocketGravity: [50, -100]
            });
        }
    });
}

function teacherActivitiesDisplay(list = Main.getClassroomManager()._myTeacherActivities) {
    $('#list-activities-teacher').html(``)
    list.forEach(element => {
        $('#list-activities-teacher').append(teacherActivityItem(element))
    });
    $('[data-toggle="tooltip"]').tooltip()

}
$('body').on('change', '#action-teach-setting', function () {
    console.log('check')
})

/**
 * Toggle the block class mode (to lock/unlock the access to the classroom)
 */
function toggleBlockClass() {
    let currentClassroomLink = $_GET('option') ? $_GET('option') : ClassroomSettings.classroom;
    let classroom = getClassroomInListByLink(currentClassroomLink)[0].classroom;
    if (classroom.isBlocked == true) {
        classroom.isBlocked = false;
        $('#classroom-info > button:first-child').removeClass('greyscale');
        $('#classroom-info > button:first-child > i.fa').removeClass('fa-lock').addClass('fa-lock-open');
    } else {
        classroom.isBlocked = true;
        $('#classroom-info > button:first-child').addClass('greyscale');
        $('#classroom-info > button:first-child > i.fa').removeClass('fa-lock-open').addClass('fa-lock');

    }
    Main.getClassroomManager().updateClassroom(classroom).then(function (response) {
        console.log(`Classroom locked: ${response.isBlocked}`);
    });
}

function formatDay(da) {
    let d = new Date(da.date)
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
}

function formatHour(da) {
    let d = new Date(da.date)
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
        d.getHours() + ":" + d.getMinutes();
}

function docopy(self) {

    currentOriginUrl = new URL(window.location.href).origin;
    fullPath = currentOriginUrl + '/classroom/login.php?link=';
    document.getElementById('hidden-link-prefix').innerHTML = fullPath;
    // Cible de l'élément qui doit être copié
    var target = self[0].dataset.target;
    var fromElement = document.querySelector(target);
    if (!fromElement) return;
    $('#hidden-link-prefix').show()
    // Sélection des caractères concernés
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNode(fromElement);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        // Exécution de la commande de copie

        var result = document.execCommand('copy');
        if (result) {
            // La copie a réussi
        }
    } catch (err) {
        // Une erreur est surevnue lors de la tentative de copie
        alert(err);
    }

    // Fin de l'opération
    selection = window.getSelection();
    if (typeof selection.removeRange === 'function') {
        selection.removeRange(range);
    } else if (typeof selection.removeAllRanges === 'function') {
        selection.removeAllRanges();
    }
    $('#hidden-link-prefix').hide()
    displayNotification('#notif-div', "classroom.activities.copyLink", "success")
}

function returnToConnectionPanel(currentPanel) {
    if (window.getComputedStyle(document.getElementById('classroom-register-container')).display == 'block') {
        $('#classroom-register-container').hide();
    } else {
        $('#classroom-login-container').toggle();
    }
    $(currentPanel).toggle();
}

function findClassroomToConnect(linkC) {
    $('#classroom-login-container').toggle();
    Main.getClassroomManager().getClassroom(linkC).then(function (classroom) {
        let link = window.location.origin + window.location.pathname + '/?link=' + linkC
        $('#classroom-login-container-bis').toggle();
        let state = {};
        var title = '';
        history.pushState(state, title, link);
        if (classroom != false) {
            $('#classroom-desc').html('Classe ' + classroom[0].name + ", code " + classroom[0].link);
        } else {
            $('#classroom-desc').html(i18next.t("classroom.login.noClass"))

        }
    })
}

function sectionToggle(id) {

    $('#' + id + '-activities-list').toggle()
    $('#i-' + id).toggleClass('fa-chevron-down')
    $('#i-' + id).toggleClass('fa-chevron-up')


}

/**
 * Get the current student password from database and show it in the dedicated area
 * @param {string} querySelector - css selector
 */
function getAndDisplayStudentPassword(querySelector) {
    let userId = UserManager.getUser().id;
    if (userId) {
        Main.getClassroomManager().getStudentPassword(userId).then((response) => {
            if (response.errorType) {
                displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error");
            } else {
                displayStudentPassword(querySelector, response.password);
            }
        });
    } else {
        displayNotification('#notif-div', "classroom.notif.cantGetPassword", "error");
        displayStudentPassword(querySelector, '');
    }
}

/**
 * Display the password in the selected dom element
 * @param {string} querySelector - css selector
 * @param {string} password - password
 */
function displayStudentPassword(querySelector, password) {
    let displayArea = document.querySelector(querySelector);
    displayArea.value = password;
}

/**
 * Reset the current student password and show it in the dedicated area
 * @param {string} querySelector - css selector
 */
function resetStudentPassword(querySelector) {
    let userId = UserManager.getUser().id;
    if (userId) {
        Main.getClassroomManager().resetStudentPassword(userId).then((response) => {
            if (response.errorType) {
                displayNotification('#notif-div', `classroom.notif.${response.errorType}`, "error");
            } else {
                displayStudentPassword(querySelector, response.newPassword);
            }
        });
    } else {
        displayNotification('#notif-div', "classroom.notif.cantResetPassword", "error");
        displayStudentPassword(querySelector, '');
    }
}

/***************************/
/* manager & groupAdmin */
/***************************/

$('#create_group_manager').click(function () {
    pseudoModal.openModal('manager-create-group');
    // Clean input
    $('#group_name').val("");
    $('#group_desc').val("");
    optionsGroupApplications("create");
});

$('#settings-manager').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

$('#settings-groupadmin').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

function createGroupWithModal() {
    let $name = $('#group_name').val(),
        $description = $('#group_desc').val(),
        ApplicationsData = [];

    $("input:checkbox.form-check-input.app").each(function () {
        const ApplicationTemp = [$(this).val(),
            $(this).is(':checked'),
            $('#begin_date_' + $(this).val()).val(),
            $('#end_date_' + $(this).val()).val(),
            $('#max_students_per_teachers_' + $(this).val()).val(),
            $('#max_students_per_groups_' + $(this).val()).val(),
            $('#max_teachers_per_groups_' + $(this).val()).val(),
            $('#max_activities_per_groups_' + $(this).val()).val(),
            $('#max_activities_per_teachers_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });

    mainManager.getmanagerManager().createGroup($description, $name, JSON.stringify(ApplicationsData)).then((response) => {
        if (response.response == "success") {
            displayNotification('#notif-div', "manager.group.groupCreated", "success");
        } else {
            displayNotification('#notif-div', "manager.group.groupCreateFailed", "error");
        }
    });
    
    pseudoModal.closeAllModal();
    tempoAndShowGroupsTable()
}

function showupdateGroupModal(id) {
    mainManager.getmanagerManager().getGroupInfos(id).then(function (res) {
        mainManager.getmanagerManager()._actualGroup = res;
        pseudoModal.openModal('manager-update-group');
        optionsGroupApplications("update");
        $('#upd_group_name').val(res[0].name);
        $('#upd_group_desc').val(res[0].description);
        $('#upd_group_id').val(res[0].id);
        let url = window.location.origin + "/classroom/group_invitation.php?gc=" + res[0].link;
        $('#upd_group_link').val(url);
    });
}

function updateGroupWithModal() {
    let ApplicationsData = [];

    $("input:checkbox.form-check-input.app").each(function (element) {
        const ApplicationTemp = [$(this).val(),
            $(this).is(':checked'),
            $('#begin_date_' + $(this).val()).val(),
            $('#end_date_' + $(this).val()).val(),
            $('#max_students_per_teachers_' + $(this).val()).val(),
            $('#max_students_per_groups_' + $(this).val()).val(),
            $('#max_teachers_per_groups_' + $(this).val()).val(),
            $('#max_activities_per_groups_' + $(this).val()).val(),
            $('#max_activities_per_teachers_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });
    mainManager.getmanagerManager().updateGroup(
        $('#upd_group_id').val(),
        $('#upd_group_name').val(),
        $('#upd_group_desc').val(),
        JSON.stringify(ApplicationsData)
    ).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.group.groupUpdated", "success");
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "missing data date") {
            displayNotification('#notif-div', "manager.account.missingDataDate", "error");
        }
    })
    pseudoModal.closeAllModal()
    tempoAndShowGroupsTable()
}

$('#table_back_to_users').click(function () {
    $('#table_details_users').hide();
    $('#table_details_admins').show();
    $('#paginationButtons_users').hide();
    $('#paginationButtons_groups').show();
    $('#users_options').hide();
    $('#groups_options').show();
    $('#btn-create-manager').show();
    $('#table_info_group_data').html("");
    $('#paginationButtons_users').html("");
})

$('#table_back_to_users_groupadmin').click(function () {
    $('#groupadmin_groups').show();
    $('#group-monitoring').show();
    $('#table_details_users_groupadmin').hide();
})

$('#dashboard-manager-groups').click(() => {
    getGroupsManagerInfo();
})

function getGroupsManagerInfo() {
    let sort = $('#sort_groups_filter').val(),
    groupsperpage = $('#groups_per_page').val();
mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
}

$('#sort_users_filter, #users_per_page').on('change', () => {
    let $sort = $('#sort_users_filter').val(),
        $userspp = $('#users_per_page').val(),
        $group_id = mainManager.getmanagerManager()._actualGroup;
    mainManager.getmanagerManager().showGroupMembers($group_id, 1, $userspp, $sort);
})

$('#search_user').click(() => {
    let name = $('#name_user_search').val(),
        usersperpage = $('#users_per_page').val();
    if (name != "") {
        mainManager.getmanagerManager().globalSearchUser(name, 1, usersperpage);
    }
})

$('#name_user_search').on('change', () => {
    let name = $('#name_user_search').val(),
        sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_id = mainManager.getmanagerManager()._actualGroup;
    if (name == "") {
        mainManager.getmanagerManager().showGroupMembers(group_id, 1, usersperpage, sort);
    }
})

$('#name_group_search').on('change', () => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }
})

$('#sort_groups_filter, #groups_per_page').on('change', () => {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
})


$('#search_group').click(() => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    } else {
        mainManager.getmanagerManager().searchGroup(name, 1, groupsperpage, );
    }
})

$('#create_user_link_to_group_manager').click(function () {
    mainManager.getmanagerManager()._addedCreateUserGroup = 0;
    $('#group_add_sa').html("");
    $('#u_firstname').val("");
    $('#u_surname').val("");
    $('#u_bio').val("");
    $('#u_mail').val("");
    $('#u_pseudo').val("");
    $('#user_teacher_infos').hide();
    $('#u_phone').val("");
    $('#u_school').val("");
    $('#u_is_admin').prop("checked", false);
    $('#u_is_teacher').prop("checked", false);
    $('#u_is_active').prop("checked", false);
    $('#user_teacher_grade').prop('selectedIndex', 0);
    $('#user_teacher_subjects').prop('selectedIndex', 0);
    $('#u_is_group_admin').prop("checked", false);

    updateAppForUser("create");
    pseudoModal.openModal('manager-create-user');

    // Bind function to select
    $("#u_is_teacher").change(() => {
        if ($('#u_is_teacher').is(':checked')) {
            $('#user_teacher_infos').show();
        } else {
            $('#user_teacher_infos').hide();
        }
    })

    $('#user_teacher_grade').change(() => {
        switch ($('#user_teacher_grade').val()) {
            case "0":
                createSubjectSelect(getSubjects(0), 0);
                break;
            case "1":
                createSubjectSelect(getSubjects(1), 0);
                break;
            case "2":
                createSubjectSelect(getSubjects(2), 0);
                break;
            case "3":
                createSubjectSelect(getSubjects(3), 0);
                break;
            case "4":
                createSubjectSelect(getSubjects(4), 0);
                break;
            default:
                break;
        }
    })

    $("#user_teacher_grade").trigger("change");
    if ($("#u_group")[0].length <= 0) {
        $saved_groups = mainManager.getmanagerManager()._comboGroups;
        appendSelectGroups($saved_groups, 'u_group');
    }

});

function addGroupmanager() {
    let numberOfAddedGroup = mainManager.getmanagerManager()._addedCreateUserGroup,
        $saved_groups = mainManager.getmanagerManager()._comboGroups;

    // fix
    if ($('#u_actual_group' + numberOfAddedGroup)[0]) {
        for (i = 0; i <= numberOfAddedGroup; i++) {
            if (!$('#u_actual_group' + i)[0]) {
                numberOfAddedGroup = i;
                break;
            }
        }
    }

    let HtmlToAdd = `<div class="input-group mb-3" id="u_actual_group${numberOfAddedGroup}">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                        <input type="checkbox" id="u_is_group_admin${numberOfAddedGroup}">
                        <label class="form-check-label mx-1" for="u_is_group_admin${numberOfAddedGroup}">
                                Administrateur du groupe
                            </label>
                        </div>
                    </div>
                    <select class="form-control" id="u_group${numberOfAddedGroup}">
                    </select>
                    <button class="btn btn-danger ml-1" onclick="deleteGroupFromCreate(${numberOfAddedGroup})">Supprimer</button>
                </div>`;
    $('#group_add_sa').append(HtmlToAdd);

    let item_id = 'u_group' + numberOfAddedGroup;
    appendSelectGroups($saved_groups, item_id);
    mainManager.getmanagerManager()._addedCreateUserGroup += 1;
}

function deleteGroupFromCreate(id) {
    mainManager.getmanagerManager()._addedCreateUserGroup -= 1;
    $('#u_actual_group' + id).remove();
}

// Fill the selectbox with the existing groups
function appendSelectGroups(obj, item_id) {
    const o = new Option("Aucun groupe", -1);
    $(o).html("Aucun groupe");
    $("#" + item_id).append(o);

    for (let index = 0; index < obj.length; index++) {
        const o = new Option(obj[index].name, obj[index].id);
        $(o).html(obj[index].name);
        $("#" + item_id).append(o);
    }
}

function updateAppForUser(methodName = "update") {
    const process = (data) => {
        // Get the actual user's information
        let user = mainManager.getmanagerManager()._actualUserDetails;
        let defaultRestrictions = mainManager.getmanagerManager()._defaultRestrictions;
        $('#update_personal_apps_sa').html("");
        $('#create_update_personal_apps_sa').html("");

        let stringhtml = `<label>${i18next.t('manager.profil.personalApps')}</label>`;
        data.forEach(element => {

            let infoapp = "";

            if (user[0]) {
                if (user[0].hasOwnProperty('applications')) {
                    user[0].applications.some(function (item) {
                        if (element.id == item.id)
                            infoapp = item;
                    })
                }
            }

            if (!infoapp) {
                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input appuser" type="checkbox" value="${element.id}" id="${methodName}_application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" style="color: var(--classroom-primary)" for="${methodName}_application_${element.id}" >
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="${methodName}_personal_apps_${element.id}" style="display:none;">
                    <label class="form-check-label" for="${methodName}_begin_date_${element.id}">${i18next.t('classroom.activities.form.dateBegin')}</label>
                    <input type="date" id="${methodName}_begin_date_${element.id}" name="trip-start" value="${new Date()}" min="${new Date()}" max="2023-12-31">
                    <label class="form-check-label" for="${methodName}_end_date_${element.id}">${i18next.t('classroom.activities.form.dateEnd')}</label>
                    <input type="date" id="${methodName}_end_date_${element.id}" name="trip-start" min="0" max="2025-12-31">

                    <label class="form-check-label" for="${methodName}_max_teacher_${element.id}">${i18next.t('manager.group.maxStudents')}</label>
                    <input type="number" id="${methodName}_max_teacher_${element.id}" value="${defaultRestrictions[0].restrictions.maxStudents}">

                    <label class="form-check-label" for="${methodName}_max_activities_${element.id}">${i18next.t('manager.group.maxActivities')}</label>
                    <input type="number" id="${methodName}_max_activities_${element.id}">
                </div>
                </div>`;
            } else {
                let dateBegin = new Date(infoapp.date_begin).toISOString().split('T')[0],
                    dateEnd = new Date(infoapp.date_end).toISOString().split('T')[0];

                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input appuser" type="checkbox" checked value="${element.id}" id="${methodName}_application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" style="color: var(--classroom-primary)" for="${methodName}_application_${element.id}">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="${methodName}_personal_apps_${element.id}">
                    <label class="form-check-label" for="${methodName}_begin_date_${element.id}">${i18next.t('classroom.activities.form.dateBegin')}</label>
                    <input type="date" id="${methodName}_begin_date_${element.id}" name="trip-start" value="${dateBegin}" max="2023-12-31">
                    <label class="form-check-label" for="${methodName}_end_date_${element.id}">${i18next.t('classroom.activities.form.dateEnd')}</label>
                    <input type="date" id="${methodName}_end_date_${element.id}" name="trip-start" value="${dateEnd}" max="2025-12-31">
                    <label class="form-check-label" for="${methodName}_max_teacher_${element.id}">${i18next.t('manager.group.maxStudents')}</label>
                    <input type="number" id="${methodName}_max_teacher_${element.id}" value="${infoapp.max_students}">

                    <label class="form-check-label" for="${methodName}_max_activities_${element.id}">${i18next.t('manager.group.maxActivities')}</label>
                    <input type="number" id="${methodName}_max_activities_${element.id}" value="${infoapp.max_activities}">
                </div>
                </div>`;
            }
        });

        if (methodName == "update") {
            $('#update_personal_apps_sa').html(stringhtml);
        } else {
            $('#create_update_personal_apps_sa').html(stringhtml);
        }

        data.forEach(element => {
            $(`#${methodName}_application_${element.id}`).change(function () {
                $(`#${methodName}_personal_apps_${element.id}`).toggle();
                mainManager.getmanagerManager().getActivityRestrictionFromApp(element.id).then((res) => {
                    if ($(`#${methodName}_max_activities_${element.id}`).val() == "") {
                        $(`#${methodName}_max_activities_${element.id}`).val(res.max_per_teachers)
                    }
                });
            })
        });
    }

    mainManager.getmanagerManager().getAllApplications().then((res) => {
        mainManager.getmanagerManager()._allApplications = res;
        process(res)
    })
}

/* function getAllGroupsIfNotAlreadyLoaded() {
    if (mainManager.getmanagerManager()._comboGroups == []) {
        const groups = mainManager.getmanagerManager().getAllGroups();
    }
} */


// ICI
function persistUpdateUserApp(user = 0) {
    if (user == 0) {
        user = mainManager.getmanagerManager()._actualUserDetails[0].id;
    }

    let ApplicationsData = [];
    $("input:checkbox.form-check-input.appuser").each(function (element) {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked'),
            $('#update_begin_date_' + $(this).val()).val(),
            $('#update_end_date_' + $(this).val()).val(),
            $('#update_max_teacher_' + $(this).val()).val(),
            $('#update_max_activities_' + $(this).val()).val()
        ]
        ApplicationsData.push(ApplicationTemp);
    });

    mainManager.getmanagerManager().updateUserApps(user, JSON.stringify(ApplicationsData)).then((res) => {
        if (res.message == "success") {
            displayNotification('#notif-div', "manager.users.appsUpdated", "success");
            pseudoModal.closeAllModal();
            $('#user_apps_update').html("");
            tempoAndShowUsersTable();
        } else if (res.message == "User not found") {
            displayNotification('#notif-div', "manager.account.userNotFoundId", "error");
        } else if (res.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        }
    })
}

function showupdateUserModal(id) {
    let $groups = mainManager.getmanagerManager()._comboGroups;
    mainManager.getmanagerManager()._updatedUserGroup = 0;
    mainManager.getmanagerManager().getUserInfoWithHisGroups(id).then(function (res) {
        //get the personal apps 
        updateAppForUser();
        mainManager.getmanagerManager()._actualUserDetails = res;
        $("#update_actualgroup_sa").html("");
        $('#update_applications_sa').html("");
        $('#update_personal_apps_sa').html('');
        pseudoModal.openModal('manager-update-user');

        $('#update_u_firstname').val(res[0].firstname);
        $('#update_u_surname').val(res[0].surname);
        $('#update_u_pseudo').val(res[0].pseudo);
        $('#update_u_id').val(res[0].id);

        if (res[0].isActive == true) {
            $('#update_u_is_active').prop("checked", true);
        } else {
            $('#update_u_is_active').prop("checked", false);
        }

        $('#update_u_bio').val(res[0].bio);
        $('#update_u_mail').val(res[0].email);
        $('#update_u_phone').val(res[0].telephone);

        $('#update_user_teacher_grade').change(() => {
            switch ($('#update_user_teacher_grade').val()) {
                case "0":
                    createSubjectSelect(getSubjects(0), 2);
                    break;
                case "1":
                    createSubjectSelect(getSubjects(1), 2);
                    break;
                case "2":
                    createSubjectSelect(getSubjects(2), 2);
                    break;
                case "3":
                    createSubjectSelect(getSubjects(3), 2);
                    break;
                case "4":
                    createSubjectSelect(getSubjects(4), 2);
                    break;
                default:
                    break;
            }
        })

        if (res[0].isTeacher != null) {
            $('#update_u_is_teacher').prop("checked", true);
            $('#update_u_school').val(res[0].school);
            $('#update_user_teacher_infos').show();
            // set the grade then trigger the function to set the good subject
            $('#update_user_teacher_grade').val(res[0].grade - 1);
            $("#update_user_teacher_grade").trigger("change");
            $('#update_user_teacher_subjects').val(res[0].subject - 1);
        } else {
            $('#update_u_is_teacher').prop("checked", false);
            $('#update_user_teacher_infos').hide();
        }

        if (res[0].isAdmin == true) {
            $('#update_u_is_admin').prop("checked", true);
        } else {
            $('#update_u_is_admin').prop("checked", false);
        }

        $("#update_u_is_teacher").change(() => {
            if ($('#update_u_is_teacher').is(':checked')) {
                $('#update_user_teacher_infos').show();
                createSubjectSelect(getSubjects(0), 2);
            } else {
                $('#update_user_teacher_infos').hide();
            }
        })

        if (res[0].hasOwnProperty('groups')) {
            for (let i = 0; i < res[0].groups.length; i++) {
                mainManager.getmanagerManager()._updatedUserGroup += 1;
                let group = `<div class="form-group c-secondary-form">
                                <label for="update_u_group${i}" data-i18n="manager.profil.group">Groupe</label>
                                <div class="input-group mb-3" id="update_u_actual_group${i}">
                                    <select class="form-control" id="update_u_group${i}">
                                    </select>
                                    <div class="input-group-append">
                                        <div class="input-group-text c-checkbox c-checkbox-grey">
                                            <input class="form-check-input" type="checkbox" id="update_u_is_group_admin${i}">
                                            <label class="form-check-label mx-1" for="update_u_is_group_admin${i}" data-i18n="manager.users.groupAdmin">
                                                Administrateur du groupe
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                $("#update_actualgroup_sa").append(group);
                if (res[0].groups[i].rights == 1) {
                    $('#update_u_is_group_admin' + i).prop("checked", true);
                }
                const item_id = 'update_u_group' + i;
                appendSelectGroups($groups, item_id);
                $('#update_u_group' + i).val(res[0].groups[i].id);
            }

            let html = "";
            html += "<label data-i18n='manager.profil.apps'>Applications</label>";
            mainManager.getmanagerManager()._comboGroups.forEach(element => {
                if (element.id == mainManager.getmanagerManager()._actualGroup) {
                    element.applications.forEach(application => {
                        let checked = ""
                        if (res[0].hasOwnProperty("applications_from_groups")) {
                            res[0].applications_from_groups.forEach(element => {
                                if (application.id == element.application) {
                                    checked = "checked";
                                }
                            });
                        }
                        html += `<div class="c-checkbox">
                            <input class="form-check-input" type="checkbox" name="group_app" id="group_app_${application.id}" value="${application.id}" ${checked}>
                            <label class="form-check-label" for="group_app_${application.id}">
                                ${application.name}
                            </label>
                        </div>`;
                    })
                }
            });
            $('#update_applications_sa').html(html);

        } else {
            mainManager.getmanagerManager()._updatedUserGroup += 1;
            let group = `<div class="form-group c-secondary-form">
                            <label for="update_u_group0" data-i18n="manager.profil.group">Groupe</label>
                            <div class="input-group mb-3" id="update_u_actual_group0">
                                <select class="form-control" id="update_u_group0">
                                </select>
                                <div class="input-group-append">
                                    <div class="input-group-text c-checkbox c-checkbox-grey">
                                        <input class="form-check-input" type="checkbox" id="update_u_is_group_admin0">
                                        <label class="form-check-label mx-1" for="update_u_is_group_admin0" data-i18n="manager.users.groupAdmin">
                                            Administrateur du groupe
                                        </label>
                                    </div>
                                </div>
                                
                            </div>
                        </div>`;
            $("#update_actualgroup_sa").append(group);
            const item_id = 'update_u_group0';
            appendSelectGroups($groups, item_id);
        }
    });
}

function updateAddGroupmanager() {
    let $groups = mainManager.getmanagerManager()._comboGroups,
        nextGroup = mainManager.getmanagerManager()._updatedUserGroup;

    // fix
    if ($('#update_u_actual_group' + nextGroup)[0]) {
        for (i = 0; i <= nextGroup; i++) {
            if (!$('#update_u_actual_group' + i)[0]) {
                nextGroup = i;
                break;
            }
        }
    }

    let group = `<div class="input-group mb-3" id="update_u_actual_group${nextGroup}">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="checkbox" id="update_u_is_group_admin${nextGroup}">
                            <label class="form-check-label mx-1" for="update_u_is_group_admin${nextGroup}">
                            Administrateur du groupe
                            </label>
                        </div>
                    </div>
                    <select class="form-control" id="update_u_group${nextGroup}">
                    </select>
                    <button class="btn btn-danger ml-1" onclick="deleteGroupFromUpdate(${nextGroup})">Supprimer</button>
                </div>`;
    $("#update_actualgroup_sa").append(group);
    const item_id = 'update_u_group' + nextGroup;
    appendSelectGroups($groups, item_id);
    mainManager.getmanagerManager()._updatedUserGroup += 1;
}

function deleteGroupFromUpdate(id) {
    mainManager.getmanagerManager()._updatedUserGroup -= 1;
    $('#update_u_actual_group' + id).remove();
}

function updateUserModal() {
    let $firstname = $('#update_u_firstname').val(),
        $surname = $('#update_u_surname').val(),
        $user_id = $('#update_u_id').val(),
        $bio = $('#update_u_bio').val(),
        $mail = $('#update_u_mail').val(),
        $pseudo = $('#update_u_pseudo').val(),
        $phone = $('#update_u_phone').val(),
        $school = $('#update_u_school').val(),
        $is_active = $('#update_u_is_active').is(':checked'),
        $is_admin = $('#update_u_is_admin').is(':checked'),
        $is_teacher = $('#update_u_is_teacher').is(':checked'),
        $teacher_grade = $('#update_user_teacher_grade').length ? $('#update_user_teacher_grade').val() + 1 : null,
        $teacher_suject = $('#update_user_teacher_subjects').length ? $('#update_user_teacher_subjects').val() + 1 : null,
        $groups = [$('#update_u_is_group_admin0').is(':checked'), $('#update_u_group0').val()];

    $ApplicationFromGroup = [];
    $('[name="group_app"]').each(function () {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked')
        ]
        $ApplicationFromGroup.push(ApplicationTemp);
    });


    mainManager.getmanagerManager().updateUser($user_id,
        $firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $is_admin,
        $is_teacher,
        $teacher_grade,
        $teacher_suject,
        $school,
        $is_active,
        JSON.stringify($ApplicationFromGroup)).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.userUpdated", "success");
            persistUpdateUserApp();
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "maxStudentsFromTeacher") {
            displayNotification('#notif-div', "manager.group.toManyStudentsFromTheTeacher", "error");
        } else if (response.message = "maxStudentsInGroup") {
            displayNotification('#notif-div', "manager.group.toManyStudentsInGroup", "error");
        }
    });
}


function createUserAndLinkToGroup() {
    let $firstname = $('#u_firstname').val(),
        $surname = $('#u_surname').val(),
        $bio = $('#u_bio').val(),
        $mail = $('#u_mail').val(),
        $pseudo = $('#u_pseudo').val(),
        $phone = $('#u_phone').val(),
        $school = $('#u_school').val(),
        $is_admin = $('#u_is_admin').is(':checked'),
        $is_teacher = $('#u_is_teacher').is(':checked'),
        $teacher_grade = $('#user_teacher_grade').length ? $('#user_teacher_grade').val() : null,
        $teacher_suject = $('#user_teacher_subjects').length ? $('#user_teacher_subjects').val() : null,
        $groups = [];

    $groups.push([$('#u_is_group_admin').is(':checked'), $('#u_group').val()])
    for (let index = 0; index < mainManager.getmanagerManager()._addedCreateUserGroup; index++) {
        $groups.push([$('#u_is_group_admin' + index).is(':checked'), $('#u_group' + index).val()])
    }

    mainManager.getmanagerManager().createUserAndLinkToGroup($firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $is_admin,
        $is_teacher,
        $teacher_grade,
        $teacher_suject,
        $school).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.userCreated", "success");
            if (response.mail == true) {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "success");
            } else {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "error");
            }
            pseudoModal.closeAllModal();
            tempoAndShowUsersTable()
        } else if (response.message == "mailAlreadyExist") {
            displayNotification('#notif-div', "classroom.notif.emailExists", "error");
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        }
    });
    pseudoModal.closeAllModal();
    tempoAndShowUsersTable()
}


function tempoAndShowGroupsTable() {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    setTimeout(() => {
        mainManager.getmanagerManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }, 500);
}

function tempoAndShowUsersTable() {
    let sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_actuel = mainManager.getmanagerManager()._actualGroup;
    setTimeout(() => {
        mainManager.getmanagerManager().showGroupMembers(group_actuel, 1, usersperpage, sort);
    }, 500);
}

function tempoAndShowUsersTableGroupAdmin() {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    setTimeout(() => {
        mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(actualGroup, 1);
    }, 500);
}

function tempoAndShowGroupTableGroupAdmin() {
    setTimeout(() => {
        mainGroupAdmin.getGroupAdminManager().getGroupsUserAdmin();
    }, 500);
}

function switchTomanager() {
    $('body').addClass('theme-super-admin').removeClass("theme-group-admin theme-teacher")
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#manager-dashboard-sidebar').show();
    pseudoModal.closeAllModal();
    mainManager.getmanagerManager().getDefaultRestrictions().then(function (res2) {
        mainManager.getmanagerManager()._defaultRestrictions = res2;
    });
}

function switchToGroupAdmin() {
    //mainGroupAdmin.init();
    $('body').addClass('theme-group-admin').removeClass("theme-super-admin theme-teacher")
    //navigatePanel('classroom-dashboard-profil-panel-groupadmin', 'dashboard-profil-groupadmin');
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#manager-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').show();

    mainGroupAdmin.getGroupAdminManager().getGroupUserAdminId().then((response) => {
        mainGroupAdmin.getGroupAdminManager()._actualGroup = response[0].id;
        mainGroupAdmin.getGroupAdminManager().isGroupsApplicationsOutDated(response[0].id);
    })
    pseudoModal.closeAllModal();
}

function switchToProf() {
    $('body').addClass('theme-teacher').removeClass("theme-group-admin theme-super-admin")
    navigatePanel('classroom-dashboard-profil-panel-teacher', 'dashboard-profil-teacher');
    $('#manager-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#classroom-dashboard-sidebar-teacher').show();
}

function deleteGroup(id) {
    mainManager.getmanagerManager()._actualGroup = id;
    $('#validation_delete_group').val("");
    pseudoModal.openModal('manager-delete-group');
    mainManager.getmanagerManager()._comboGroups.forEach(element => {
        if (element.id == id) {
            $('#md_group').text(element.name);
        }
    });
}

function persistDeleteGroup() {
    let validation = $('#validation_delete_group').val();
    let placeholderWord = $('#validation_delete_group').attr('placeholder');
    const group = mainManager.getmanagerManager()._actualGroup;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteGroup(group).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.group.groupDeleteError", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.group.groupDeleted", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowGroupsTable();
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function cancelDeleteGroup() {
    $('#md_group').text("");
    pseudoModal.closeAllModal();
}

function deleteUser(id, name) {
    mainManager.getmanagerManager()._actualUser = id;
    $('#validation_delete').val("");
    pseudoModal.openModal('manager-delete-user');
    $('#mde_firstname').text(name);

}

/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
function deleteUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_deleteGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-delete-user');
    $('#md_firstnameGA').text(name);
}

function activateUserGroupAdmin(id) {
    mainGroupAdmin.getGroupAdminManager().activateUser(id).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.activated", "success");
            mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(mainGroupAdmin.getGroupAdminManager()._actualGroup, 1);
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.users.errorActivation", "error");
        }
    })
}

function disableUser(id, name) {
    mainManager.getmanagerManager()._actualUser = id;
    $('#validation_disable').val("");
    pseudoModal.openModal('manager-disable-user');
    $('#mdi_firstname').text(name);
}

function disableUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_deleteGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-disable-user');
    $('#md_firstnameGA').text(name);
}

function activeUserGroupAdmin(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_activeGroupAdmin').val("");
    pseudoModal.openModal('groupadmin-active-user');
    $('#md_firstnameGA').text(name);
}

function persistDisable() {
    let validation = $('#validation_disable').val();
    let placeholderWord = $('#validation_disable').attr('placeholder');
    const user = mainManager.getmanagerManager()._actualUser;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().disableUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.notAllowedDisableUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDisabled", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable()
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDelete() {
    let validation = $('#validation_delete').val(),
        placeholderWord = $('#validation_delete').attr('placeholder');
    const user = mainManager.getmanagerManager()._actualUser;
    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainManager.getmanagerManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable();
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDisableGroupAdmin() {
    let validation = $('#validation_disableGroupAdmin').val(),
        placeholderWord = $('#validation_disableGroupAdmin').attr('placeholder');
    const user = mainGroupAdmin.getGroupAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainGroupAdmin.getGroupAdminManager().disableUser(user).then((response) => {
            if (response.message == "not_allowed") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainGroupAdmin.getGroupAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTableGroupAdmin()
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistDeleteGroupAdmin() {
    let validation = $('#validation_deleteGroupAdmin').val(),
        placeholderWord = $('#validation_deleteGroupAdmin').attr('placeholder');
    const user = mainGroupAdmin.getGroupAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainGroupAdmin.getGroupAdminManager().deleteUser(user).then((response) => {
            if (response.message == "not_allowed") {
                displayNotification('#notif-div', "manager.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "manager.users.userDeleted", "success");
                mainGroupAdmin.getGroupAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTableGroupAdmin()
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

/**
 * Show an alert message 
 * @param {int} i : 0 = class success, 1 = class danger
 * @param {string} id : the id of the div we need to interact with
 * @param {string} message : the message we need to show
 */
function switchAlertModal(i, id, message) {
    $(id).text(message);
    if (i == 0) {
        $(id).removeClass("alert-danger");
        $(id).addClass("alert-success");
    } else if (i == 1) {
        $(id).addClass("alert-danger");
        $(id).removeClass("alert-success");
    }
    $(id).fadeIn(1000);
    setTimeout(function () {
        $(id).fadeOut(1000);
    }, 3500);
}

function cancelDelete() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

function cancelDisable() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

function cancelDeleteGroupAdmin() {
    $('#md_firstnameGA').text("");
    pseudoModal.closeAllModal();
}

function showGroupMembers($group_id, $page, $userspp, $sort) {
    mainManager.getmanagerManager()._actualGroup = $group_id;
    mainManager.getmanagerManager().showGroupMembers($group_id, $page, $userspp, $sort);
    $('#table_details_users').show();
    $('#table_details_admins').hide();
    $('#paginationButtons_users').show();
    $('#paginationButtons_groups').hide();
    $('#users_options').show();
    $('#groups_options').hide();
    $('#btn-create-manager').hide();
}

function showGroupMembersGroupAdmin(id) {
    $('#group-monitoring').hide();
    $('#groupadmin_groups').hide();
    mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(id, 1)
    $('#table_details_users_groupadmin').show();
}

function optionsGroupApplications($type) {

    let defaultRestrictions = mainManager.getmanagerManager()._defaultRestrictions;
    const process = (data) => {

        $('#group_upd_apps_options').html("");
        $('#group_apps_options').html("");

        let stringhtml = "",
            actualGroup = mainManager.getmanagerManager()._actualGroup;

        data.forEach(element => {
            let $infoapp = "";

            if ($type == "update") {
                actualGroup[0].applications.some(function (item) {
                    if (element.id == item.application_id)
                        $infoapp = item;
                })
            }

            if (!$infoapp) {
                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input app" type="checkbox" value="${element.id}" id="application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" for="application_${element.id}" style="color: var(--classroom-primary)">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="apps_restriction_${element.id}" style="display:none;">
                    <label class="form-check-label" for="begin_date_${element.id}">${i18next.t('classroom.activities.form.dateBegin')}</label>
                    <input type="date" id="begin_date_${element.id}" name="trip-start" value="${new Date()}" min="${new Date()}" max="2023-12-31">
                    
                    <label class="form-check-label" for="end_date_${element.id}">${i18next.t('classroom.activities.form.dateEnd')}</label>
                    <input type="date" id="end_date_${element.id}" name="trip-start" min="0" max="2025-12-31">

                    <label class="form-check-label" data-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerTeachers')}" for="max_students_per_teachers_${element.id}"><i class="fas fa-info mx-1"></i>${i18next.t('manager.group.studentsPerTeacher')}</label>
                    <input type="number" id="max_students_per_teachers_${element.id}" value="${defaultRestrictions[1].restrictions.maxStudentsPerTeacher}">

                    <label class="form-check-label" data-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxStudentsPerGroups')}" for="max_students_per_groups_${element.id}"><i class="fas fa-info mx-1"></i>${i18next.t('manager.group.studentsPerGroup')}</label>
                    <input type="number" id="max_students_per_groups_${element.id}" value="${defaultRestrictions[1].restrictions.maxStudents}">

                    <label class="form-check-label" data-toggle="tooltip" title="${i18next.t('manager.apps.infoMaxTeachers')}" for="max_teachers_per_groups_${element.id}"><i class="fas fa-info mx-1"></i>${i18next.t('manager.group.teachersPerGroup')}</label>
                    <input type="number" id="max_teachers_per_groups_${element.id}" value="${defaultRestrictions[1].restrictions.maxTeachers}">

                    <label class="form-check-label" for="max_activities_per_groups_${element.id}">${i18next.t('manager.group.activitiesPerGroup')}</label>
                    <input type="number" id="max_activities_per_groups_${element.id}">

                    <label class="form-check-label" for="max_activities_per_teachers_${element.id}">${i18next.t('manager.group.activitiesPerTeacher')}</label>
                    <input type="number" id="max_activities_per_teachers_${element.id}">

                </div>
                </div><hr>`;
            } else {
                let dateBegin = new Date($infoapp.date_begin).toISOString().split('T')[0],
                    dateEnd = new Date($infoapp.date_end).toISOString().split('T')[0];

                stringhtml += `<div class="c-checkbox">
                <input class="form-check-input app" type="checkbox" checked value="${element.id}" id="application_${element.id}">
                <label class="form-check-label font-weight-bold mb-2" for="application_${element.id}" style="color: var(--classroom-primary)">
                    ${element.name}
                </label>
                <br>
                <div class="activity-add-form c-secondary-form" id="apps_restriction_${element.id}">
                    <label class="form-check-label" for="begin_date_${element.id}">${i18next.t('classroom.activities.form.dateBegin')}</label>
                    <input type="date" id="begin_date_${element.id}" name="trip-start" value="${dateBegin}"
                        max="2023-12-31">

                    <label class="form-check-label" for="end_date_${element.id}">${i18next.t('classroom.activities.form.dateEnd')}</label>
                    <input type="date" id="end_date_${element.id}" name="trip-start" value="${dateEnd}"
                        max="2025-12-31">

                    <label class="form-check-label" for="max_students_per_teachers_${element.id}">${i18next.t('manager.group.studentsPerTeacher')}</label>
                    <input type="number" id="max_students_per_teachers_${element.id}" value="${$infoapp.max_students_per_teachers}">

                    <label class="form-check-label" for="max_students_per_groups_${element.id}">${i18next.t('manager.group.studentsPerGroup')}</label>
                    <input type="number" id="max_students_per_groups_${element.id}" value="${$infoapp.max_students_per_groups}">

                    <label class="form-check-label" for="max_teachers_per_groups_${element.id}">${i18next.t('manager.group.teachersPerGroup')}</label>
                    <input type="number" id="max_teachers_per_groups_${element.id}" value="${$infoapp.max_teachers_per_groups}">

                    <label class="form-check-label" for="max_activities_per_groups_${element.id}">${i18next.t('manager.group.activitiesPerGroup')}</label>
                    <input type="number" id="max_activities_per_groups_${element.id}" value="${$infoapp.max_activities_per_groups}">

                    <label class="form-check-label" for="max_activities_per_teachers_${element.id}">${i18next.t('manager.group.activitiesPerTeacher')}</label>
                    <input type="number" id="max_activities_per_teachers_${element.id}" value="${$infoapp.max_activities_per_teachers}">
                </div>
                </div><hr>`;
            }

        });

        if ($type == "update")
            $('#group_upd_apps_options').html(stringhtml);
        else if ($type == "create")
            $('#group_apps_options').html(stringhtml);

        // toggle the description if the checkbox is checked
        data.forEach(element => {
            $(`#application_${element.id}`).change(function () {
                $(`#apps_restriction_${element.id}`).toggle();

                mainManager.getmanagerManager().getActivityRestrictionFromApp(element.id).then((response) => {
                    if ($(`#max_activities_per_groups_${element.id}`).val() == "" && response != null) {
                        $(`#max_activities_per_groups_${element.id}`).val(response.max_per_teachers)
                    }
                    if ($(`#max_activities_per_teachers_${element.id}`).val() == "" && response != null) {
                        $(`#max_activities_per_teachers_${element.id}`).val(response.max_per_teachers)
                    }
                });
            })
        });

    }
    if (mainManager.getmanagerManager()._allApplications == "") {
        mainManager.getmanagerManager().getAllApplications().then((res) => {
            mainManager.getmanagerManager()._allApplications = res;
            process(res)
        })
    } else {
        process(mainManager.getmanagerManager()._allApplications)
    }
}

function createSubjectSelect(array, type) {
    let html = "";
    switch (type) {
        case 0:
            html = $("#user_teacher_subjects");
            break;
        case 1:
            html = $("#user_teacher_subjects_ga");
            break;
        case 2:
            html = $("#update_user_teacher_subjects");
            break;
        case 3:
            html = $("#update_user_teacher_subjects_ga");
            break;
        default:
            break;
    }
    html.empty();
    for (let index = 0; index < array.length; index++) {
        const o = new Option(array[index], index);
        $(o).html(array[index]);
        html.append(o);
    }
}

$('#dashboard-groupadmin-users-side').click(() => {
    //let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    getTheGroupOftheAdmin();
})

function getTheGroupOftheAdmin() {
    mainGroupAdmin.getGroupAdminManager().getGroupsUserAdmin();
}

$('#dashboard-groupadmin-apps').click(() => {
    getGroupMonitoring();
})

function showupdateUserModal_groupadmin(user_id) {
    let $groups = mainGroupAdmin.getGroupAdminManager()._comboGroups;
    mainGroupAdmin.getGroupAdminManager()._updatedUserGroup = 0;
    mainGroupAdmin.getGroupAdminManager().getUserInfoWithHisGroups(user_id).then(function (res) {
        if (res.message != "not_allowed") {
            $("#update_actualgroup_ga").html("");
            $('#update_applications_ga').html("");
            pseudoModal.openModal('groupadmin-update-user');
            $('#update_u_firstname_ga').val(res[0].firstname);
            $('#update_u_surname_ga').val(res[0].surname);
            $('#update_u_pseudo_ga').val(res[0].pseudo);
            $('#update_u_id_ga').val(res[0].id);

            $('#update_u_bio_ga').val(res[0].bio);
            $('#update_u_mail_ga').val(res[0].email);
            $('#update_u_phone_ga').val(res[0].telephone);

            let html = "";
            html += "<label data-i18n='manager.profil.apps'>Applications</label>";
            mainGroupAdmin.getGroupAdminManager()._comboGroups.forEach(element => {
                if (element.id == mainGroupAdmin.getGroupAdminManager()._actualGroup) {
                    element.applications.forEach(application => {
                        let checked = ""
                        if (res[0].hasOwnProperty("applications_from_groups")) {
                            res[0].applications_from_groups.forEach(element => {
                                if (application.id == element.application) {
                                    checked = "checked";
                                }
                            });
                        }
                        html += `<div class="c-checkbox">
                            <input class="form-check-input" type="checkbox" name="group_app" id="group_app_${application.id}" value="${application.id}" ${checked}>
                            <label class="form-check-label" for="group_app_${application.id}">
                                ${application.name}
                            </label>
                        </div>`;
                    })
                }
            });
            $('#update_applications_ga').html(html);

            $('#update_user_teacher_grade_ga').change(() => {
                switch ($('#update_user_teacher_grade_ga').val()) {
                    case "0":
                        createSubjectSelect(getSubjects(0), 3);
                        break;
                    case "1":
                        createSubjectSelect(getSubjects(1), 3);
                        break;
                    case "2":
                        createSubjectSelect(getSubjects(2), 3);
                        break;
                    case "3":
                        createSubjectSelect(getSubjects(3), 3);
                        break;
                    case "4":
                        createSubjectSelect(getSubjects(4), 3);
                        break;
                    default:
                        break;
                }
            })

            // Teacher part
            $('#update_u_school_ga').val(res[0].school);
            $('#update_user_teacher_grade_ga').val(res[0].grade - 1);
            $("#update_user_teacher_grade_ga").trigger("change");
            $('#update_user_teacher_subjects_ga').val(res[0].subject - 1);

            if (res[0].hasOwnProperty('groups')) {
                for (let i = 0; i < res[0].groups.length; i++) {
                    mainGroupAdmin.getGroupAdminManager()._updatedUserGroup += 1;
                    let group = `<div class="form-group c-secondary-form">
                                    <label for="update_u_group_ga${i}" data-i18n="manager.profil.group">Groupe</label>
                                    <div class="input-group mb-3" id="update_u_actual_group_ga${i}">
                                        <select class="form-control" id="update_u_group_ga${i}" disabled>
                                        </select>
                                        <div class="input-group-append">
                                            <div class="input-group-text c-checkbox c-checkbox-grey">
                                                <input type="checkbox" id="update_u_is_group_admin_ga${i}">
                                                <label class="form-check mx-1" for="update_u_is_group_admin_ga${i}">
                                                    Administrateur du groupe
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    //flag
                    $("#update_actualgroup_ga").append(group);
                    if (res[0].groups[i].rights == 1) {
                        $('#update_u_is_group_admin_ga' + i).prop("checked", true);
                    }
                    const item_id = 'update_u_group_ga' + i;
                    appendSelectGroups($groups, item_id);
                    $('#update_u_group_ga' + i).val(res[0].groups[i].id);
                }
            }
        } else {
            displayNotification('#notif-div', "manager.account.notAllowedUpdateUser", "error");
        }
    });
}



function deleteGroupFromUpdateGroupAdmin(id) {
    mainGroupAdmin.getGroupAdminManager()._updatedUserGroup -= 1;
    $('#update_u_actual_group_ga' + id).remove();
}

function updateUserModalGroupAdmin() {
    let $firstname = $('#update_u_firstname_ga').val(),
        $surname = $('#update_u_surname_ga').val(),
        $user_id = $('#update_u_id_ga').val(),
        $bio = $('#update_u_bio_ga').val(),
        $mail = $('#update_u_mail_ga').val(),
        $pseudo = $('#update_u_pseudo_ga').val(),
        $phone = $('#update_u_phone_ga').val(),
        $school = $('#update_u_school_ga').val(),
        $teacher_grade = $('#update_user_teacher_grade_ga').lenght ? $('#update_user_teacher_grade_ga').val() : null,
        $teacher_suject = $('#update_user_teacher_subjects_ga').length ? $('#update_user_teacher_subjects_ga').val() : null,
        $groups = [$('#update_u_is_group_admin_ga0').is(':checked'), $('#update_u_group_ga0').val()];


    $ApplicationFromGroup = [];
    $('[name="group_app"]').each(function () {
        const ApplicationTemp = [
            $(this).val(),
            $(this).is(':checked')
        ]
        $ApplicationFromGroup.push(ApplicationTemp);
    });


    mainGroupAdmin.getGroupAdminManager().updateUser($user_id,
        $firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $teacher_grade,
        $teacher_suject,
        $school,
        JSON.stringify($ApplicationFromGroup)).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.userUpdated", "success");
            pseudoModal.closeAllModal();
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "maxStudentsFromTeacher") {
            displayNotification('#notif-div', "manager.group.toManyStudentsFromTheTeacher", "error");
        } else if (response.message == "maxStudentsInGroup") {
            displayNotification('#notif-div', "manager.group.toManyStudentsInGroup", "error");
        } else if (response.message == "outDated") {
            displayNotification('#notif-div', "manager.apps.outDatedApp", "error");
        }
    });
    tempoAndShowUsersTableGroupAdmin();
}

$('#users_per_page_groupadmin, #sort_users_filter_groupadmin').change(() => {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(actualGroup, 1);
})

$('#create_user_link_to_group_groupadmin').click(function () {
    $('#group_add_ga').html("");
    $('#u_firstname_ga').val("");
    $('#u_surname_ga').val("");
    $('#u_bio_ga').val("");
    $('#u_mail_ga').val("");
    $('#u_pseudo_ga').val("");
    $('#u_phone_ga').val("");
    $('#u_school_ga').val("");
    $('#user_teacher_grade_ga').prop('selectedIndex', 0);
    $('#user_teacher_subjects_ga').prop('selectedIndex', 0);
    $('#u_is_group_admin_ga').prop("checked", false);
    $('#create_applications_ga').html("");

    mainGroupAdmin.getGroupAdminManager()._addedCreateUserGroup = 0;
    const groupId = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    // If the group is full, we notify the group administrator otherwise open the modal
    mainGroupAdmin.getGroupAdminManager().isGroupFull(groupId).then((response) => {
        if (response.message == "limit") {
            displayNotification('#notif-div', "manager.group.groupFullAdminMessage", "error");
        } else {
            pseudoModal.openModal('groupeadmin-create-user');
            // Bind functions to the selects who has been created
            $saved_groups = mainGroupAdmin.getGroupAdminManager()._comboGroups;
            let radioHTML = "";


            $saved_groups.forEach(element => {
                radioHTML += `<div class="form-group c-secondary-form">
                                <label for="create_u_group_ga" data-i18n="manager.profil.group">Groupe</label>
                                <div class="input-group mb-3" id="create_u_actual_group_ga">
                                    <select class="form-control" id="create_u_group_ga" disabled>
                                        <option value="${element.id}">${element.name}</option></select>
                                    <div class="input-group-append">
                                        <div class="input-group-text c-checkbox c-checkbox-grey">
                                            <input type="checkbox" id="checkboxAdmin">
                                            <label class="form-check mx-1" for="checkboxAdmin">
                                                Administrateur du groupe
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            });
            $('#allGroupsGA').html(radioHTML);

            $('#user_teacher_grade_ga').change(() => {
                switch ($('#user_teacher_grade_ga').val()) {
                    case "0":
                        createSubjectSelect(getSubjects(0), 1);
                        break;
                    case "1":
                        createSubjectSelect(getSubjects(1), 1);
                        break;
                    case "2":
                        createSubjectSelect(getSubjects(2), 1);
                        break;
                    case "3":
                        createSubjectSelect(getSubjects(3), 1);
                        break;
                    case "4":
                        createSubjectSelect(getSubjects(4), 1);
                        break;
                    default:
                        break;
                }
            })
            createSubjectSelect(getSubjects(0), 1);

            let html = "";
            html += "<label data-i18n='manager.profil.apps'>Applications</label>";
            mainGroupAdmin.getGroupAdminManager()._comboGroups.forEach(element => {
                if (element.id == mainGroupAdmin.getGroupAdminManager()._actualGroup) {
                    element.applications.forEach(application => {
                        html += `<div class="form-check">
                            <input class="form-check-input" type="checkbox" name="create_group_app" id="group_app_${application.id}" value="${application.id}">
                            <label class="form-check" for="group_app_${application.id}">
                                ${application.name}
                            </label>
                        </div>`;
                    })
                }
            });
            $('#create_applications_ga').html(html);
        }
    })
});

function createUserAndLinkToGroup_groupAdmin() {
    let $firstname = $('#u_firstname_ga').val(),
        $surname = $('#u_surname_ga').val(),
        $bio = $('#u_bio_ga').val(),
        $mail = $('#u_mail_ga').val(),
        $pseudo = $('#u_pseudo_ga').val(),
        $phone = $('#u_phone_ga').val(),
        $school = $('#u_school_ga').val(),
        $groups = [
            $('#checkboxAdmin').is(':checked'),
            $('#create_u_group_ga').val()
        ],
        $teacher_grade = $('#user_teacher_grade_ga').length ? $('#user_teacher_grade_ga').val() + 1 : null,
        $teacher_suject = $('#user_teacher_subjects_ga').length ? $('#user_teacher_subjects_ga').val() + 1 : null;

        $ApplicationFromGroup = [];
        $('[name="create_group_app"]').each(function () {
            const ApplicationTemp = [
                $(this).val(),
                $(this).is(':checked')
            ]
            $ApplicationFromGroup.push(ApplicationTemp);
        });


    mainGroupAdmin.getGroupAdminManager().createUserAndLinkToGroup($firstname,
        $surname,
        $pseudo,
        $phone,
        $mail,
        $bio,
        $groups,
        $teacher_grade,
        $teacher_suject,
        $school,
        $ApplicationFromGroup
    ).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.users.userCreated", "success");
            if (response.mail == true) {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "success");
            } else {
                displayNotification('#notif-div', "manager.users.mailSentToUser", "error");
            }
            pseudoModal.closeAllModal();
            tempoAndShowGroupTableGroupAdmin()
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        } else if (response.message == "mailAlreadyExist") {
            displayNotification('#notif-div', "classroom.notif.emailExists", "error");
        } else if (response.message == "limit") {
            displayNotification('#notif-div', "manager.group.groupFullAdminMessage", "error");
        } else if (response.message == "not-admin") {
            displayNotification('#notif-div', "manager.account.notAllowedToCreateUserInThisGroup", "error");
        }
    });
}

function resetUserPassword(id) {
    mainManager.getmanagerManager().sendResetPassword(id).then((response) => {
        if (response.isSent == true) {
            displayNotification('#notif-div', "manager.users.mailSentToUserReset", "success");
        } else {
            displayNotification('#notif-div', "manager.users.mailNotSentToUserReset", "error");
        }
        pseudoModal.openModal('manager-show-resetlink');
        $('#passwordLink').val(response.link);
    })
}

function dismissModal() {
    pseudoModal.closeAllModal();
}

function resetUserPasswordga(id) {
    mainGroupAdmin.getGroupAdminManager().sendResetPassword(id).then((response) => {
        if (response.message != "not_allowed") {
            if (response.isSent == true) {
                displayNotification('#notif-div', "manager.users.mailSentToUserReset", "success");
            } else {
                displayNotification('#notif-div', "manager.users.mailNotSentToUserReset", "error");
            }
            pseudoModal.openModal('manager-show-resetlink');
            $('#passwordLink').val(response.link);
        } else {
            displayNotification('#notif-div', "manager.account.notAllowedUpdateUser", "error");
        }
    })
}

function copyLink(id) {
    const copyText = $(id);
    copyText.select();
    document.execCommand("copy");
}

$('#search_user_groupadmin').click(() => {
    let name = $('#name_user_search_groupadmin').val(),
        usersperpage = $('#users_per_page_groupadmin').val();
    if (name != "") {
        mainGroupAdmin.getGroupAdminManager().globalSearchUser(name, 1, usersperpage);
    } else {
        tempoAndShowGroupTableGroupAdmin();
    }
})


function getGroupLinkGA(id) {
    mainGroupAdmin.getGroupAdminManager().getGroupLink(id).then((response) => {
        pseudoModal.openModal('groupadmin-show-grouplink');
        $('#groupLink').val(response.link);
    })
}


function getGrades() {
    let Arr = [];
    for (let i = 0; i < 5; i++) {
        Arr.push(i18next.t(`manager.users.teacherGrades.${i}`))
    }
    return Arr;
}

function getSubjects(grade) {
    let subjectsLength = 0;
    switch (grade) {
        case 0:
            subjectsLength = 2;
            break;
        case 1:
            subjectsLength = 11;
            break;
        case 2:
            subjectsLength = 38;
            break;
        case 3:
            subjectsLength = 12;
            break;
        case 4:
            subjectsLength = 2;
            break;
        default:
            break;
    }
    let TmpArr = [];
    for (let i = 0; i < subjectsLength; i++) {
        TmpArr.push(i18next.t(`manager.users.teacherSubjects.${grade}.${i}`))
    }
    return TmpArr;
}


/**
 * Get the grade and the subject in the user language
 */
const Grade = getGrades();


// Applications management 
function isUserAppsOutDated() {
    mainGroupAdmin.getGroupAdminManager().isUserApplicationsOutDated().then((response) => {
        if (response.message == true) {
            const Apps = response.applications;
            let text = "";
            Apps.forEach(app => {
                const event = new Date(app.date_end.date);
                let stringToShow = i18next.t('manager.account.subscriptionOudated');
                stringToShow = stringToShow.replace("APPNAME", app.app.name);
                stringToShow = stringToShow.replace("DATE", event.toLocaleDateString());
                text += stringToShow;
            });
            $('#info-applications').html(text);
            $('#info-applications').show();
        }
    })
}

function isGroupAppsOutDated(group_id) {
    mainGroupAdmin.getGroupAdminManager().isGroupsApplicationsOutDated(group_id).then((response) => {
        if (response.message == true) {
            const Apps = response.applications;
            let text = "";
            Apps.forEach(app => {
                const event = new Date(app.date_end.date);
                let stringToShow = i18next.t('manager.account.subscriptionOudated');
                stringToShow = stringToShow.replace("APPNAME", app.app.name);
                stringToShow = stringToShow.replace("DATE", event.toLocaleDateString());
                text += stringToShow;
            });
            $('#info-group-applications').html(text);
            $('#info-group-applications').show();
        }
        getGroupMonitoring();
    })
}

function getGroupMonitoring() {
    let actualGroup = mainGroupAdmin.getGroupAdminManager()._actualGroup;
    mainGroupAdmin.getGroupAdminManager().getMonitoringGroup(actualGroup).then((response) => {
        showMonitoring(response);
    })
}

function showMonitoring(data) {
    let html = "";
    $('#group-monitoring-body').html();
    if (data.hasOwnProperty('applications')) {
        data.applications.forEach(app => {
            const dateBegin = new Date(app.dateBegin.date);
            const dateEnd = new Date(app.dateEnd.date);
            const outDated = app.outDated ? "oui" : "non";
            html += `<tr>
                        <td>${app.name}</td>
                        <td>${outDated}</td>
                        <td>${dateBegin.toLocaleDateString()}</td>
                        <td>${dateEnd.toLocaleDateString()}</td>
                        <td>${app.maxStudents}</td>
                        <td>${app.actualStudents}</td>
                        <td>${app.maxTeachers}</td>
                        <td>${app.actualTeachers}</td>
                        <td>${app.maxStudentsPerTeacher}</td>
                        <td>${app.activityType}</td>
                        <td>${app.activityLimit}</td>
                        <td>${app.activityMaxPerTeacher}</td>
                    </tr>`;
        })
    }
    $('#group-monitoring-body').html(html);
    $('#group-monitoring').show();
}

/**
 * Applications crud
 */

$('#dashboard-manager-apps').click(() => {
    getAndShowApps();
})

// Close all the crud views
function closeCrudAppViews() {
    const CRUD_APP_VIEWS = ['#update-app-manager', '#delete-app-manager', '#create-app-manager'];
    CRUD_APP_VIEWS.forEach(view => {
        $(view).hide();
    });
}

// Open the modal with the div we want
function openModalInState(state) {
    closeCrudAppViews()
    pseudoModal.openModal('update-applications-manager');
    $(state).show();
}

// Close modal, reset input, close view and if true refresh the table of 
function closeModalAndCleanInput(refresh = false) {
    if (refresh) {
        getAndShowApps();
    }
    pseudoModal.closeAllModal();
    resetInputApplications();
    closeCrudAppViews();
    closeRestrictionDetail();
}

function resetInputApplications() {
    $('#app_update_name').val("");
    $('#app_update_description').val("");
    $('#app_update_image').val("");
    $('#app_update_id').val("");
    $('#app_create_name').val("");
    $('#app_create_description').val("");
    $('#app_create_image').val("");
    $('#validation_delete_application_id').val("");
    $('#validation_delete_application').val("");
    $('#app_update_activity_restriction_value').val("");
    $('#app_update_activity_restriction_type').val("");
    $('#app_create_activity_restriction_value').val("");
    $('#app_create_activity_restriction_type').val("");

    $('#isLti').prop('checked', false);
    $('#update_isLti').prop('checked', false);

    $('#inputs-lit').hide();
    $('#update_inputs-lti').hide();

    $('#clientId').val("");
    $('#deploymentId').val("");
    $('#toolUrl').val("");
    $('#publicKeySet').val("");
    $('#loginUrl').val("");
    $('#redirectionUrl').val("");
    $('#deepLinkUrl').val("");
    $('#privateKey').val("");

    $('#update_clientId').val("");
    $('#update_deploymentId').val("");
    $('#update_toolUrl').val("");
    $('#update_publicKeySet').val("");
    $('#update_loginUrl').val("");
    $('#update_redirectionUrl').val("");
    $('#update_deepLinkUrl').val("");
    $('#update_privateKey').val("");
}

function getAndShowApps() {
    $('#all-applications-crud').html();
    let htmlApps = "";
    mainManager.getmanagerManager().getAllApplications().then((response) => {
        getAllrestrictions();
        response.forEach(application => {
            htmlApps += `<tr>
                            <td class="font-weight-bold">${application.name}</td>
                            <td>${application.description}</td>
                            <td>${application.image}</td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="updateApp(${application.id})"><i class="fas fa-pencil-alt fa-2x"></i></a>
                            </td>
                            <td>
                                <a class="c-link-red" href="javascript:void(0)" onclick="deleteApp(${application.id}, '${application.name}')"><i class="fas fa-trash-alt fa-2x"></i></a>
                            </td>
                        </tr>`;
        });
        $('#all-applications-crud').html(htmlApps);
    })
}

/*                             
<td>
    <a class="c-link-tertiary" href="javascript:void(0)" onclick="activitiesRestrictionsCrud(${application.id})"><i class="fas fa-key fa-2x"></i></a>
</td> 
*/

function createApp() {
    openModalInState('#create-app-manager');
}


$('body').on('change', '#isLti', function () {
    if ($(this).is(":checked")) {
        $('#inputs-lti').show();
    } else {
        $('#inputs-lti').hide();
    }
})

$('body').on('change', '#update_isLti', function () {
    if ($(this).is(":checked")) {
        $('#update_inputs-lti').show();
    } else {
        $('#update_inputs-lti').hide();
    }
})

// Return false if the input is empty
function checkLtiFields(type) {
    if (type == 'create') {
        if ($('#isLti').is(":checked")) {
            if (
                $('#clientId').val() == "" || 
                $('#deploymentId').val() == "" || 
                $('#toolUrl').val() == "" || 
                $('#publicKeySet').val() == "" || 
                $('#loginUrl').val() == "" || 
                $('#redirectionUrl').val() == "" || 
                $('#deepLinkUrl').val() == "" || 
                $('#privateKey').val() == "") 
            {
                return {isLti : false};
            } else {
                return {
                    isLti : true,
                    clientId: $('#clientId').val(),
                    deploymentId: $('#deploymentId').val(),
                    toolUrl: $('#toolUrl').val(),
                    publicKeySet: $('#publicKeySet').val(),
                    loginUrl: $('#loginUrl').val(),
                    redirectionUrl: $('#redirectionUrl').val(),
                    deepLinkUrl: $('#deepLinkUrl').val(),
                    privateKey: $('#privateKey').val()
                };
            }
        }
    } else if (type == 'update') {
        if ($('#update_isLti').is(":checked")) {
            if (
                $('#update_clientId').val() == "" || 
                $('#update_deploymentId').val() == "" || 
                $('#update_toolUrl').val() == "" || 
                $('#update_publicKeySet').val() == "" || 
                $('#update_loginUrl').val() == "" || 
                $('#update_redirectionUrl').val() == "" || 
                $('#update_deepLinkUrl').val() == "" || 
                $('#update_privateKey').val() == ""
            ) {
                return {isLti : false};
            } else {
                let lti = {
                    isLti : true,
                    clientId: $('#update_clientId').val(),
                    deploymentId: $('#update_deploymentId').val(),
                    toolUrl: $('#update_toolUrl').val(),
                    publicKeySet: $('#update_publicKeySet').val(),
                    loginUrl: $('#update_loginUrl').val(),
                    redirectionUrl: $('#update_redirectionUrl').val(),
                    deepLinkUrl: $('#update_deepLinkUrl').val(),
                    privateKey: $('#update_privateKey').val()
                }
                return lti;
            }
        }
    }
    return {isLti : false};
}

function updateApp(app_id) {
    resetInputApplications();
    mainManager.getmanagerManager().getApplicationById(app_id).then((response) => {
        mainManager.getmanagerManager().getActivityRestrictionFromApp(app_id).then((restriction) => {
            $('#app_update_activity_restriction_value').val(restriction.max_per_teachers);
            $('#app_update_activity_restriction_type').val(restriction.activity_type);
        })
        $('#app_update_name').val(response.name);
        $('#app_update_description').val(response.description);
        $('#app_update_image').val(response.image);
        $('#app_update_id').val(response.id);

        if (response.hasOwnProperty('lti')) {
            $('#update_isLti').prop('checked', true);
            $('#update_inputs-lti').show();
            $('#update_clientId').val(response.lti.clientId);
            $('#update_deploymentId').val(response.lti.deploymentId);
            $('#update_toolUrl').val(response.lti.toolUrl);
            $('#update_publicKeySet').val(response.lti.publicKeySet);
            $('#update_loginUrl').val(response.lti.loginUrl);
            $('#update_redirectionUrl').val(response.lti.redirectionUrl);
            $('#update_deepLinkUrl').val(response.lti.deepLinkUrl);
            $('#update_privateKey').val(response.lti.privateKey);
        }
        openModalInState('#update-app-manager');
    })
}

function deleteApp(app_id, app_name) {
    openModalInState('#delete-app-manager');
    $('#application_delete_name').text(app_name);
    $('#validation_delete_application_id').val(app_id);
}

function persistUpdateApp() {
    let $application_id = $('#app_update_id').val(),
        $application_name = $('#app_update_name').val(),
        $application_description = $('#app_update_description').val(),
        $application_image = $('#app_update_image').val(),
        $application_restrictions_type = $('#app_update_activity_restriction_type').val(),
        $application_restrictions_value = $('#app_update_activity_restriction_value').val(),
        lti = checkLtiFields('update');

    console.log(lti);
    if (!lti.isLti && $('#update_isLti').is(":checked")) {
        displayNotification('#notif-div', "manager.account.missingData", "error");
    } else {
        mainManager.getmanagerManager().updateOneActivityRestriction($application_id, $application_restrictions_type, $application_restrictions_value);
        mainManager.getmanagerManager().updateApplication(
            $application_id,
            $application_name,
            $application_description,
            $application_image,
            lti).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.apps.updateSuccess", "success");
                closeModalAndCleanInput(true);
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    }
}


function persistDeleteApp() {
    let validation = $('#validation_delete_application').val(),
        placeholderWord = $('#validation_delete_application').attr('placeholder'),
        app_id = $('#validation_delete_application_id').val();

    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteApplication(app_id).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.apps.deleteSuccess", "success");
                closeModalAndCleanInput(true)
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistCreateApp() {
    let $application_name = $('#app_create_name').val(),
        $application_description = $('#app_create_description').val(),
        $application_image = $('#app_create_image').val(),
        $application_restrictions_type = $('#app_create_activity_restriction_type').val(),
        $application_restrictions_value = $('#app_create_activity_restriction_value').val(),
        lti = checkLtiFields('create');

    
    if (!lti.isLti && $('#isLti').is(":checked")) {
        displayNotification('#notif-div', "manager.account.missingData", "error");
    } else {
        mainManager.getmanagerManager().createApplication($application_name, $application_description, $application_image, lti).then((response) => {
            if (response.message == "success") {
                displayNotification('#notif-div', "manager.apps.createSuccess", "success");
                closeModalAndCleanInput(true)
                mainManager.getmanagerManager().updateOneActivityRestriction(response.application_id, $application_restrictions_type, $application_restrictions_value);
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
            updateStoredApps();
        })
    }   
}

function updateStoredApps() {
    mainManager.getmanagerManager().getAllApplications().then((res) => {
        mainManager.getmanagerManager()._allApplications = res;
    })
}

/**
 * Activities restrictions per applications
 */


function updateRestriction(id) {
    crudActivityCloseViews();

    pseudoModal.openModal('update-activities-restrictions-manager');
    $('#update-activity-restrictions-manager').show();
    mainManager.getmanagerManager().getOneActivityRestriction(id).then((response) => {
        $('#activity_restrictions_update_type').val(response.activity_type);
        $('#activity_restrictions_update_maximum').val(response.max_per_teachers);
        $('#activity_restrictions_id').val(response.id);
    })
}

function createRestriction() {
    crudActivityCloseViews();
    pseudoModal.openModal('update-activities-restrictions-manager');
    $('#create-activity-restrictions-manager').show();
}

function deleteRestriction(id, type) {
    crudActivityCloseViews();
    pseudoModal.openModal('update-activities-restrictions-manager');
    $('#restriction_delete_name').text(type);
    $('#validation_delete_restriction_id').val(id);
    $('#delete-activity-restrictions-manager').show();
}

function crudActivityCloseViews() {
    const ALL_ACTIVITIES_VIEWS = ['#update-activity-restrictions-manager', '#delete-activity-restrictions-manager', '#create-activity-restrictions-manager'];
    ALL_ACTIVITIES_VIEWS.forEach(view => {
        $(view).hide();
    });
}


function persistDeleteRestriction() {
    let validation = $('#validation_delete_restriction').val(),
        placeholderWord = $('#validation_delete_restriction').attr('placeholder'),
        restriction_id = $('#validation_delete_restriction_id').val();

    if (validation == placeholderWord) {
        mainManager.getmanagerManager().deleteOneActivityRestriction(restriction_id).then((response) => {
            if (response.success == true) {
                displayNotification('#notif-div', "manager.activitiesRestrictions.deleteSuccess", "success");
                closeModalAndCleanInputActivityRestrictions()
            } else {
                displayNotification('#notif-div', "manager.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function persistUpdateRestriction() {
    let $restriction_id = $('#activity_restrictions_id').val(),
        $restriction_max = $('#activity_restrictions_update_maximum').val(),
        $application_id = $('#application-id-for-restriction').val(),
        $restriction_type = $('#activity_restrictions_update_type').val();

    mainManager.getmanagerManager().updateOneActivityRestriction(
        $restriction_id,
        $application_id,
        $restriction_type,
        $restriction_max).then((response) => {
        if (response.success == true) {
            displayNotification('#notif-div', "manager.activitiesRestrictions.updateSuccess", "success");
            closeModalAndCleanInputActivityRestrictions()
        } else {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        }
    })
}

function persistCreateRestriction() {
    let $restriction_max = $('#activity_restrictions_create_maximum').val(),
        $application_id = $('#application-id-for-restriction').val(),
        $restriction_type = $('#activity_restrictions_create_type').val();

    mainManager.getmanagerManager().createOneActivityRestriction(
        $application_id,
        $restriction_type,
        $restriction_max).then((response) => {
        if (response.success == true) {
            displayNotification('#notif-div', "manager.activitiesRestrictions.createSuccess", "success");
            closeModalAndCleanInputActivityRestrictions()
        } else {
            displayNotification('#notif-div', "manager.account.missingData", "error");
        }
    })
}

function closeModalAndCleanInputActivityRestrictions() {
    activitiesRestrictionsCrud($('#application-id-for-restriction').val());
    // Update fields
    $('#activity_restrictions_update_type').val("");
    $('#activity_restrictions_update_maximum').val("");
    $('#activity_restrictions_id').val("");
    // Create fields
    $('#activity_restrictions_create_type').val("");
    $('#activity_restrictions_create_maximum').val("");

    crudActivityCloseViews();
    pseudoModal.closeAllModal();

}

function closeRestrictionDetail() {
    $('#application-id-for-restriction').val("");
    $('#all-restrictions-from-app').hide();
}

function getAllrestrictions() {
    mainManager.getmanagerManager().getDefaultRestrictions().then((response) => {

        let html = "";
        $('#all-default-restrictions').html("");
        response.forEach(restriction => {
            let name = "", 
                limitation = "", 
                update = "";
            switch(restriction.name) {
                case 'userDefaultRestrictions':
                    name = i18next.t(`manager.apps.usersLimitation`);
                    limitation = `<ul class="m-0">`;
                    Object.keys(restriction.restrictions).forEach(function (key) {
                        limitation += `<li> <span class="font-weight-bold">${i18next.t(`manager.table.${key}`)}</span> : ${restriction.restrictions[key]}</li>`;
                    });
                    limitation += `</ul>`;
                    update = `<a class="c-link-secondary d-inline-block" href="javascript:void(0)" onclick="updateDefaultUsersLimitation()"><i class="fas fa-pencil-alt fa-2x"></i></a>`;
                    break;
                case 'groupDefaultRestrictions':
                    name = i18next.t(`manager.apps.groupsLimitation`);
                    limitation = `<ul class="m-0">`;
                    Object.keys(restriction.restrictions).forEach(function (key) {
                        limitation += `<li> <span class="font-weight-bold">${i18next.t(`manager.table.${key}`)}</span> : ${restriction.restrictions[key]}</li>`;
                    });
                    limitation += `</ul>`;
                    update = `<a class="c-link-secondary d-inline-block" href="javascript:void(0)" onclick="updateDefaultGroupsLimitation()"><i class="fas fa-pencil-alt fa-2x"></i></a>`;
                    break;
                default:
                    break;
            }

            html += `<tr>
                        <td>${name}</td>
                        <td>${limitation}</td>
                        <td>${update}</td>
                    </tr>`;
        });
        $('#all-default-restrictions').html(html);
    })
}

function updateDefaultUsersLimitation() {
    let html = "";
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultUsersRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        Object.keys(response.restrictions).forEach(function (key) {
            html += `<div class="form-row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-users-restrictions-value">${i18next.t(`manager.table.${key}`)}</label>`;
            html += `<input type="number" class="form-control" id="default-users-restrictions-value" value="${response.restrictions[key]}">`;
            html += `</div>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultUsersRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-light my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

function updateDefaultGroupsLimitation() {
    let html = "";
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultGroupsRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        Object.keys(response.restrictions).forEach(function (key) {
            html += `<div class="form-row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-groups-restrictions-value-${key}">${i18next.t(`manager.table.${key}`)}</label>`;
            html += `<input type="number" class="form-control" id="default-groups-restrictions-value-${key}" value="${response.restrictions[key]}">`;
            html += `</div>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultGroupsRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-light my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

let allActualType = [];

function updateDefaultActivitiesLimitation() {
    let html = "";
    allActualType = [];
    $('#update-default-restrictions').html("");
    mainManager.getmanagerManager().getDefaultActivitiesRestrictions().then((response) => {
        pseudoModal.openModal('update-default-restrictions-manager');
        html += `<button class="btn c-btn-primary my-3 btn" onclick="addDefaultActivitiesRestriction()">${i18next.t(`manager.defaultRestrictions.add`)}</button>`;
        Object.keys(response.restrictions).forEach(function (key) {
            allActualType.push(key);
            html += `<div class="form-row mt-1 c-secondary-form">`
            html += `<div class="col-md">`
            html += `<label for="default-activity-restriction-type-${key}">${i18next.t('manager.defaultRestrictions.type')}</label>`;
            html += `<input type="text" class="form-control" id="default-activity-restriction-type-${key}" value="${key}">`;
            html += `</div>`;
            html += `<div class="col-md">`
            html += `<label for="default-activity-restriction-value-${key}">${i18next.t('manager.defaultRestrictions.max')}</label>`;
            html += `<input type="number" class="form-control" id="default-activity-restriction-value-${key}" value="${response.restrictions[key]}">`;
            html += `</div>`;
            html += `<button class="btn c-btn-red my-3 btn" onclick="persistdeleteDefaultActivitiesRestriction('${key}')">${i18next.t(`manager.buttons.delete`)}</button>`;
            html += `</div>`;
        });
        html += `<button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateDefaultActivitiesRestriction()">${i18next.t(`manager.buttons.update`)}</button>`;
        html += `<button class="btn c-btn-light my-3 btn" onclick="closeDefault()">${i18next.t(`manager.buttons.cancel`)}</button>`;
        $('#update-default-restrictions').html(html);
    })
}

function persistUpdateDefaultUsersRestriction() {
    let maxStudentsValue = $('#default-users-restrictions-value').val();
    mainManager.getmanagerManager().updateDefaultUsersRestrictions(maxStudentsValue).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.defaultRestrictions.updateUsersRestrictionsSuccess", "success");
            pseudoModal.closeAllModal();
            getAllrestrictions();
        }
    })
}

function persistUpdateDefaultGroupsRestriction() {
    let maxStudentsValue = $('#default-groups-restrictions-value-maxStudents').val(),
        maxTeachersValue = $('#default-groups-restrictions-value-maxTeachers').val(),
        maxStudentsPerTeacherValue = $('#default-groups-restrictions-value-maxStudentsPerTeacher').val();
    mainManager.getmanagerManager().updateDefaultGroupsRestrictions(maxStudentsValue, maxTeachersValue, maxStudentsPerTeacherValue).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "manager.defaultRestrictions.updateGroupsRestrictionsSuccess", "success");
            pseudoModal.closeAllModal();
            getAllrestrictions();
        }
    })
}

function closeDefault() {
    pseudoModal.closeAllModal();
}

// Adjust the registrations forms from the configuration in the .env file
function createRegistrationTemplate() {

    // Get the registration template configuration from the .env file
    getRegistrationTemplate().then((res) => {

        // List all the views who are adjustable
        const   usernameViews = ['#manager_username', '#manager_update_username', '#group_admin_username', '#group_admin_username_update'],
                phoneViews = ['#manager_phone', '#manager_update_phone', '#group_admin_phone', '#group_admin_phone_update'],
                userBioViews = ['#manager_bio', '#manager_update_bio', '#group_admin_bio', '#group_admin_bio_update'],
                userTeacherSectionViews = ['#user_teacher_infos', '#update_user_teacher_infos', '#user_teacher_infos_ga', '#update_user_teacher_infos_ga'],
                userTeacherSchoolViews = ['#section_teacher_school', '#section_teacher_school_ga', '#section_teacher_school_update_ga', '#section_teacher_update_school'],
                userTeacherGradeViews = ['#section_teacher_grade', '#section_teacher_grade_ga', '#section_teacher_grade_update_ga', '#section_teacher_update_grade'],
                userTeacherSubjectsViews = ['#section_teacher_subjects', '#section_teacher_subjects_ga', '#section_teacher_subjects_update_ga', '#section_teacher_update_subjects'];

        // If the registration template does not need an element to be displayed, we remove it
        const deleteInputs = (array) => {
            array.forEach(element => {
                if ($(element).length) {
                    $(element).remove();
                }
            });
        }


        if (res.USER_TEACHER_GRADE == "false" && res.USER_TEACHER_SUBJECTS == "false" && res.USER_TEACHER_SCHOOL == "false") {
            deleteInputs(userTeacherSectionViews);
        } else {
            if (res.USER_TEACHER_GRADE == "false") {
                deleteInputs(userTeacherGradeViews);
            }
            if (res.USER_TEACHER_SUBJECT == "false") {
                deleteInputs(userTeacherSubjectsViews);
            }
            if (res.USER_TEACHER_SCHOOL == "false") {
                deleteInputs(userTeacherSchoolViews);
            }
        }

        // Check for every configuration if it is needed to display the element
        if (res.USER_USERNAME == "false") {
            deleteInputs(usernameViews);
        }

        if (res.USER_PHONE == "false") {
            deleteInputs(phoneViews);
        }

        if (res.USER_BIO == "false") {
            deleteInputs(userBioViews);
        }
        
    })
}


$('#btn-help-for-groupAdmin').click(function () {
    let message = $('#groupadmin-contact-message-input').val(),
        subject = $('#groupadmin-contact-subject-input').val();
    mainGroupAdmin.getGroupAdminManager().helpRequestGroupAdmin(subject, message).then((response) => {
        if (response.emailSent == true) {
            displayNotification('#notif-div', "classroom.notif.helpRequestFromTeacherSent", "success");
        } else if (response.emailSent == false) {
            displayNotification('#notif-div', "manager.account.errorSending", "error");
        }
        // Add reset
        $('#groupadmin-contact-message-input').val("");
        $('#groupadmin-contact-subject-input').val("");
    })
})

// LMS Exercices DEBUG WiP

function testDebug() {
    navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-profil-teacher');
}

/**
 * Setup the rich text editor for the activities
 */
function setTextArea() {
    let wbbOpt = {
        buttons: ",bold,italic,underline,|,justifyleft,justifycenter,justifyright,img,link,|,quote,bullist,|,vittaiframe,cabriiframe,vittapdf,video,peertube,vimeo,genialyiframe,gdocsiframe",
    }
    // Free 
    $('#free-enonce').wysibb(wbbOpt);
    $('#free-content').wysibb(wbbOpt);
    $('#free-correction').wysibb(wbbOpt);

    // Reading
    $("#reading-content").wysibb(wbbOpt);

    // FillIn
    $("#fill-in-states").wysibb(wbbOpt);
    $("#fill-in-content").wysibb(wbbOpt);

    // DragAndDrop
    $("#drag-and-drop-states").wysibb(wbbOpt);
    $("#drag-and-drop-content").wysibb(wbbOpt);

     // Quiz
     $("#quiz-states").wysibb(wbbOpt);
}

/**
 * Hide all the activities section
 */
function hideAllActivities() {
    $("#activity-free").hide();
    $("#activity-reading").hide();
    $("#activity-fill-in").hide();
    $("#activity-drag-and-drop").hide();
    $("#activity-custom").hide();
    $("#activity-quiz").hide();
}

// autocorrect modification pas pris en compte
function launchCustomActivity(activityType, isUpdate = false) {

    //if (document.querySelector('#free-enonce') !== null) {
    setTextArea();
    //}

    const contentForwardButtonElt = document.getElementById('content-forward-button');
    contentForwardButtonElt.style.display = 'inline-block';
    if(!isUpdate) {
        // Reset and hide all activities input and fields
        resetActivityInputs(activityType);
    }
    hideAllActivities();

    Main.getClassroomManager()._createActivity.id = activityType;
    Main.getClassroomManager()._createActivity.function = "create";

    Main.getClassroomManager().isActivitiesRestricted(null, activityType).then((response) => {
        if (response.Limited == false) {
            switch(activityType) {
                case 'free':
                    $("#activity-free").show();
                    break;
                case 'quiz':
                    $("#activity-quiz").show();
                    break;
                case 'fillIn':
                    $("#activity-fill-in").show();
                    break;
                case 'reading':
                    $("#activity-reading").show();
                    break;
                case 'dragAndDrop':
                    $("#activity-drag-and-drop").show();
                    break;
                case 'custom':
                    // Use the previous method for the activity without title
                    $("#activity-reading").show();
                    break;
                default:
                    // Check if it's an lti apps and get the data needed if it's the case
                    contentForwardButtonElt.style.display = 'none';
                    $("#activity-custom").show();
                    if (isUpdate) {
                        launchLtiDeepLinkCreate(activityType, isUpdate);
                    } else {
                        launchLtiDeepLinkCreate(activityType);
                    }
                    
                    break;
            }
            navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
        } else {
            console.log(response.Restrictions);
            if (UserManager.getUser().isFromGar) {
                $('#app-restricted-number').attr('data-i18n-options', `{"activities": "${response.Restrictions[Object.keys(response.Restrictions)[0]]}"}`);
                pseudoModal.openModal('activity-restricted-gar');
                $('#app-restricted-number').localize();
            } else {
                pseudoModal.openModal('activity-restricted');
            }
        }
    });
}

$("#free-autocorrect").change(function () {
    if ($(this).is(":checked")) {
        $("#free-correction-content").show();
    } else {
        $("#free-correction-content").hide();
    }
})

function resetActivityInputs(activityType) {
    resetDisplayForActivity();
    $('#global_title').val('');
    $('#activity-input').val('');
    if (activityType == 'free') {
        $('#free-content').htmlcode("");
        $('#free-correction').htmlcode("");
        $('#free-autocorrect').prop('checked', false);
        $("#free-correction-content").hide();
        // reset input eleve
    } else if (activityType == 'fillIn') {
        /* fill-in reset */
        $('#fill-in-states').htmlcode("");
        $('#fill-in-content').htmlcode("");
        $('#fill-in-hint').val("");
        $('#fill-in-tolerance').val("");
        $('#fill-in-autocorrect').prop('checked', false);
    } else if (activityType == 'reading') {
        /* reading reset */
        $('#reading-content').htmlcode("");
    } else if (activityType == 'dragAndDrop') {
        /* drag-and-drop reset */
        $('#drag-and-drop-states').htmlcode("");
        $('#drag-and-drop-content').htmlcode("");
        $('#drag-and-drop-hint').val("");
        $('#drag-and-drop-tolerance').val("");
        $('#drag-and-drop-autocorrect').prop('checked', false);
    } else if (activityType == 'quiz') {
        /* quiz reset */
        $('#quiz-states').htmlcode("");
        $('#quiz-content').htmlcode("");
        $('#quiz-hint').val("");
        $('#quiz-tolerance').val("");
        $('#quiz-autocorrect').prop('checked', false);
    }
    Main.getClassroomManager().setDefaultActivityData();
}

function resetDisplayForActivity() {
    $('#activity-free').hide();
    $('#activity-fill-in').hide();
    $('#activity-reading').hide();
    $('#activity-drag-and-drop').hide();
    $('#activity-custom').hide();
    $('#activity-quiz').hide();

    $('#activity-states-container').hide();
    $('#activity-content-container').hide();
    $('#activity-student-response').hide();
    $('#activity-input-container').hide();
    $('#activity-autocorrect-container').hide();
}

function contentBackward() {
    Main.getClassroomManager().getAllApps().then((apps) => {
        activitiesCreation(apps);
        navigatePanel('classroom-dashboard-proactivities-panel-teacher', 'dashboard-activities-teacher');
    })
}

// Get the content
function contentForward() {
    let isCheckPassed = true;
    if (Main.getClassroomManager()._createActivity.id == 'free') {

        Main.getClassroomManager()._createActivity.content.description = $('#free-content').bbcode();
        Main.getClassroomManager()._createActivity.solution = [$('#free-correction').bbcode()];
        Main.getClassroomManager()._createActivity.autocorrect = $('#free-autocorrect').is(":checked");

    } else if (Main.getClassroomManager()._createActivity.id == 'reading'){
        if ($('#reading-content').bbcode() == "") {
            isCheckPassed = false;
        } else {
            Main.getClassroomManager()._createActivity.content.description = $('#reading-content').bbcode();
        }
    } else if (Main.getClassroomManager()._createActivity.id == 'fillIn') {
        // Manage fill in fields
        isCheckPassed = parseFillInFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'quiz') {
        // Manage quiz fields
        isCheckPassed = parseQuizFieldsAndSaveThem();
    } else if (Main.getClassroomManager()._createActivity.id == 'dragAndDrop') {
        isCheckPassed = parseDragAndDropFieldsAndSaveThem();
    }
    // Check if the content if empty
    if (Main.getClassroomManager()._createActivity.content.description == '' && !isCheckPassed) { 
        displayNotification('#notif-div', "classroom.notif.emptyContent", "error");
    } else {
        navigatePanel('classroom-dashboard-classes-new-activity-title', 'dashboard-proactivities-teacher');
    }
}

function titleBackward() {
    if (Main.getClassroomManager()._createActivity.id != "") {
        launchCustomActivity(Main.getClassroomManager()._createActivity.id, true);
    }
}

/**
 * Title part
 */
function titleForward() {
    Main.getClassroomManager()._createActivity.title = $('#global_title').val();
    
    // Check if the title is empty
    if (Main.getClassroomManager()._createActivity.title == '') {
        displayNotification('#notif-div', "classroom.notif.emptyTitle", "error");
    } else {
        let title = Main.getClassroomManager()._createActivity.title,
            type = Main.getClassroomManager()._createActivity.id,
            content = JSON.stringify(Main.getClassroomManager()._createActivity.content),
            solution = JSON.stringify(Main.getClassroomManager()._createActivity.solution),
            tolerance = Main.getClassroomManager()._createActivity.tolerance,
            autocorrect = Main.getClassroomManager()._createActivity.autocorrect;

        if (Main.getClassroomManager()._createActivity.function == "create") {  
            Main.getClassroomManager().createNewActivity(title, type, content, solution, tolerance, autocorrect).then((response) => {
                if (response.success == true) {
                    Main.getClassroomManager()._lastCreatedActivity = response.id;
                    displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${title}"}'`);
                    navigatePanel('classroom-dashboard-classes-new-activity-attribution', 'dashboard-proactivities-teacher');
                } else {
                    displayNotification('#notif-div', "manager.account.errorSending", "error");
                }
            });
        } else if (Main.getClassroomManager()._createActivity.function == "update") {
            Main.getClassroomManager().updateActivity(ClassroomSettings.activity, title, type, content, solution, tolerance, autocorrect).then((response) => {
                if (response.success == true) {
                    Main.getClassroomManager()._lastCreatedActivity = response.id;
                    displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${title}"}'`);
                    navigatePanel('classroom-dashboard-classes-new-activity-attribution', 'dashboard-proactivities-teacher');
                } else {
                    displayNotification('#notif-div', "manager.account.errorSending", "error");
                }
            });
        }
    }
}


/**
 * Validation pipeline for the new activity
 */
function validateActivity() {
    switch(Activity.activity.type) {
        case 'free':
            freeValidateActivity();
            break;
        case 'quiz':
            quizValidateActivity();
            break;
        case 'fillIn':
            fillInValidateActivity();
            break;
        case 'reading':
            defaultProcessValidateActivity();
            break;
        case 'dragAndDrop':
            dragAndDropValidateActivity();
            break;
        case 'custom':
            defaultProcessValidateActivity();
            break;
        default:
            defaultProcessValidateActivity()
            break;
    }
}

/**
 * Default process for the validation of the free activity
 */
function freeValidateActivity() {
    let studentResponse = $('#activity-input').bbcode();
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, null, null, studentResponse).then((response) => {
        if (response) {
            $("#activity-validate").attr("disabled", false);
            if (response.note != null && response.correction > 1) {
                if (response.note == 3) {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
                } else if (response.note == 0) {
                    navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
                }
            } else {
                navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    });
}

function quizValidateActivity() {

    let studentResponse = [];
    for (let i = 1; i < $(`input[id^="student-quiz-checkbox-"]`).length+1; i++) {
        let res = {
            inputVal: $(`#student-quiz-suggestion-${i}`).val(),
            isCorrect: $(`#student-quiz-checkbox-${i}`).is(':checked')
        }
        studentResponse.push(res);
    }
    
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, null, null, JSON.stringify(studentResponse)).then((response) => {
        if (response) {
            $("#activity-validate").attr("disabled", false);
            if (response.note != null && response.correction > 1) {
                if (response.note == 3) {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
                } else if (response.note == 0) {
                    navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
                }
            } else {
                navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    });

}

function fillInValidateActivity() {
    let studentResponse = $('#activity-input').bbcode().match(/\|(.*?)\|/gi).map(match => match.replace(/\|(.*?)\|/gi, "$1").trim());
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, null, null, JSON.stringify(studentResponse)).then((response) => {
        if (response) {
            $("#activity-validate").attr("disabled", false);
            if (response.note != null && response.correction > 1) {
                if (response.note == 3) {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
                } else if (response.note == 0) {
                    navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
                }
            } else {
                navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    });
}


function dragAndDropValidateActivity() {
    let studentResponse = [];
    for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
        let string = document.getElementById(`dz-${i}`).children.length > 0 ? document.getElementById(`dz-${i}`).children[0].innerHTML : "";
        studentResponse.push({
            string: string
        });
    }
    Main.getClassroomManager().saveNewStudentActivity(Activity.activity.id, null, null, JSON.stringify(studentResponse)).then((response) => {
        if (response) {
            $("#activity-validate").attr("disabled", false);
            if (response.note != null && response.correction > 1) {
                if (response.note == 3) {
                    navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
                } else if (response.note == 0) {
                    navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
                }
            } else {
                navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher')
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    });
}


function activitiesCreation(apps) {
    let htmlContent = `<div class="app-head" data-i18n="classroom.activities.applist.selectApp"></div>`;
    apps.forEach(app => {
        let restrict = app.hasOwnProperty("type") ? `launchCustomActivity('${app.type}')` : `launchCustomActivity('custom')`;
        htmlContent+= `<div class="app-card" style="--border-color:${app.color};" onclick="${restrict}">
            <img class="app-card-img" src="${app.image}" alt="${app.name}">
            <h3 class="app-card-title mt-2" data-i18n="">${app.name}</h3>
            <p class="mt-2" data-i18n="">${app.description}</p>
        </div>`
        
    });
    $('#activity-creation-grid').html(htmlContent);
    $('#activity-creation-grid').localize();
}

function goBackToActivities() {
    navigatePanel('classroom-dashboard-activities-panel', 'dashboard-activities');
}


/**
 * Fill in activity
 */

// Test de texte à trou avancé | a && b | et | c | et puis encore | d |
$('#fill-in-add-inputs').click(() => {
    $('#fill-in-content').htmlcode($('#fill-in-content').bbcode() + `| réponse |`);
});



function parseFillInFieldsAndSaveThem() {
    
    Main.getClassroomManager()._createActivity.content.fillInFields.contentForTeacher = $('#fill-in-content').bbcode();
    
    let response = $('#fill-in-content').bbcode().match(/\|(.*?)\|/gi).map(match => match.replace(/\|(.*?)\|/gi, "$1"));
    let contentForStudent = $('#fill-in-content').bbcode();
    response.forEach((e, i) => {
        contentForStudent = contentForStudent.replace(`|${e}|`, `| ? |`);
        if (e.includes('&&')) {
            response[i] = e.split('&&').map(e => e.trim()).join(',');
        }
    })

    if ($('#fill-in-states').bbcode() != '') {
        Main.getClassroomManager()._createActivity.content.states = $('#fill-in-states').bbcode();
    } else {
        return false;
    }

    Main.getClassroomManager()._createActivity.tolerance = $('#fill-in-tolerance').val();
    Main.getClassroomManager()._createActivity.autocorrect = $('#fill-in-autocorrect').is(":checked");
    Main.getClassroomManager()._createActivity.content.hint = $('#fill-in-hint').val();

    Main.getClassroomManager()._createActivity.solution = response;
    Main.getClassroomManager()._createActivity.content.fillInFields.contentForStudent = contentForStudent;

    if (Main.getClassroomManager()._createActivity.content.fillInFields.contentForTeacher == "") {
        return false
    }
    return true;
}

$('#dragAndDrop-add-inputs').click(() => {
    $('#drag-and-drop-content').htmlcode($('#drag-and-drop-content').bbcode() + `| réponse |`);
});

// Voici un exemple de test à trou pour un glisser | déposer |, je test simplement le parsing des | réponses |
function parseDragAndDropFieldsAndSaveThem() {
    
    Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher = $('#drag-and-drop-content').bbcode();
    
    let response = $('#drag-and-drop-content').bbcode().match(/\|(.*?)\|/gi).map(match => match.replace(/\|(.*?)\|/gi, "$1"));
    let contentForStudent = $('#drag-and-drop-content').bbcode();
    response.forEach((e, i) => {
        contentForStudent = contentForStudent.replace(`|${e}|`, `| ? |`);
        if (e.includes('&&')) {
            response[i] = e.split('&&').map(e => e.trim()).join(',');
        }
    })

    if ($('#drag-and-drop-states').bbcode() != '') {
        Main.getClassroomManager()._createActivity.content.states = $('#drag-and-drop-states').bbcode();
    } else {
        return false;
    }

    Main.getClassroomManager()._createActivity.autocorrect = $('#drag-and-drop-autocorrect').is(":checked");
    Main.getClassroomManager()._createActivity.content.hint = $('#drag-and-drop-hint').val();

    Main.getClassroomManager()._createActivity.solution = response;
    Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForStudent = contentForStudent;

    if (Main.getClassroomManager()._createActivity.content.dragAndDropFields.contentForTeacher == "") {
        return false
    }
    return true;
}


function addQuizSuggestion() {
    let i = 0;
    
    do {
        i++;
    } while ($(`#quiz-suggestion-${i}`).length > 0);

    let divToAdd = `<div class="input-group">
                        <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                        <button data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="deleteQuizSuggestion(${i})">Delete</button>
                        <input type="text" id="quiz-suggestion-${i}">
                        <label for="quiz-checkbox-${i}" id="quiz-label-checkbox-${i}">Réponse correcte</label>
                        <input type="checkbox" id="quiz-checkbox-${i}">
                    </div>
                    `;
              
    $('#quiz-suggestions-container').append(divToAdd);
    $(`#quiz-button-suggestion-${i}`).localize();
}

function parseQuizFieldsAndSaveThem() {
    // check empty fields
    let emptyFields = checkEmptyQuizFields();
    let checkBox = checkQuizCheckbox();
    if (emptyFields) { 
        displayNotification('error', 'newActivities.emptyFields');
        return false;
    } else if (!checkBox) {
        displayNotification('error', 'newActivities.checkBox');
        return false;
    } else { 
        for (let i = 1; i < $(`input[id^="quiz-suggestion-"]`).length+1; i++) {
            let res = {
                inputVal: $(`#quiz-suggestion-${i}`).val(),
                isCorrect: $(`#quiz-checkbox-${i}`).is(':checked')
            }
            let student = {
                inputVal: $(`#quiz-suggestion-${i}`).val()
            }
            Main.getClassroomManager()._createActivity.solution.push(res);
            Main.getClassroomManager()._createActivity.content.quiz.contentForStudent.push(student);
        }
        
        Main.getClassroomManager()._createActivity.content.hint = $('#quiz-hint').val();
        Main.getClassroomManager()._createActivity.autocorrect = $('#quiz-autocorrect').is(":checked");
        
        if ($('#quiz-states').bbcode() != '') {
            Main.getClassroomManager()._createActivity.content.states = $('#quiz-states').bbcode();
        } else {
            return false;
        }
        return true;
    }
}

function checkEmptyQuizFields() {
    let empty = false;
    for (let i = 1; i < $(`input[id^="quiz-suggestion-"]`).length+1; i++) {
        if ($(`#quiz-suggestion-${i}`).val() == '') {
            empty = true;
        }
    }
    return empty;
}

// check if at least one checkbox is checked
function checkQuizCheckbox() {
    let checkboxes = $(`input[id^="quiz-checkbox-"]`);
    let checked = false;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checked = true;
        }
    }
    return checked;
}

function deleteQuizSuggestion(number) {
    $(`#quiz-suggestion-${number}`).remove();
    $(`#quiz-label-suggestion-${number}`).remove();
    $(`#quiz-button-suggestion-${number}`).remove();
    $(`#quiz-checkbox-${number}`).remove();
    $(`#quiz-label-checkbox-${number}`).remove();
}



/* function parseFillInFieldsAndSaveThem() {
    let fillInFields = [],
        lengthFill = Main.getClassroomManager()._createActivity.content.fillInFields.array.length;

    const   regex = /\|(.*?)\|/gi,
            regexMultipleAnswer = /([﻿]+)/gi,
            response = [],
            stringWithOutAnswer = [];
        
    for (let i = 0; i < lengthFill; i++) {
        fillInFields.push($(`#question-fill-in-field-${i+1}`).text().toLowerCase())
    }

    fillInFields.forEach(field => {
        response.push(field.match(regex).map(match => match.replace(regex, "$1").trim()));
        stringWithOutAnswer.push(field.replace(regex, '﻿').replace(regexMultipleAnswer, '﻿'));
    });

    Main.getClassroomManager()._createActivity.solution = response;
    Main.getClassroomManager()._createActivity.content.fillInFields.question = stringWithOutAnswer;
} */


/* let proActivities = [{
        "name": "classroom.activities.applist.apps.reading.title",
        "desc": "classroom.activities.applist.apps.reading.desc",
        "image": "./assets/plugins/images/reading.png",
        "color": "#12ACB1",
        "id": "reading"
    },
    {
        "name": "classroom.activities.applist.apps.quiz.title",
        "desc": "classroom.activities.applist.apps.quiz.desc",
        "image": "./assets/plugins/images/quiz.png",
        "color": "#FF931E",
        "id": "quiz"
    },
    {
        "name": "classroom.activities.applist.apps.dragAndDrop.title",
        "desc": "classroom.activities.applist.apps.dragAndDrop.desc",
        "image": "./assets/plugins/images/dragAndDrop.png",
        "color": "#24A069",
        "id": "dragAndDrop"
    },
    {
        "name": "classroom.activities.applist.apps.fillIn.title",
        "desc": "classroom.activities.applist.apps.fillIn.desc",
        "image": "./assets/plugins/images/fillIn.png",
        "color": "#60987E",
        "id": "fillIn"
    },
    {
        "name": "classroom.activities.applist.apps.free.title",
        "desc": "classroom.activities.applist.apps.free.desc",
        "image": "./assets/plugins/images/free.png",
        "color": "#3FA9F5",
        "id": "free"
    }
]; */

/**
 * Meilleur clean de contenu lors de la modification d'une activité
 */

function launchLtiDeepLinkCreate(type, isUpdate) {
    let updateInput = '';
    if (isUpdate) {
        updateInput = `<input type="hidden" id="is_update" name="is_update" value="true">
        <input type="hidden" id="update_url" name="update_url" value="${Main.getClassroomManager()._createActivity.content.description}">`;
    }
    
    document.querySelector('#lti-loader-container').innerHTML = 
    `<input id="activity-form-content-lti" type="text" hidden/>
    <form name="contentitem_request_form" action="${_PATH}lti/contentitem.php" method="post" target="lti_teacher_iframe">
        <input type="hidden" id="application_type" name="application_type" value="${type}">
        ${updateInput}
    </form>
    <div style="width: 100%; height: 100%;" class="lti-iframe-holder">
        <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" width="100%"  height="100%" allowfullscreen></iframe>
    </div>`;

    document.forms["contentitem_request_form"].submit();
}

function launchLtiResource(activityId, activityType, activityContent, isStudentLaunch = false, studentResourceUrl = false) {
    document.querySelector('#activity-content').innerHTML = 
        `<input id="activity-score" type="text" hidden/>
        <form name="resource_launch_form" action="${_PATH}lti/ltilaunch.php" method="post" target="lti_student_iframe">
            <input type="hidden" id="application_type" name="application_type" value="${activityType}">
            <input type="hidden" id="target_link_uri" name="target_link_uri" value="${activityContent.replace('&amp;', '&')}">
            <input type="hidden" id="student_launch" name="student_launch" value="${isStudentLaunch}">
            <input type="hidden" id="activities_link_user" name="activities_link_user" value="${activityId}">
            <input type="hidden" id="student_resource_url" name="student_resource_url" value="${studentResourceUrl}">
        </form>
        <iframe id="lti_student_iframe" src="about:blank" name="lti_student_iframe" title="Tool Content" width="100%" style="
        height: 60vh;" allowfullscreen></iframe>
        `;
    document.forms["resource_launch_form"].submit();
    $("#activity-content-container").show();
}