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
    chrono: null,
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
function navigatePanel(id, idNav, option = "", interface = '', skipConfirm = false, isOnpopstate = false) {
    let confirmExit = true;
    if ($_GET('interface') == "newActivities" && !Activity.project && !Activity.url && !skipConfirm) {
        confirmExit = confirm(i18next.t("classroom.notif.saveProject"));
    }
    if (confirmExit) {
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
    }

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

/**
 * History navigation
 */
window.onpopstate = () => {
    if ($_GET('panel') && $_GET('nav')) {
        navigatePanel($_GET('panel'), $_GET('nav'), option = $_GET('option'), interface = $_GET('interface'), false, true);
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

$('body').on('change', '#is-anonymised', function () {
    let index = 1
    if ($(this).is(':checked')) {
        $('.username').each(function (el) {
            $('.username')[el].children[0].setAttribute('src', '/public/content/img/alphabet/A.png')
            $('.username')[el].children[1].innerHTML = "Elève n° " + index
            $('.username')[el].children[1].setAttribute('title', '')
            index++
        })
    } else {
        navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom)
    }
})

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

$('body').on('click', '#add-student-dashboard-panel, .new-student-modal', function () {
    pseudoModal.openModal('add-student-modal')
})

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
        ClassroomSettings.interface = $(this).attr('data-href').replace(/.+(arduino|python|microbit).+/, '$1')
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
        let link = $(this).parent().parent().parent().parent().attr('data-href').replace(/\\(arduino|microbit|python)\\\?link=([0-9a-f]{13})/, "$2")
        Main.getClassroomManager().deleteProject(link).then(function (project) {
            deleteSandboxInList(project.link)
            sandboxDisplay()
            displayNotification('#notif-div', "classroom.notif.deleteProject", "success")
        })
    }
})
//increment counter when selecting student
$('body').on('change', '.student-id', function () {
    if ($(this).is(':checked')) {
        ClassroomSettings.studentCount++
    } else {
        ClassroomSettings.studentCount--
    }
    $('.student-number').html(ClassroomSettings.studentCount)
})

$('body').on('change', '.list-students-classroom', function () {
    let nbStudent = $(this).parent().find('.student-list').children().length
    if ($(this).is(':checked')) {

        ClassroomSettings.studentCount += nbStudent
    } else {
        ClassroomSettings.studentCount -= nbStudent
    }
    $('.student-number').html(ClassroomSettings.studentCount)
})


//sandbox dropdown-->duplicate
$('body').on('click', '.modal-teacherSandbox-duplicate', function () {
    let link = $(this).parent().parent().parent().parent().attr('data-href')
    link = link.replace(/.+link=([0-9a-f]{13}).+/, '$1')
    ClassroomSettings.interface = $(this).parent().parent().parent().parent().attr('data-href').replace(/.+(arduino|python|microbit).+/, '$1')
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
function validateActivity() {
    $("#activity-validate").attr("disabled", "disabled");
    let interface = /\[iframe\].*?vittascience(|.com)\/([a-z]{5,12})\/?/gm.exec(Activity.activity.content)
    if (interface == undefined || interface == null) {
        correction = 2
        Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 3).then(function (activity) {
            navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities', '', '', true)
            actualizeStudentActivities(activity, correction)
            $("#activity-validate").attr("disabled", false);
        })
        window.localStorage.classroomActivity = null
    } else if (Activity.autocorrection == false) {
        correction = 1
        let interface = /\[iframe\].*?vittascience(|.com)\/([a-z]{5,12})\/?/gm.exec(Activity.activity.content)[2]
        let project = window.localStorage[interface + 'CurrentProject']
        let note = Number($('#activity-score').val());
        Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interface, Activity.id, undefined, note).then(function (activity) {
            actualizeStudentActivities(activity, correction)
            $("#activity-validate").attr("disabled", false);
            navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher', '', '', true)
        })
    } else {

        $("#activity-validate").attr("disabled", false);
        window.localStorage.autocorrect = true
    }

}

