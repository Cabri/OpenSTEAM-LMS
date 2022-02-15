$(document).ready(function () {


});

const cssClassByActivityType = {
  'EXPRESS': 'activity-card-lti-express',
  'GENIUS': 'activity-card-lti-genius',
  'LTI-BLOCKLY': 'activity-card-lti-blockly',
  'IMUSCICA': 'activity-card-imuscica',
  'STANDARD': 'activity-card-other',
  'IFRAME': 'activity-card-other',
  'IFRAME-VIDEO': 'activity-card-iframe-video',
  'IFRAME-PAGE': 'activity-card-other',
  'IFRAME-CABRI3D': 'activity-card-cabri3d',
}

function activityItem(activity, state) {
    let ide = 'vittascience'
    if (activity.activity.content.match(/vittascience\.com\/microbit/)) {
        ide = "microbit"
    }
    if (activity.activity.content.match(/vittascience\.com\/python/)) {
        ide = "python"
    }
    if (activity.activity.content.match(/vittascience\.com\/arduino/)) {
        ide = "arduino"
    }

    if (state == "doneActivities") {
        if (activity.note == 3) {
            var activityStatus = "ribbon ribbon_accept"
            var activityStatusTitle = i18next.t('classroom.activities.veryGoodProficiency')
        } else if (activity.note == 2) {
            var activityStatus = "ribbon ribbon_vgood"
            var activityStatusTitle = i18next.t('classroom.activities.goodProficiency')
        } else if (activity.note == 1) {
            var activityStatus = "ribbon ribbon_good"
            var activityStatusTitle = i18next.t('classroom.activities.weakProficiency')
        } else if (activity.note == 0) {
            var activityStatus = "ribbon ribbon_refuse"
            var activityStatusTitle = i18next.t('classroom.activities.insufficientProficiency')
        } else {
            var activityStatus = ""
            var activityStatusTitle = "?"
        }
    }

    let html = `<div class="activity-item">
                    <div class="${cssClassByActivityType[activity.activity.type]} activity-card activity-card-` + ide + `">
                        <div class="${activityStatus}" data-toggle="tooltip" title="${activityStatusTitle}"><div class="ribbon__content"></div></div>
                        <div class="activity-card-top">
                        </div>
                        <div class="activity-card-mid"></div>
                        <div class="activity-card-bot">
                            <div class="info-tutorials"  data-id="${activity.activity.id}"  data-state="${state}">`

    if (activity.dateEnd != undefined) {
        const dateBeforeText = activity.activity.type === 'IFRAME-PAGE'
        || activity.activity.type === 'IFRAME-VIDEO'
        || activity.activity.type === 'IFRAME'
        || activity.activity.type === 'IFRAME-CABRI3D'
          ? i18next.t('classroom.activities.dateBeforeAvailable')
          : i18next.t('classroom.activities.dateBefore')
        html += `<span> ` + dateBeforeText + ` ${formatDay(activity.dateEnd)}</span>`
    }

    html += `</div></div></div>`
    html += `<h3 data-toggle="tooltip" title="${activity.activity.title}" class="activity-item-title">${activity.activity.title}</h3>`
    html += `</div>`

    return html;
}

function teacherSandboxItem(json) {

    let html = `<div class="sandbox-item sandbox-teacher">
                    <div class="sandbox-card sandbox-card-` + json.interface + `" data-id="${json.id}" data-href="/` + json.interface + `/?link=` + json.link + `&embed=1">
                        <div class="sandbox-card-top">
                        <i class="fas fa-share fa-2x" style="grid-column-start: 1; grid-column-end: 1;" data-link="${json.link}" ></i>
                            <div class="dropdown"><i class="fas fa-cog fa-2x" style="grid-column-start: 3; grid-column-end: 3;" type="button" id="dropdown-teacherSandboxItem-${json.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-teacherSandboxItem-${json.id}">`
    if (UserManager.getUser().isRegular) {
        html += `<li class="classroom-clickable col-12 dropdown-item" onclick="createActivity('/` + json.interface + `/?link=` + json.link + `&embed=1')" href="#">` + i18next.t('classroom.activities.integrate') + `</li>`
    }
    html += `<li class="modal-teacherSandbox-duplicate classroom-clickable col-12 dropdown-item" href="#">` + capitalizeFirstLetter(i18next.t('words.duplicate')) + `</li>
                <li class="dropdown-item modal-teacherSandbox-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
                </div>
                </div>
                        </div>
                        <div class="sandbox-card-mid"></div>
                        <div class="sandbox-card-bot"></div>
                    </div>
                    <h5 class="sandbox-item-title">` + decodeURI(json.name) + `</h5>
                </div> `
    return html
}

