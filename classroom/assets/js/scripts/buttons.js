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
    if ($_GET('interface') == "newActivities" && !Activity.project && !skipConfirm) {
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

//prof-->vittademo
function modeApprenant() {
    window.localStorage.showSwitchTeacherButton = 'true';
    Main.getClassroomManager().getVittaDemo(ClassroomSettings.classroom)
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
//vittademo-->prof
function modeProf() {
    Main.getClassroomManager().getTeacherAccount(ClassroomSettings.classroom).then(() => {
        window.localStorage.showSwitchTeacherButton = 'false';
    });
}

// Hide the switch teacher mode button when irrelevant
if (document.getElementById('teacherSwitchButton') && window.localStorage.showSwitchTeacherButton == 'true') {
    document.getElementById('teacherSwitchButton').style.display = 'block';
}

if (document.getElementById('settings-student') && (window.localStorage.showSwitchTeacherButton == 'true' || UserManager.getUser().isFromGar)) {
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
    } catch (e) { }
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