function saveActivity() {
    $("#activity-save").attr("disabled", true);
    correction = 0
    let interface = /\[iframe\].*?vittascience(|.com)\/([a-z]{5,12})\/?/gm.exec(Activity.activity.content)[2]
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
            navigatePanel(navParam.panel, navParam.nav, navParam.option, navParam.interface, true);
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
    activities.newActivities.forEach(element => {
        if (element.dateEnd) {
            var dateEnd = element.dateEnd.date
        } else {
            var dateEnd = "aucune"
        }
        $('#new-activities').append(activityItem(element, "newActivities"))
        $('#header-table-bilan').append('<th data-toggle="tooltip" data-placement="top" title="' + element.activity.title + '"> Act.</br>n°' + index + '</th>')
        $('#body-table-bilan').append('<td class="' + statusActivity(element) + ' classroom-clickable bilan-cell " title="' + i18next.t('classroom.activities.dateBefore') + ' ' + formatDay(dateEnd) + '"></td>')
        index++
    });
    activities.savedActivities.forEach(element => {
        if (element.dateEnd) {
            var dateEnd = element.dateEnd.date
        } else {
            var dateEnd = "aucune"
        }
        $('#saved-activities').append(activityItem(element, "savedActivities"))
        $('#header-table-bilan').append('<th data-toggle="tooltip" data-placement="top" title="' + element.activity.title + '"> Act.</br>n°' + index + '</th>')
        $('#body-table-bilan').append('<td class="' + statusActivity(element) + ' classroom-clickable bilan-cell " title="' + i18next.t('classroom.activities.dateBefore') + ' ' + formatDay(dateEnd) + '"></td>')
        index++
    });

    activities.currentActivities.forEach(element => {
        if (element.dateEnd) {
            var dateEnd = element.dateEnd.date
        } else {
            var dateEnd = "aucune"
        }
        $('#current-activities').append(activityItem(element, "currentActivities"))
        $('#header-table-bilan').append('<th data-toggle="tooltip" data-placement="top" title="' + element.activity.title + '"> Act.</br>n°' + index + '</th>')
        $('#body-table-bilan').append('<td class="' + statusActivity(element) + ' classroom-clickable bilan-cell" title="' + i18next.t('classroom.activities.dateBefore') + ' ' + formatDay(dateEnd) + '"></td>')
        index++
    });
    activities.doneActivities.forEach(element => {
        $('#done-activities-list').append(activityItem(element, "doneActivities"))
        $('#header-table-bilan').append('<th data-toggle="tooltip" data-placement="top" title="' + element.activity.title + '"> Act.</br>n°' + index + '</th>')
        $('#body-table-bilan').append('<td class="' + statusActivity(element) + ' bilan-cell classroom-clickable" ></td>')
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
    // Hide the "add a class" button in the gar user context
    if (UserManager.getUser().isFromGar) {
        document.querySelector('.buttons-interactions button.teacher-new-classe').style.display = 'none';
    }

    // Display the classes from cached data
    $('.list-classes').html(``);
    let classes = Main.getClassroomManager()._myClasses;
    classes.forEach(classroom => {
        $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
    });
    // Get the classes from the database and refresh the panel it there are differences
    Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
        $('.list-classes').html(``);
        let classes = Main.getClassroomManager()._myClasses;
        classes.forEach(classroom => {
            $('.list-classes').append(classeItem(classroom.classroom, classroom.students.length, classroom.students));
        });
    });
}

function teacherActivitiesDisplay(list = Main.getClassroomManager()._myTeacherActivities) {
    $('#list-activities-teacher').html(``)
    list.forEach(element => {
        $('#list-activities-teacher').append(teacherActivityItem(element))
    });
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
        $('#classroom-info').removeClass('greyscale');
        $('#classroom-info > *:not(:first-child)').css('display', 'unset');
        $('#classroom-info > button > i.fa').removeClass('fa-lock').addClass('fa-lock-open');
    } else {
        classroom.isBlocked = true;
        $('#classroom-info').addClass('greyscale');
        $('#classroom-info > *:not(:first-child)').css('display', 'none');
        $('#classroom-info > button > i.fa').removeClass('fa-lock-open').addClass('fa-lock');

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

    $('#' + id + '-activities').toggle()
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
/* superAdmin & groupAdmin */
/***************************/

$('#create_group_superadmin').click(function () {
    pseudoModal.openModal('superadmin-create-group');
    // Clean input
    $('#group_name').val("");
    $('#group_desc').val("");
    optionsGroupApplications("create");
});

$('#settings-superadmin').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

$('#settings-groupadmin').click(function () {
    pseudoModal.openModal('settings-teacher-modal')
})

function createGroupWithModal() {
    let $name = $('#group_name').val(),
        $description = $('#group_desc').val(),
        ApplicationsData = [];

    $("input:checkbox.form-check-input.app").each(function (element) {
        const ApplicationTemp = [$(this).val(), $(this).is(':checked'), $('#begin_date_' + $(this).val()).val(), $('#end_date_' + $(this).val()).val()]
        ApplicationsData.push(ApplicationTemp);
    });

    mainSuperAdmin.getSuperAdminManager().createGroup($description, $name, JSON.stringify(ApplicationsData)).then((response) => {
        if (response.response == "success") {
            displayNotification('#notif-div', "superadmin.group.groupCreated", "success");
        } else {
            displayNotification('#notif-div', "superadmin.group.groupCreateFailed", "error");
        }
    });
    pseudoModal.closeAllModal();
    tempoAndShowGroupsTable()
}

function showupdateGroupModal(id) {
    mainSuperAdmin.getSuperAdminManager().getGroupInfos(id).then(function (res) {
        mainSuperAdmin.getSuperAdminManager()._actualGroup = res;
        pseudoModal.openModal('superadmin-update-group');
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
        const ApplicationTemp = [$(this).val(), $(this).is(':checked'), $('#begin_date_' + $(this).val()).val(), $('#end_date_' + $(this).val()).val()]
        ApplicationsData.push(ApplicationTemp);
    });
    mainSuperAdmin.getSuperAdminManager().updateGroup(
        $('#upd_group_id').val(),
        $('#upd_group_name').val(),
        $('#upd_group_desc').val(),
        JSON.stringify(ApplicationsData)
    ).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "superadmin.group.groupUpdated", "success");
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "superadmin.account.missingData", "error");
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
    $('#btn-create-superadmin').show();
    $('#table_info_group_data').html("");
    $('#paginationButtons_users').html("");
})