function teacherActivityItem(activity) {
    let ide = 'vittascience'
    if (activity.content.match(/vittascience\.com\/microbit/)) {
        ide = "microbit"
    }
    if (activity.content.match(/vittascience\.com\/python/)) {
        ide = "python"
    }
    if (activity.content.match(/vittascience\.com\/arduino/)) {
        ide = "arduino"
    }

    let html = `<div class="activity-item activity-teacher">
                <div class="${cssClassByActivityType[activity.type]} activity-card activity-card-` + ide + `">
                    <div class="activity-card-top">
                    <div class="dropdown"><i class="fas fa-cog fa-2x" type="button" id="dropdown-activityItem-${activity.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-activityItem-${activity.id}" data-id="${activity.id}">
                <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="attributeActivity(${activity.id})" style="border-bottom:2px solid rgba(0,0,0,.15">` + capitalizeFirstLetter(i18next.t('words.attribute')) + `</li>

                <li style="display: none;"
                 class="dropdown-item classroom-clickable col-12" href="#" onclick="createActivity(null,${activity.id})">` + capitalizeFirstLetter(i18next.t('words.duplicate')) + `</li>

                <li
                style="display: ${activity.type === 'LTI-BLOCKLY' ? 'none': 'default'}"
                class=" classroom-clickable col-12 dropdown-item" onclick="activityModify(${activity.id}, '${activity.type}')" href="#">` + capitalizeFirstLetter(i18next.t('words.modify')) + `</li>
                <li class="dropdown-item modal-activity-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
              </div>
              </div>
                    </div>
                    <div class="activity-card-mid"></div>
                    <div class="activity-card-bot">
                        <div class="info-tutorials" data-id="${activity.id}">
                    </div>
                </div></div>`
    html += `<h3 data-toggle="tooltip" title="${activity.title}" class="activity-item-title">${activity.title}</h3></div>`

    return html;
}

function classeItem(classe, nbStudents, students) {
    function maxLength(array) {
        let count = 0
        for (let i = 0; i < array.length; i++) {
            if (array[i].activities.length > count) {
                count = array[i].activities.length
            }
        }
        return count
    }
    let maxAct = maxLength(students)
    let remainingCorrections = getRemainingCorrections(students);
    let remainingCorrectionsSpanElt = remainingCorrections ? `<span class="results-correcting c-text-secondary"><i class="fas fa-pen"></i></i> ${remainingCorrections}</span>` : '';
    let html = `<div class="class-item"><div class="class-card">
                <div class="class-card-top"  data-id="${classe.id}" data-link="${classe.link}">
                <span><i class="fas fa-user fa-2x"></i></i> ${nbStudents}</span>
                ${remainingCorrectionsSpanElt}
                <div class="dropdown"><i class="fas fa-cog fa-2x" type="button" id="dropdown-classeItem-${classe.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                    <div class="dropdown-menu" aria-labelledby="dropdown-classeItem-${classe.id}">
                <li class="modal-classroom-modify classroom-clickable col-12 dropdown-item" href="#">` + capitalizeFirstLetter(i18next.t('words.modify')) + `</li>
                <li class="dropdown-item modal-classroom-delete classroom-clickable col-12" href="#">` + capitalizeFirstLetter(i18next.t('words.delete')) + `</li>
              </div>
              </div>
                </div>`

    html += `<div class="class-card-mid">
                <h3 class="activity-item-title">${classe.name}</h3>
            </div>`
    html += `<div class="class-card-bot">
                <span class="nb-activities">${maxAct}</span> ` + setActivityPlural(maxAct) + `</p>
            </div>`
    html += `</div></div>`

    return html;
}