$('#table_back_to_users_groupadmin').click(function () {
    $('#groupadmin_groups').show();
    $('#table_details_users_groupadmin').hide();
})

$('#dashboard-superadmin-groups').click(() => {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    mainSuperAdmin.getSuperAdminManager().getAllGroupsInfos(sort, 1, groupsperpage);
})

$('#sort_users_filter, #users_per_page').on('change', () => {
    let $sort = $('#sort_users_filter').val(),
        $userspp = $('#users_per_page').val(),
        $group_id = mainSuperAdmin.getSuperAdminManager()._actualGroup;
    mainSuperAdmin.getSuperAdminManager().showGroupMembers($group_id, 1, $userspp, $sort);
})

$('#search_user').click(() => {
    let name = $('#name_user_search').val(),
        usersperpage = $('#users_per_page').val();
    if (name != "") {
        mainSuperAdmin.getSuperAdminManager().globalSearchUser(name, 1, usersperpage);
    }
})

$('#name_user_search').on('change', () => {
    let name = $('#name_user_search').val(),
        sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_id = mainSuperAdmin.getSuperAdminManager()._actualGroup;
    if (name == "") {
        mainSuperAdmin.getSuperAdminManager().showGroupMembers(group_id, 1, usersperpage, sort);
    }
})

$('#name_group_search').on('change', () => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainSuperAdmin.getSuperAdminManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }
})

$('#sort_groups_filter, #groups_per_page').on('change', () => {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    mainSuperAdmin.getSuperAdminManager().getAllGroupsInfos(sort, 1, groupsperpage);
})


$('#search_group').click(() => {
    let name = $('#name_group_search').val(),
        sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    if (name == "") {
        mainSuperAdmin.getSuperAdminManager().getAllGroupsInfos(sort, 1, groupsperpage);
    } else {
        mainSuperAdmin.getSuperAdminManager().searchGroup(name, 1, groupsperpage, );
    }
})

$('#create_user_link_to_group_superadmin').click(function () {
    mainSuperAdmin.getSuperAdminManager()._addedCreateUserGroup = 0;
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


    pseudoModal.openModal('superadmin-create-user');
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
        $saved_groups = mainSuperAdmin.getSuperAdminManager()._comboGroups;
        appendSelectGroups($saved_groups, 'u_group');
    }

});

function addGroupSuperAdmin() {
    let numberOfAddedGroup = mainSuperAdmin.getSuperAdminManager()._addedCreateUserGroup,
        $saved_groups = mainSuperAdmin.getSuperAdminManager()._comboGroups;

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
    mainSuperAdmin.getSuperAdminManager()._addedCreateUserGroup += 1;
}

function deleteGroupFromCreate(id) {
    mainSuperAdmin.getSuperAdminManager()._addedCreateUserGroup -= 1;
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

function updateAppForUser() {
    const process = (data) => {
        // Get the actual user's information
        let user = mainSuperAdmin.getSuperAdminManager()._actualUserDetails;
        $('#user_apps_update').html("");

        let stringhtml = "";
        data.forEach(element => {

            let infoapp = "";

            if (user[0].hasOwnProperty('applications')) {
                user[0].applications.some(function (item) {
                    if (element.id == item.id)
                        infoapp = item;
                })
            }

            if (!infoapp) {
                stringhtml += `<div class="form-check">
                <input class="form-check-input appuser" type="checkbox" value="${element.id}" id="application_${element.id}">
                <label class="form-check-label" for="application_${element.id}">
                    ${element.name}
                </label>
                <input type="date" id="begin_date_${element.id}" name="trip-start" value="${new Date()}" min="${new Date()}"
                    max="2023-12-31">
                <input type="date" id="end_date_${element.id}" name="trip-start" min="0"
                    max="2025-12-31">
                </div>`;
            } else {
                let dateBegin = new Date(infoapp.date_begin).toISOString().split('T')[0],
                    dateEnd = new Date(infoapp.date_end).toISOString().split('T')[0];

                stringhtml += `<div class="form-check">
                <input class="form-check-input appuser" type="checkbox" checked value="${element.id}" id="application_${element.id}">
                <label class="form-check-label" for="application_${element.id}">
                    ${element.name}
                </label>
                <input type="date" id="begin_date_${element.id}" name="trip-start" value="${dateBegin}"
                    max="2023-12-31">
                <input type="date" id="end_date_${element.id}" name="trip-start" value="${dateEnd}"
                    max="2025-12-31">
                </div>`;
            }

        });
        $('#user_apps_update').html(stringhtml);
        pseudoModal.openModal('superadmin-user-updateApp');

    }
    if (mainSuperAdmin.getSuperAdminManager()._allApplications == "") {
        mainSuperAdmin.getSuperAdminManager().getAllApplications().then((res) => {
            mainSuperAdmin.getSuperAdminManager()._allApplications = res;
            process(res)
        })
    } else {
        process(mainSuperAdmin.getSuperAdminManager()._allApplications)
    }
}

function getAllGroupsIfNotAlreadyLoaded() {
    if (mainSuperAdmin.getSuperAdminManager()._comboGroups == []) {
        mainSuperAdmin.getSuperAdminManager().getAllGroups();
    }
}



function persistUpdateUserApp() {
    let user = mainSuperAdmin.getSuperAdminManager()._actualUserDetails[0].id;
    let ApplicationsData = [];
    $("input:checkbox.form-check-input.appuser").each(function (element) {
        const ApplicationTemp = [$(this).val(), $(this).is(':checked'), $('#begin_date_' + $(this).val()).val(), $('#end_date_' + $(this).val()).val()]
        ApplicationsData.push(ApplicationTemp);
    });
    mainSuperAdmin.getSuperAdminManager().updateUserApps(user, JSON.stringify(ApplicationsData)).then((res) => {
        if (res.message == "success") {
            displayNotification('#notif-div', "superadmin.users.appsUpdated", "success");
            pseudoModal.closeAllModal();
            tempoAndShowUsersTable();
        } else if (res.message == "User not found") {
            displayNotification('#notif-div', "superadmin.account.userNotFoundId", "error");
        } else if (res.message == "missing data") {
            displayNotification('#notif-div', "superadmin.account.missingData", "error");
        }
    })
}

function showupdateUserModal(id) {
    let $groups = mainSuperAdmin.getSuperAdminManager()._comboGroups;
    mainSuperAdmin.getSuperAdminManager()._updatedUserGroup = 0;
    mainSuperAdmin.getSuperAdminManager().getUserInfoWithHisGroups(id).then(function (res) {
        mainSuperAdmin.getSuperAdminManager()._actualUserDetails = res;
        $("#update_actualgroup_sa").html("");
        pseudoModal.openModal('superadmin-update-user');
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
                mainSuperAdmin.getSuperAdminManager()._updatedUserGroup += 1;
                let group = `<div class="input-group mb-3" id="update_u_actual_group${i}">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <input type="checkbox" id="update_u_is_group_admin${i}">
                                        <label class="form-check-label mx-1" for="update_u_is_group_admin${i}">
                                            Administrateur du groupe
                                        </label>
                                    </div>
                                </div>
                                <select class="form-control" id="update_u_group${i}">
                                </select>
                                <button class="btn btn-danger ml-1" onclick="deleteGroupFromUpdate(${i})">Supprimer</button>
                            </div>`;
                $("#update_actualgroup_sa").append(group);
                if (res[0].groups[i].rights == 1) {
                    $('#update_u_is_group_admin' + i).prop("checked", true);
                }
                const item_id = 'update_u_group' + i;
                appendSelectGroups($groups, item_id);
                $('#update_u_group' + i).val(res[0].groups[i].id);
            }
        }
    });
}