function getRemainingCorrections(students) {
    let remainingCorrectionCount = 0;
    for (let student of students) {
        for (let activity of student.activities) {
            if (activity.correction == 1) {
                remainingCorrectionCount++;
            }
        }
    }

    return remainingCorrectionCount;
}

function hasAttribution(student, ref) {
    let attribution = student.activities.filter(x => x.reference == ref)
    if (attribution.length > 0) {
        return true;
    }
    return false;
}

function fullClassHasAttribution(classe, ref) {
    for (let i = 0; i < classe.students.length; i++) {
        if (!hasAttribution(classe.students[i], ref)) {
            return false;
        }
    }
    return true;
}

function classeList(classe, ref = null) {
    let checkedClass = ""
    ClassroomSettings.studentCount = Number($('.student-number').html())
    if (fullClassHasAttribution(classe, ref) == true) {
        checkedClass = "checked"
    }
    let html = `<div class="col-10"><label><input type="checkbox" value="${classe.classroom.id}"${checkedClass} class ="list-students-classroom">${classe.classroom.name}</label>`
    html += `<button class="student-list-button" data-id="${classe.classroom.id}"><i class="fas fa-chevron-right"></i></button>`
    html += `<div class="student-list" id="student-list-${classe.classroom.id}" style="display:none;">
    `
    classe.students.forEach(student => {
        let checked = ""
        if (ref && hasAttribution(student, ref)) {
            checked = "checked"
            ClassroomSettings.studentCount++
        }

        html += '<label class="ml-3 student-attribute-form-row"><input type="checkbox" value="' + student.user.id + '" class="student-id" ' + checked + ' >'
        html += `<img src="${_PATH}assets/media/alphabet/${student.user.pseudo.slice(0, 1).toUpperCase()}.png" alt="Photo de profil"></img>`
        html += student.user.pseudo + '</label>'
    });
    html += `</div></div>`
    $('.student-number').html(ClassroomSettings.studentCount)

    return html;
}
//filter activity
$('body').on('click', '#filter-activity', function () {
    let arrayKeywords = $('#filter-activity-input').val().split(' ')
    let filterValue = $('#filter-activity-select').val();

    if (filterValue === 'asc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
    }
    else if(filterValue === 'desc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
    }
    /* TODO cabri: move to separate plugin */
    else if(filterValue === 'typeGenius') {
      teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['GENIUS']));
    }
    else if(filterValue === 'typeExpress') {
      teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['EXPRESS']));
    }
    else if(filterValue === 'typeIframe') {
      teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords,
        ['IFRAME-PAGE', 'IFRAME-VIDEO', 'STANDARD', 'IMUSCICA', 'IFRAME', 'LTI-BLOCKLY']));
    }
})

$('body').on('change', '#filter-activity-select', function () {
    let arrayKeywords = $('#filter-activity-input').val().split(' ')
    let filterValue = $('#filter-activity-select').val();

    if (filterValue === 'asc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
    }
    else if(filterValue === 'desc') {
        teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
    }
    /* TODO cabri: TODO cabri: move to separate plugin*/
    else if(filterValue === 'typeGenius') {
        teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['GENIUS']));
    }
    else if(filterValue === 'typeExpress') {
        teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['EXPRESS']));
    }
    else if(filterValue === 'typeIframe') {
      teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords,
        ['IFRAME-PAGE', 'IFRAME-VIDEO', 'STANDARD', 'IMUSCICA', 'IFRAME', 'LTI-BLOCKLY']));
    }
})