function updateAddGroupSuperAdmin() {
    let $groups = mainSuperAdmin.getSuperAdminManager()._comboGroups,
        nextGroup = mainSuperAdmin.getSuperAdminManager()._updatedUserGroup;

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
    mainSuperAdmin.getSuperAdminManager()._updatedUserGroup += 1;
}

function deleteGroupFromUpdate(id) {
    mainSuperAdmin.getSuperAdminManager()._updatedUserGroup -= 1;
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
        $teacher_grade = $('#update_user_teacher_grade').val(),
        $teacher_suject = $('#update_user_teacher_subjects').val(),
        $groups = [];

    for (let index = 0; index < mainSuperAdmin.getSuperAdminManager()._updatedUserGroup; index++) {
        $groups.push([$('#update_u_is_group_admin' + index).is(':checked'), $('#update_u_group' + index).val()])
    }

    mainSuperAdmin.getSuperAdminManager().updateUser($user_id,
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
        $is_active).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "superadmin.users.userUpdated", "success");
            pseudoModal.closeAllModal();
            tempoAndShowUsersTable()
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "superadmin.account.missingData", "error");
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
        $is_active = $('#u_is_active').is(':checked'),
        $is_admin = $('#u_is_admin').is(':checked'),
        $is_teacher = $('#u_is_teacher').is(':checked'),
        $teacher_grade = $('#user_teacher_grade').val(),
        $teacher_suject = $('#user_teacher_subjects').val(),
        $groups = [];

    $groups.push([$('#u_is_group_admin').is(':checked'), $('#u_group').val()])
    for (let index = 0; index < mainSuperAdmin.getSuperAdminManager()._addedCreateUserGroup; index++) {
        $groups.push([$('#u_is_group_admin' + index).is(':checked'), $('#u_group' + index).val()])
    }

    mainSuperAdmin.getSuperAdminManager().createUserAndLinkToGroup($firstname,
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
        $is_active).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "superadmin.users.userCreated", "success");
            if (response.mail == true) {
                displayNotification('#notif-div', "superadmin.users.mailSentToUser", "success");
            } else {
                displayNotification('#notif-div', "superadmin.users.mailSentToUser", "error");
            }
            pseudoModal.closeAllModal();
            tempoAndShowUsersTable()
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "superadmin.account.missingData", "error");
        }
    });
    pseudoModal.closeAllModal();
    tempoAndShowUsersTable()
}


function tempoAndShowGroupsTable() {
    let sort = $('#sort_groups_filter').val(),
        groupsperpage = $('#groups_per_page').val();
    setTimeout(() => {
        mainSuperAdmin.getSuperAdminManager().getAllGroupsInfos(sort, 1, groupsperpage);
    }, 500);
}

function tempoAndShowUsersTable() {
    let sort = $('#sort_users_filter').val(),
        usersperpage = $('#users_per_page').val(),
        group_actuel = mainSuperAdmin.getSuperAdminManager()._actualGroup;
    setTimeout(() => {
        mainSuperAdmin.getSuperAdminManager().showGroupMembers(group_actuel, 1, usersperpage, sort);
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

function switchToSuperAdmin() {
    //mainSuperAdmin.init();
    navigatePanel('classroom-dashboard-profil-panel-superadmin', 'dashboard-profil-superadmin');
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#superadmin-dashboard-sidebar').show();
    pseudoModal.closeAllModal();
}

function switchToGroupAdmin() {
    //mainGroupAdmin.init();
    navigatePanel('classroom-dashboard-profil-panel-groupadmin', 'dashboard-profil-groupadmin');
    $('#classroom-dashboard-sidebar-teacher').hide();
    $('#superadmin-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').show();
    pseudoModal.closeAllModal();
}

function switchToProf() {
    navigatePanel('classroom-dashboard-profil-panel-teacher', 'dashboard-profil-teacher');
    $('#superadmin-dashboard-sidebar').hide();
    $('#groupadmin-dashboard-sidebar').hide();
    $('#classroom-dashboard-sidebar-teacher').show();
}

function deleteGroup(id) {
    mainSuperAdmin.getSuperAdminManager()._actualGroup = id;
    $('#validation_delete_group').val("");
    pseudoModal.openModal('superadmin-delete-group');
    mainSuperAdmin.getSuperAdminManager()._comboGroups.forEach(element => {
        if (element.id == id) {
            $('#md_group').text(element.name);
        }
    });
}

function persistDeleteGroup() {
    let validation = $('#validation_delete_group').val();
    let placeholderWord = $('#validation_delete_group').attr('placeholder');
    const group = mainSuperAdmin.getSuperAdminManager()._actualGroup;
    if (validation == placeholderWord) {
        mainSuperAdmin.getSuperAdminManager().deleteGroup(group).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "superadmin.group.groupDeleteError", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "superadmin.group.groupDeleted", "success");
                mainSuperAdmin.getSuperAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowGroupsTable();
            }
        })
    } else {
        displayNotification('#notif-div', "superadmin.input.writeDelete", "error");
    }
}

function cancelDeleteGroup() {
    $('#md_group').text("");
    pseudoModal.closeAllModal();
}

function deleteUser(id, name) {
    mainSuperAdmin.getSuperAdminManager()._actualUser = id;
    $('#validation_delete').val("");
    pseudoModal.openModal('superadmin-delete-user');
    $('#mde_firstname').text(name);

}

function disableUser(id, name) {
    mainSuperAdmin.getSuperAdminManager()._actualUser = id;
    $('#validation_disable').val("");
    pseudoModal.openModal('superadmin-disable-user');
    $('#mdi_firstname').text(name);
}

function disableUserGA(id, name) {
    mainGroupAdmin.getGroupAdminManager()._actualUser = id;
    $('#validation_deleteGA').val("");
    pseudoModal.openModal('groupadmin-delete-user');
    $('#md_firstnameGA').text(name);
}

function persistDisable() {
    let validation = $('#validation_disable').val();
    let placeholderWord = $('#validation_disable').attr('placeholder');
    const user = mainSuperAdmin.getSuperAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainSuperAdmin.getSuperAdminManager().disableUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "superadmin.account.notAllowedDisableUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "superadmin.users.userDisabled", "success");
                mainSuperAdmin.getSuperAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable()
            }
        })
    } else {
        displayNotification('#notif-div', "superadmin.input.writeDelete", "error");
    }
}

function persistDelete() {
    let validation = $('#validation_delete').val(),
        placeholderWord = $('#validation_delete').attr('placeholder');
    const user = mainSuperAdmin.getSuperAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainSuperAdmin.getSuperAdminManager().deleteUser(user).then((response) => {
            if (response.message == "missing data") {
                displayNotification('#notif-div', "superadmin.account.notAllowedDeleteUser", "error");
            } else if (response.message == "allowed") {
                displayNotification('#notif-div', "superadmin.users.userDeleted", "success");
                mainSuperAdmin.getSuperAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTable();
            }
        })
    } else {
        displayNotification('#notif-div', "superadmin.input.writeDelete", "error");
    }
}