$(document).on('keyup', function (e) {
    if ($("#filter-activity-input").is(":focus") || $("#filter-activity").is(":focus") || $("#filter-activity-select").is(":focus")) {
        let arrayKeywords = $('#filter-activity-input').val().split(' ')
        let filterValue = $('#filter-activity-select').val();

        if (filterValue === 'asc') {
            teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", false))
        }
        else if(filterValue === 'desc') {
            teacherActivitiesDisplay(filterTeacherActivityInList(arrayKeywords, "id", true))
        }
        /*TODO cabri: move to separate plugin*/
        else if(filterValue === 'typeGenius') {
          teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['GENIUS']));
        }
        else if(filterValue === 'typeExpress') {
          teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords, ['EXPRESS']));
        }
        else if(filterValue === 'typeIframe') {
          teacherActivitiesDisplay(filterTeacherActivityInListByType(arrayKeywords,['IFRAME-PAGE', 'IFRAME-VIDEO', 'STANDARD', 'IMUSCICA', 'IFRAME', 'LTI-BLOCKLY']));
        }
    }
});

//filter sandbox
$('body').on('click', '#filter-sandbox', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }
})

$('body').on('change', '#filter-sandbox-select', function () {
    let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
    if ($('#filter-sandbox-select').val() == 'asc') {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
    } else {
        sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
    }

})

$(document).on('keyup', function (e) {
    if ($("#filter-sandbox-input").is(":focus") || $("#filter-sandbox").is(":focus") || $("#filter-sandbox-select").is(":focus")) {
        let arrayKeywords = $('#filter-sandbox-input').val().split(' ')
        if ($('#filter-sandbox-select').val() == 'asc') {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", false))
        } else {
            sandboxDisplay(filterSandboxInList(arrayKeywords, "id", true))
        }
    }
});
$('body').on('click', '.list-students-classroom', function () {
    let isChecked = $(this).is(':checked')
    let studentCheckbox = $(this).parent().parent().find('.student-list input')
    studentCheckbox.each(function () {
        if (isChecked) {
            $(this).prop('checked', true).change();;
        } else {
            $(this).prop('checked', false).change();;
        }
    });
})
$('body').on('click', '.activity-card', function () {
    if (!$(this).find("i:hover").length && !$(this).find(".dropdown-menu:hover").length) {
        let id = parseInt($(this).find(".info-tutorials").attr("data-id"))
        let state = $(this).find(".info-tutorials").attr("data-state")
        navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities', 'WK' + id, state)
    }
})

function activityWatch(id) {
    navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities', 'WK' + id, '')
}

//ouvre une activité depuis un dashboard
$('body').on('click', '.bilan-cell', function () {
    let self = $(this)
    if (!self.hasClass('no-activity')) {
        navigatePanel('classroom-dashboard-activity-panel', 'dashboard-activities', 'AC' + parseInt(self.attr('data-id')), self.attr("data-state"))
    }

})

$('body').on('click', '#activity-instruction', function () {
    $('#side-div').toggle()
})

function searchActivity(id, users) {
    users.forEach(user => {
        map2 = map1.filter(x => x.id_tutorial_part);
        if (map2 != []) {
            return true;
        }
    });
    return false;
}

function getActivity(id, state = "") {
    if (state == "") {
        return Main.getClassroomManager()._myTeacherActivities.filter(x => x.id == id)[0]
    }
    return Main.getClassroomManager()._myActivities[state].filter(x => x.activity.id == id)[0]
}

function statusActivityForStudent(id, activityList) {
    let activity = activityList.filter(x => x.id_tutorial_part);
    if (activity != []) {
        if (activity.note > 0) {
            return "success";
        } else if (activity.tries > 10) {
            return "failed";
        } else {
            return "in process";
        }

    } else {
        return false
    }
}