function persistDeleteGroupAdmin() {
    let validation = $('#validation_deleteGA').val(),
        placeholderWord = $('#validation_deleteGA').attr('placeholder');
    const user = mainGroupAdmin.getGroupAdminManager()._actualUser;
    if (validation == placeholderWord) {
        mainGroupAdmin.getGroupAdminManager().disableUser(user).then((response) => {
            if (response.message == "not_allowed") {
                displayNotification('#notif-div', "superadmin.account.notAllowedDeleteUser", "error");
            } else if (response.message == "success") {
                displayNotification('#notif-div', "superadmin.users.userDeleted", "success");
                mainGroupAdmin.getGroupAdminManager()._actualUser = 0;
                pseudoModal.closeAllModal();
                tempoAndShowUsersTableGroupAdmin()
            } else {
                displayNotification('#notif-div', "superadmin.account.missingData", "error");
            }
        })
    } else {
        displayNotification('#notif-div', "superadmin.input.writeDelete", "error");
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
    mainSuperAdmin.getSuperAdminManager()._actualGroup = $group_id;
    mainSuperAdmin.getSuperAdminManager().showGroupMembers($group_id, $page, $userspp, $sort);
    $('#table_details_users').show();
    $('#table_details_admins').hide();
    $('#paginationButtons_users').show();
    $('#paginationButtons_groups').hide();
    $('#users_options').show();
    $('#groups_options').hide();
    $('#btn-create-superadmin').hide();
}

function showGroupMembersGroupAdmin(id) {
    mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(id, 1)
    $('#groupadmin_groups').hide();
    $('#table_details_users_groupadmin').show();
}

function optionsGroupApplications($type) {
    const process = (data) => {

        $('#group_upd_apps_options').html("");
        $('#group_apps_options').html("");

        let stringhtml = "",
            actualGroup = mainSuperAdmin.getSuperAdminManager()._actualGroup;

        data.forEach(element => {
            let $infoapp = "";

            if ($type == "update") {
                actualGroup[0].applications.some(function (item) {
                    if (element.id == item.application_id)
                        $infoapp = item;
                })
            }

            if (!$infoapp) {
                stringhtml += `<div class="form-check">
                <input class="form-check-input app" type="checkbox" value="${element.id}" id="application_${element.id}">
                <label class="form-check-label" for="application_${element.id}">
                    ${element.name}
                </label>
                <input type="date" id="begin_date_${element.id}" name="trip-start" value="${new Date()}" min="${new Date()}"
                    max="2023-12-31">
                <input type="date" id="end_date_${element.id}" name="trip-start" min="0"
                    max="2025-12-31">
                </div>`;
            } else {
                let dateBegin = new Date($infoapp.date_begin).toISOString().split('T')[0],
                    dateEnd = new Date($infoapp.date_end).toISOString().split('T')[0];

                stringhtml += `<div class="form-check">
                <input class="form-check-input app" type="checkbox" checked value="${element.id}" id="application_${element.id}">
                <label class="form-check-label" for="application_${element.id}">
                    ${element.name}
                </label>
                <input type="date" id="begin_date_${element.id}" name="trip-start" value="${dateBegin}"
                    max="2023-12-31">
                <input type="date" id="end_date_${element.id}" name="trip-start" value="${dateEnd}"
                    max="2025-12-31">
                </div>`;
            }

        });

        if ($type == "update")
            $('#group_upd_apps_options').html(stringhtml);
        else if ($type == "create")
            $('#group_apps_options').html(stringhtml);

    }
    if (mainSuperAdmin.getSuperAdminManager()._allApplications == "") {
        mainSuperAdmin.getSuperAdminManager().getAllApplications().then((res) => {
            mainSuperAdmin.getSuperAdminManager()._allApplications = res;
            process(res)
        })
    } else {
        process(mainSuperAdmin.getSuperAdminManager()._allApplications)
    }
}

function createSubjectSelect(array, type) {
    if (type === 0) {
        $("#user_teacher_subjects").empty();
        for (let index = 0; index < array.length; index++) {
            const o = new Option(array[index], index);
            $(o).html(array[index]);
            $("#user_teacher_subjects").append(o);
        }
    } else if (type === 1) {
        $("#user_teacher_subjects_ga").empty();
        for (let index = 0; index < array.length; index++) {
            const o = new Option(array[index], index);
            $(o).html(array[index]);
            $("#user_teacher_subjects_ga").append(o);
        }
    } else if (type === 2) {
        $("#update_user_teacher_subjects").empty();
        for (let index = 0; index < array.length; index++) {
            const o = new Option(array[index], index);
            $(o).html(array[index]);
            $("#update_user_teacher_subjects").append(o);
        }
    } else if (type === 3) {
        $("#update_user_teacher_subjects_ga").empty();
        for (let index = 0; index < array.length; index++) {
            const o = new Option(array[index], index);
            $(o).html(array[index]);
            $("#update_user_teacher_subjects_ga").append(o);
        }
    }
}

$('#dashboard-groupadmin-users-side').click(() => {
    mainGroupAdmin.getGroupAdminManager().getGroupsUserAdmin();
})

function showupdateUserModal_groupadmin(user_id) {
    let $groups = mainGroupAdmin.getGroupAdminManager()._comboGroups;
    mainGroupAdmin.getGroupAdminManager()._updatedUserGroup = 0;
    mainGroupAdmin.getGroupAdminManager().getUserInfoWithHisGroups(user_id).then(function (res) {
        if (res.message != "not_allowed") {
            $("#update_actualgroup_ga").html("");
            pseudoModal.openModal('groupadmin-update-user');
            $('#update_u_firstname_ga').val(res[0].firstname);
            $('#update_u_surname_ga').val(res[0].surname);
            $('#update_u_pseudo_ga').val(res[0].pseudo);
            $('#update_u_id_ga').val(res[0].id);

            $('#update_u_bio_ga').val(res[0].bio);
            $('#update_u_mail_ga').val(res[0].email);
            $('#update_u_phone_ga').val(res[0].telephone);

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
                    let group = `<div class="input-group mb-3" id="update_u_actual_group_ga${i}">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">
                                            <input type="checkbox" id="update_u_is_group_admin_ga${i}">
                                            <label class="form-check mx-1" for="update_u_is_group_admin_ga${i}">
                                                Administrateur du groupe
                                            </label>
                                        </div>
                                    </div>
                                    <select class="form-control" id="update_u_group_ga${i}">
                                    </select>
                                    <button class="btn btn-danger ml-1" onclick="deleteGroupFromUpdateGroupAdmin(${i})">Supprimer</button>
                                </div>`;
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
            displayNotification('#notif-div', "superadmin.account.notAllowedUpdateUser", "error");
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
        $teacher_grade = $('#update_user_teacher_grade_ga').val(),
        $teacher_suject = $('#update_user_teacher_subjects_ga').val(),
        $groups = [];

    for (let index = 0; index < mainGroupAdmin.getGroupAdminManager()._updatedUserGroup; index++) {
        $groups.push([$('#update_u_is_group_admin_ga' + index).is(':checked'), $('#update_u_group_ga' + index).val()])
    }

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
        $school).then((response) => {
        if (response.message == "success") {
            displayNotification('#notif-div', "superadmin.users.userUpdated", "success");
            pseudoModal.closeAllModal();
        } else if (response.message == "missing data") {
            displayNotification('#notif-div', "superadmin.account.missingData", "error");
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

    mainGroupAdmin.getGroupAdminManager()._addedCreateUserGroup = 0;
    pseudoModal.openModal('groupeadmin-create-user');

    // Bind functions to the selects who has been created
    $saved_groups = mainGroupAdmin.getGroupAdminManager()._comboGroups;
    let radioHTML = "";
    $saved_groups.forEach(element => {
        radioHTML += `<div class="form-check">
                        <input class="form-check-input" type="radio" name="groupsRadio" id="groupRadio${element.id}" value="${element.id}" checked>
                        <label class="form-check" for="groupRadio${element.id}">
                            ${element.name}
                        </label>
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
});

function createUserAndLinkToGroup_groupAdmin() {
    let $firstname = $('#u_firstname_ga').val(),
        $surname = $('#u_surname_ga').val(),
        $bio = $('#u_bio_ga').val(),
        $mail = $('#u_mail_ga').val(),
        $pseudo = $('#u_pseudo_ga').val(),
        $phone = $('#u_phone_ga').val(),
        $school = $('#u_school_ga').val(),
        $teacher_grade = $('#user_teacher_grade_ga').val(),
        $teacher_suject = $('#user_teacher_subjects_ga').val(),
        $groups = [
            $('#checkboxAdmin').is(':checked'),
            $(':checked[name="groupsRadio"]').val()
        ];

    mainGroupAdmin.getGroupAdminManager().createUserAndLinkToGroup($firstname, $surname, $pseudo, $phone, $mail, $bio, $groups, $teacher_grade, $teacher_suject, $school);
    pseudoModal.closeAllModal();
    tempoAndShowGroupTableGroupAdmin();
}

function resetUserPassword(id) {
    mainSuperAdmin.getSuperAdminManager().sendResetPassword(id).then((response) => {
        if (response.isSent == true) {
            displayNotification('#notif-div', "superadmin.users.mailSentToUserReset", "success");
        } else {
            displayNotification('#notif-div', "superadmin.users.mailNotSentToUserReset", "error");
        }
        pseudoModal.openModal('superadmin-show-resetlink');
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
                displayNotification('#notif-div', "superadmin.users.mailSentToUserReset", "success");
            } else {
                displayNotification('#notif-div', "superadmin.users.mailNotSentToUserReset", "error");
            }
            pseudoModal.openModal('superadmin-show-resetlink');
            $('#passwordLink').val(response.link);
        } else {
            displayNotification('#notif-div', "superadmin.account.notAllowedUpdateUser", "error");
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
        Arr.push(i18next.t(`superadmin.users.teacherGrades.${i}`))
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
        TmpArr.push(i18next.t(`superadmin.users.teacherSubjects.${grade}.${i}`))
    }
    return TmpArr;
}

/* todo CABRI must move to a seperate plugin */
function startActivityCreation() {
  // check if all modal elements are given
  const title = $('#activity-lti-form-title').val();
  if(!title || title==='') {
    // display form errors
    alert('Veuillez remplir tous les champs obligatoires !')
  }
  else {
    // hide modal and show cabri activity creation
    pseudoModal.closeModal('add-activity-name');
    $('#lti_teacher_iframe').css({'filter': '', 'pointer-events': 'all'});
  }
}

/**
 * Get the grade and the subject in the user language
 */
const Grade = getGrades();