function statusActivity(activity, state = true) {
    if (activity.correction == 0 || activity.correction == null) {
        if (state == true)
            return "fas fa-stopwatch"
        if (state == "csv") {
            switch (activity.correction) {
                case 0:
                    return "Pas encore réalisé"
                    break;

                case null:
                    return "Pas encore réalisé"
                    break;

                case undefined:
                    return "Pas attribué"
                    break;

                default:
                    break;
            }
        }
        return "new-activity"
    }
    if (activity.correction == 1) {
        if (state == true)
            return "fas fa-pen";
        if (state == "csv")
            return "à corriger"
        return "todo-activity"
    }
    if (activity.note == 3) {
        if (state == true)
            return "bilan-3";
        if (state == "csv")
            return "très bien"
        return "done-activity"
    } else if (activity.note == 2) {
        if (state == true)
            return "bilan-2";
        if (state == "csv")
            return "bien"
        return "done-activity"
    } else if (activity.note == 1) {
        if (state == true)
            return "bilan-1";
        if (state == "csv")
            return "correct"
        return "done-activity"
    } else {
        if (state == true)
            return "bilan-0";
        if (state == "csv")
            return "à revoir"
        return "done-activity"
    }

}

/**
 * @ToBeRemoved
 * Last check October 2021
 */
// function displayStudentsActivities(link, activitiesList) {
//     Main.getClassroomManager().getUsersInClassroom(link).then(function (students) {
//         students.forEach(student => {

//             activitiesList.forEach(activity => {
//                 if (searchActivity(activity.id, students)) {
//                     switch (statusActivityForStudent(activity.id, student)) {
//                         case "success":
//                             break;
//                         case "failed":
//                             break;
//                         case "in process":
//                             break;
//                         default:
//                     }

//                 }
//             });

//         })
//     })
// }

function loadActivity(isDoable) {
    ClassroomSettings.chrono = Date.now()
    const activityIntroduction = $('#activity-introduction')
    const activityContent = $('#activity-content')
    const activityTitle = $('#activity-title')
    const activityDetails = $('#activity-details')

    activityDetails.html('')
    activityTitle.html('')
    activityContent.html('')
    //activityIntroduction.html('')
    activityIntroduction.hide();
    let baseToolUrl, deploymentId;
        if (Activity.introduction != null && Activity.introduction !== "") {
            $('#text-introduction').html(bbcodeToHtml(Activity.introduction))
            $('#activity-introduction').show()
        }
        activityTitle.html(Activity.activity.title)
        if (UserManager.getUser().isRegular) {
            if (Activity.correction >= 1) {
                activityDetails.html(i18next.t('classroom.activities.activitySubmited')
                    .replace('$1', Activity.user.pseudo)
                    .replace('$2',formatHour(Activity.dateSend)))
            } else {
                activityDetails.html(i18next.t("classroom.activities.noSend"))
            }
        } else {
            if (Activity.correction >= 1) {
                activityDetails.html(i18next.t('classroom.activities.activitySubmited2') + " " + formatHour(Activity.dateSend))
            } else {
                const activitySubmitText = Activity.activity.type === 'IFRAME-PAGE'
                || Activity.activity.type === 'IFRAME-VIDEO'
                || Activity.activity.type === 'IFRAME'
                || Activity.activity.type === 'IFRAME-CABRI3D'
                  ? i18next.t('classroom.activities.dateBeforeAvailable')
                  : i18next.t('classroom.activities.dateBefore')

              activityDetails.html(activitySubmitText +" " +formatDay(Activity.dateEnd))
            }
        }

        var content = Activity.activity.content.replace(/(\[iframe\].*?link=[a-f0-9]{13})/gm, '$1&use=classroom')
        if (Activity.project != null) {
            if (LINK_REGEX.test(Activity.activity.content)) {
                content = content.replace(LINK_REGEX, '$1' + Activity.project.link)
            }
        } else {
            content = content
        }

    let correction = ''
    if (UserManager.getUser().isRegular && (Activity.correction === 1)) {
        correction += `<div class="activity-correction-header d-flex justify-content-between"><h3>` + i18next.t('classroom.activities.bilan.results') + `</h3><i class="fas fa-chevron-right fa-2x" ></i></div><div id='giveNote' ><div onclick="setNote(3,'givenote-3')" id="givenote-3" class="note-choice"><i class="fas fa-check"></i>` + i18next.t('classroom.activities.accept') + ` </div><div onclick="setNote(2,'givenote-2')" id="givenote-2" class="note-choice" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.vgood') + ` </div><div onclick="setNote(1,'givenote-1')" id="givenote-1" class="note-choice" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.good') + ` </div><div onclick="setNote(0,'givenote-0')" id="givenote-0" class="note-choice" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.refuse') + ` </div></div>`
    }
    else if(UserManager.getUser().isRegular && (Activity.correction === 2 || Activity.correction === 3)) {
      correction += `<div class="activity-correction-header d-flex justify-content-between"><h3>` + i18next.t('classroom.activities.bilan.results') + `</h3><i class="fas fa-chevron-right fa-2x" ></i></div><div id='giveNote' ><div onclick="setNote(3,'givenote-3')" id="givenote-3" class="note-choice ${Activity.note===3 ? 'selectNote' : ''}"><i class="fas fa-check"></i>` + i18next.t('classroom.activities.accept') + ` </div><div onclick="setNote(2,'givenote-2')" id="givenote-2" class="note-choice  ${Activity.note===2 ? 'selectNote' : ''}" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.vgood') + ` </div><div onclick="setNote(1,'givenote-1')" id="givenote-1" class="note-choice  ${Activity.note===1 ? 'selectNote' : ''}" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.good') + ` </div><div onclick="setNote(0,'givenote-0')" id="givenote-0" class="note-choice ${Activity.note===0 ? 'selectNote' : ''}" ><i class="fas fa-check"></i>` + i18next.t('classroom.activities.refuse') + ` </div></div>`
    }

    // Display given note (score) to student and teacher
    else if (!UserManager.getUser().isRegular && (Activity.correction === 2 || Activity.correction === 3)) {
          correction += `<div class="activity-correction-header d-flex justify-content-between"><h5>${ i18next.t('classroom.activities.bilan.grade')}</h5></div>`
          if(Activity.note===3)
            correction += `<div id='giveNote' ><div id="givenote-3" class="note-choice"><i class="fas fa-check"></i>${i18next.t('classroom.activities.accept')}</div></div>`
          else if(Activity.note===2)
            correction += `<div id='giveNote' ><div id="givenote-2" class="note-choice"><i class="fas fa-check"></i>${i18next.t('classroom.activities.vgood')}</div></div>`
          else if(Activity.note===1)
            correction += `<div id='giveNote' ><div id="givenote-1" class="note-choice"><i class="fas fa-check"></i>${i18next.t('classroom.activities.good')}</div></div>`
          else if(Activity.note===0)
            correction += `<div id='giveNote' ><div id="givenote-0" class="note-choice"><i class="fas fa-check"></i>${i18next.t('classroom.activities.refuse')}</div></div>`
    }

    //const formatedCommentary = Activity.commentary.replace(/<\/br>/g, 'XX');
    if (UserManager.getUser().isRegular && Activity.correction > 0) {
        correction += '<div id="commentary-panel" class="c-primary-form" style="margin-top: 50px;"><h5>' + i18next.t("classroom.activities.comments") + '</h5><textarea id="commentary-textarea" style="width:90%" rows="8">' + Activity.commentary + '</textarea></div>'
    }




    if (!UserManager.getUser().isRegular && Activity.correction > 0) {
        if (Activity.commentary != null && Activity.commentary != "") {
            correction += '<div id="commentary-panel">' + Activity.commentary + '</div>'
        } else {
            correction += '<div id="commentary-panel">' + i18next.t("classroom.activities.bilan.noComment") + '</div>'
        }
    }

    if (UserManager.getUser().isRegular && Activity.correction > 0) {
        correction += '<button onclick="giveNote()" class="btn c-btn-primary">' + i18next.t('classroom.activities.sendResults') + '<i class="fas fa-chevron-right"> </i></button>'
    }

      // TODO : define global tabs with tabs["name_app"] = "url_app" (to use also in teacher code)
      switch (Activity.activity.type) {
        case "STANDARD":
            baseToolUrl = "https://lti1p3-player.cabricloud.com";
            //baseToolUrl = 'https://d52b-82-216-88-13.eu.ngrok.io';
            deploymentId = 'opensteam-lms_cabri-player';
            break;
        case "IMUSCICA":
          baseToolUrl = "https://workbench-imuscica.cabricloud.com";
          deploymentId = 'opensteam-lms_imuscica';
          break;
        case "EXPRESS":
        case "GENIUS":
        case "LTI-BLOCKLY":
          baseToolUrl = "https://lti1p3.cabricloud.com";
          deploymentId = 'opensteam-lms_cabri-express';
          break;
      }


        //let activityType = Activity.activity.type ? Activity.activity.type.toLowerCase() : Activity.activity.type;
        const activityType = Activity.activity.type;
        // Review student submission by teacher (and by student)
        if(activityType === "EXPRESS" || activityType === "GENIUS" || activityType === "LTI-BLOCKLY"
          || activityType === "STANDARD" || activityType === "IMUSCICA") {  // TODO replace with "if content is LTI"
            if (!isDoable && Activity.correction > 0) {
                if (activityType === "IMUSCICA")
                    activityContent.html('<iframe style="width: 100%; height: 100%;" allowfullscreen="true" frameborder="0" src="https://workbench-imuscica.cabricloud.com/?lesson=' + Activity.url + '" allowfullscreen></iframe>');
                else
                    activityContent.html('<iframe style="width: 100%; height: 100%;" allowfullscreen="true" frameborder="0" src="https://cabricloud.com/ed/opensteam/player?isMobile&calculator=false&clmc=' + Activity.url + '" allowfullscreen></iframe>');
                // TODO cabri: for review, better use the same player version as the one used to create the activity and used by student
            } else if (isDoable) {
                const loginHint = {
                    lineitemId: content,
                    userId: UserManager.getUser().id,
                    isStudentLaunch: true,
                    isDoable: isDoable,
                    activitiesLinkUser: Activity.id,
                    deploymentId
                };

                const ltiStudentLaunch = `
          <input id="activity-score" type="text" hidden/>
          <form id="lti_student_login_form" name="lti_student_login_form" action="${baseToolUrl}/login" method="post" target="lti_student_iframe">
            <input id="lti_student_iss" type="hidden" name="iss" value="${location.origin}" />
            <input id="lti_student_login_hint" type="hidden" name="login_hint"/>
            <input id="lti_student_client_id" type="hidden" name="client_id" value="${deploymentId}" />
            <input id="lti_student_target_link_uri" type="hidden" name="target_link_uri" value="${baseToolUrl}/lti" />
          </form>

          <iframe id="lti_student_iframe" src="about:blank" name="lti_student_iframe" title="Tool Content" width="100%" height="100%" allowfullscreen></iframe>`;


                activityContent.html(ltiStudentLaunch);
                $('#lti_student_login_hint').val(JSON.stringify(loginHint));

                document.forms["lti_student_login_form"].submit();
            }
        }
        else {
            activityContent.html('<iframe style="width: 100%; height: 100%;" allowfullscreen="true" frameborder="0" src="' + Activity.activity.content + '" allowfullscreen></iframe>');
        }
/*        else if(content.startsWith('[iframe]') && isDoable) {
            activityContent.html(bbcodeToHtml(content))
        }
        else if(isDoable) {
            activityContent.html(bbcodeToHtml(content))
        }*/

       if(correction && correction!=='') {
          $('#activity-correction').html(bbcodeToHtml(correction));
          $('#activity-correction-container').show();
       }
  /*
         if (isDoable == false) {
             $('#activity-validate').hide()
             $('#activity-save').hide()
         } else {
             let interface = /\[iframe\].*?vittascience(|.com)\/([a-z]{5,12})\/?/gm.exec(Activity.activity.content)
             $('#activity-validate').show()
             if (interface != undefined && interface != null) {
                 $('#activity-save').show()
             }
         }*/
}

function setActivityPlural(number) {
    switch (i18next.language) {
      case 'fr': return number>1 ? 'activités' : 'activité';
      case 'en': return number===1 ? 'activity' : 'activities';
      case 'es': return number>1 ? 'actividades' : 'actividad';
      default: { // english fallback
        return number===1 ? 'activity' : 'activities';
      }
    }
}
