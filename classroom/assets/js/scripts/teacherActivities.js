function createActivity(link = null, id = null) {
    ClassroomSettings.status = "attribute"
    ClassroomSettings.isNew = true;
    if (id == null) {
        if (link) {
            $('.wysibb-text-editor').html('[iframe]' + URLServer + '' + link + '[/iframe]')
        } else {
            $('.wysibb-text-editor').html('')
        }
        $('#activity-form-title').val('')
        navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
        ClassroomSettings.activityInWriting = true
    } else {
        ClassroomSettings.activity = id
        let activityTitle = getActivity(ClassroomSettings.activity).title;
        Main.getClassroomManager().duplicateActivity(id).then(function (response) {
            if (response.success == true) {
                displayNotification('#notif-div', "classroom.notif.activityDuplicated", "success", `'{"activityName": "${activityTitle}"}'`);
                teacherActivitiesDisplay();
                DisplayActivities();
            }
        })
    }
}

function integrateProject(link) {
	launchCustomActivity('reading', false, () => {
		$('#reading-content').execCommand('vittaiframe');
        document.querySelector('#wbbmodal .inp-text').value = link;
		setTimeout(() => {
			document.querySelector('#wbbm-submit').click();
		},20);
	});
}

function showExercicePanel() {
    Main.getClassroomManager().getAllApps().then((apps) => {
        activitiesCreation(apps);
        navigatePanel('classroom-dashboard-proactivities-panel-teacher', 'dashboard-activities-teacher');
    })
}


// Lorsque le stockage local change, regarder l'état de la correction.
window.addEventListener('storage', () => {
    if (Activity.autocorrection && window.localStorage.autocorrect == 'true') {
        if ($('#activity-validate').is(':visible') && window.localStorage.classroomActivity != null) {
            let autocorrection = window.localStorage.classroomActivity
            delete window.localStorage.classroomActivity
            window.localStorage.autocorrect = 'false';

            $("#activity-validate").attr("disabled", "disabled");
            let interface = /\[iframe\].*?vittascience(|.com)\/([a-z]{5,12})\/?/gm.exec(Activity.activity.content)[2]
            let project = window.localStorage[interface + 'CurrentProject']
            let correction = 1
            let note = 0
            if (autocorrection == "success") {
                correction = 2
                note = 3
                navigatePanel('classroom-dashboard-activity-panel-success', 'dashboard-activities')
            } else {
                correction = 3
                navigatePanel('classroom-dashboard-activity-panel-fail', 'dashboard-activities')
            }
            Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interface, Activity.id, correction, note).then(function () {
                actualizeStudentActivities(Activity, correction)
            })
            window.localStorage.classroomActivity = null

        }
    }
});

//activité-->ouvrir la modal
$('body').on('click', '.activity-card-top i', function () {
    ClassroomSettings.activity = $(this).parent().parent().parent().find('.info-tutorials').attr('data-id')
})

// get activity id in list mode
$('body').on('click', '.activity-list-options i', function () {
    ClassroomSettings.activity = $(this).attr('id').replace("dropdown-list-activityItem-", "");
})

function persistDeleteActivity() {
    let validation = $('#validation-delete-activity').val();
    let placeholderWord = $('#validation-delete-activity').attr('placeholder');
    if (validation == placeholderWord) {
        let activityTitle = getActivity(ClassroomSettings.activity).title;
        Main.getClassroomManager().deleteActivity(ClassroomSettings.activity).then(function (activity) {
            displayNotification('#notif-div', "classroom.notif.activityDeleted", "success", `'{"activityName": "${activityTitle}"}'`);
            deleteTeacherActivityInList(activity.id);
            teacherActivitiesDisplay();
            DisplayActivities();
            pseudoModal.closeModal('delete-activity-modal');
            $('#validation-delete-activity').val("");
        })
        ClassroomSettings.activity = null;
    } else {
        displayNotification('#notif-div', "manager.input.writeDelete", "error");
    }
}

function cancelDeleteActivity() {
    pseudoModal.closeModal('delete-activity-modal');
}

//activité modal-->supprimer
$('body').on('click', '.modal-activity-delete', function () {
    pseudoModal.openModal('delete-activity-modal');
    let activityId = ClassroomSettings.activity,
        courseArray = [];
    coursesManager.myCourses.forEach(course => {
        if (course.activities.find(c => c.id == activityId)) {
            courseArray.push(course.title);
        }
    });
    document.getElementById('activity-linked-to-course-message').style.display = courseArray.length > 0 ? 'block' : 'none';
})


function activityModify(id) {

    hideAllActivities();

    if (id == 0) {
        id = Main.getClassroomManager()._lastCreatedActivity;
    }

    ClassroomSettings.activity = id
    $('#activity-form-title').val('')
    $('.wysibb-text-editor').html('')
    Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
        if (activity.type != "") {
            manageUpdateByType(activity);
        } else {
            $('#activity-form-title').val(activity.title)
            $('.wysibb-text-editor').html(activity.content)

            navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
        }
    })
    ClassroomSettings.status = 'edit';
}

function manageUpdateByType(activity) {
    setTextArea();
    const contentForwardButtonElt = document.getElementById('content-forward-button');

    // Merge old activity to reading activity
    activity.type == null ? activity.type = "reading" : activity.type;

    Main.getClassroomManager()._createActivity.id = activity.type;
    Main.getClassroomManager()._createActivity.function = "update";
    
    contentForwardButtonElt.style.display = 'inline-block';

    $('#global_title').val(activity.title);
    Main.getClassroomManager()._createActivity.title = activity.title;

    switch (activity.type) {
        case "free":
            manageUpdateForFree(activity);
            break;
        case "quiz":
            manageUpdateForQuiz(activity);
            break;
        case "fillIn":
            manageUpdateForFillIn(activity);
            break;
        case "reading":
        case null:
            manageUpdateForReading(activity);
            break;
        case "dragAndDrop":
            manageUpdateForDragAndDrop(activity);
            break;
        default:
            contentForwardButtonElt.style.display = 'none';
            Main.getClassroomManager()._createActivity.content.description = JSON.parse(activity.content).description;
            launchLtiDeepLinkCreate(activity.type, true);
            $("#activity-custom").show();
            break;
    }
    
    navigatePanel('classroom-dashboard-classes-new-activity', 'dashboard-activities-teacher');
}


function manageUpdateForFree(activity) {
    $('#activity-free').show();
    let content = JSON.parse(activity.content);
    if (content.description != "" && content.description != null) {
        $('#free-content').htmlcode(bbcodeToHtml(content.description));
    }

    // set tolerance 
    if (content.tolerance != null) {
        $('#free-tolerance').val(activity.tolerance);
    }

    if (activity.isAutocorrect) {
        $("#free-autocorrect").prop("checked", true)
        $("#free-correction-content").show();
    } else {
        $("#free-autocorrect").prop("checked", false)
        $("#free-correction-content").hide();
    }
    if (activity.solution != "") {
        if (JSON.parse(activity.solution) != null && JSON.parse(activity.solution) != "") {
            $('#free-correction').htmlcode(bbcodeToHtml(JSON.parse(activity.solution)));
        }
    }
}

function manageUpdateForQuiz(activity) {
    let solution = JSON.parse(activity.solution),
    content = JSON.parse(activity.content);
    $('#quiz-suggestions-container').html('');
    for (let i = 1; i < solution.length+1; i++) {
        let divToAdd = `<div class="form-group c-primary-form" id="quiz-group-${i}">
                            <label for="quiz-suggestion-${i}" id="quiz-label-suggestion-${i}">Proposition ${i}</label>
                            <button class="btn c-btn-grey mx-2" data-i18n="newActivities.delete" id="quiz-button-suggestion-${i}" onclick="deleteQuizSuggestion(${i})">Delete</button>

                            <div class="input-group mt-3">
                                <input type="text" id="quiz-suggestion-${i}" class="form-control" value="${solution[i-1].inputVal}">
                                <div class="input-group-append">
                                    <div class="input-group-text c-checkbox c-checkbox-grey">
                                        <input class="form-check-input" type="checkbox" id="quiz-checkbox-${i}" ${solution[i-1].isCorrect ? "checked" : ""}>
                                        <label class="form-check-label" for="quiz-checkbox-${i}" id="label-quizz-${i}"  data-i18n="classroom.activities.correctAnswer">Réponse correcte</label>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        $('#quiz-suggestions-container').append(divToAdd);
        $(`#quiz-button-suggestion-${i}`).localize();
        $(`#label-quizz-${i}`).localize();
    }

    $('#quiz-states').htmlcode(bbcodeToHtml(content.states));
    $('#quiz-hint').val(content.hint);

    if (activity.isAutocorrect) {
        $("#quiz-autocorrect").prop("checked", true);
    } else {
        $("#quiz-autocorrect").prop("checked", false);
    }
    $('#activity-quiz').show();
}

function manageUpdateForFillIn(activity) {
    $('#activity-fill-in').show();
    let content = JSON.parse(activity.content);
    $("#fill-in-states").htmlcode(bbcodeToHtml(content.states));
    $("#fill-in-hint").val(content.hint);
    $("#fill-in-tolerance").val(activity.tolerance);
    $("#fill-in-content").htmlcode(bbcodeToHtml(content.fillInFields.contentForTeacher));
    activity.isAutocorrect ? $("#fill-in-autocorrect").prop("checked", true) : $("#fill-in-autocorrect").prop("checked", false);
}

function manageUpdateForReading(activity) {
    let contentParsed = "";
    if (IsJsonString(activity.content)) {
        contentParsed = bbcodeToHtml(JSON.parse(activity.content).description);
    } else {
        contentParsed = activity.content;
    }
    $("#reading-content").htmlcode((contentParsed));
    $("#activity-reading").show();
}


function manageUpdateForDragAndDrop(activity) {
    $('#activity-drag-and-drop').show();
    let content = JSON.parse(activity.content);
    $("#drag-and-drop-hint").val(content.hint);
    $("#drag-and-drop-states").htmlcode(bbcodeToHtml(content.states));
    $("#drag-and-drop-content").htmlcode(bbcodeToHtml(content.dragAndDropFields.contentForTeacher));
    activity.isAutocorrect ? $("#drag-and-drop-autocorrect").prop("checked", true) : $("#drag-and-drop-autocorrect").prop("checked", false);
}

//création activité vers attribution
function attributeActivity(id, ref = null) {

    $("#assign-total-student-number").text(0);

    Main.getClassroomManager()._idActivityOnAttribution = id;
   
    if (id == 0) {
        id = Main.getClassroomManager()._lastCreatedActivity;
    }
    ClassroomSettings.activity = id
    ClassroomSettings.ref = ref
    document.getElementsByClassName('student-number')[0].textContent = '0';
    $('#list-student-attribute-modal').html('')
    listStudentsToAttribute(ref)
    $('#form-autocorrect').hide()
    ClassroomSettings.willAutocorrect = false;
    navigatePanel('classroom-dashboard-new-activity-panel3', 'dashboard-activities-teacher', ref);
}



function undoAttributeActivity(ref,title,classroomId) {
    Main.getClassroomManager().undoAttributeActivity(ref,classroomId).then(function (result) {
        Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(()=>{
            displayNotification('#notif-div', "classroom.notif.attributeActivityUndone", "success");
            navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom);
        });
    })
}

//ouverture du modal listant les élèves pour leur attribuer l'activité
$('#new-activity-attribute').click(function () {
    pseudoModal.openModal('attribute-activity-modal');
    $("#attribute-activity-modal").localize();
})

//fermeture du modal
$('body').on('click', '#attribute-activity-to-students-close', function () {
    $('#attribute-activity-modal').hide()
})

// attribution de l'activité
$('body').on('click', '#attribute-activity-to-students', function () {
    $(this).attr('disabled', 'disabled')
    let students = []
    let classrooms = []
    let studentId = $('#attribute-activity-modal .student-attribute-form-row')
    const retroAttribution = $('#retro-attribution-activity-form').prop('checked')
    for (let i = 0; i < studentId.length; i++) {
        if ($(studentId[i]).find(".student-id").is(':checked')) {
            students.push($(studentId[i]).find(".student-id").val())
            let classId = $(studentId[i]).parent().attr("id").substring(13)
            if (!classrooms.includes(classId)) {
                classrooms.push(classId)
            }
        }
    }
    if (students.length == 0) {
        $('#attribute-activity-to-students').attr('disabled', false)
        displayNotification('#notif-div', "classroom.notif.mustAttributeToStudent", "error")
    } else {
        Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')
            $('.student-number').html(0)

            /** @ToBeDeleted last check Novembre 2021 */
            /* if (ClassroomSettings.ref != null) {
                Main.getClassroomManager().undoAttributeActivity(ClassroomSettings.ref)
            } */

            
            Main.getClassroomManager().attributeActivity({
                'activity': activity,
                'students': students,
                'classrooms': classrooms,
                "dateBegin": $("#date-begin-activity-form").val(),
                "dateEnd": $("#date-end-activity-form").val(),
                "evaluation": ClassroomSettings.isEvaluation,
                "autocorrection": ClassroomSettings.willAutocorrect,
                "introduction": $("#introduction-activity-form").val(),
                "isFromClassroom": true,
                "retroAttribution" : retroAttribution,
                "ref" : ClassroomSettings.ref
            }).then(function () {
                Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(function () {
                    if (ClassroomSettings.ref == null) {
                        displayNotification('#notif-div', "classroom.notif.activityAttributed", "success", `'{"activityTitle": "${activity.title}"}'`);
                    } else {
                        displayNotification('#notif-div', "classroom.notif.activityAttributionChanged", "success", `'{"activityTitle": "${activity.title}"}'`);
                        ClassroomSettings.ref = null;
                    }
                    $('#attribute-activity-to-students').attr('disabled', false)
                    ClassroomSettings.activity = false
                });
            })

        });
    }
})

//déplie/replie la liste des étudiants
$('body').on('click', '.student-list-button', function () {
    $(this).next().toggle()
    $(this).find('i').toggleClass('fa-chevron-right')
    $(this).find('i').toggleClass('fa-chevron-down')
})

//création/modification de l'activité
$('.new-activity-panel2').click(function () {
    $(this).attr('disabled', 'disabled')
    if (document.getElementById('activity-form-title').value.length < 1) {
        displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
        $(this).attr('disabled', false);
        return;
    }
    if (ClassroomSettings.status != 'edit') {
        // Activity creation (not in edit status)
        Main.getClassroomManager().addActivity({
            'title': $('#activity-form-title').val(),
            'content': $('#activity-form-content').bbcode(),
            "isFromClassroom": true
        }).then(function (activity) {
            $('.new-activity-panel2').attr('disabled', false)
            if (activity.errors) {
                for (let error in activity.errors) {
                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                }
            }else{
                ClassroomSettings.activity = activity.id;
                displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
                navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity);
                addTeacherActivityInList(activity);
                teacherActivitiesDisplay();
                ClassroomSettings.activityInWriting = false;
            }
        });


    } else {
        Main.getClassroomManager().editActivity({
            'id': ClassroomSettings.activity,
            'title': $('#activity-form-title').val(),
            'content': $('#activity-form-content').bbcode()
        }).then(function (activity) {
            displayNotification('#notif-div', "classroom.notif.activityChanged", "success", `'{"activityTitle": "${activity.title}"}'`);
            $('.new-activity-panel2').attr('disabled', false)
            navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
            DisplayActivities();
        })

    }
})

function DisplayActivities() {
    Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(function () {
        teacherActivitiesDisplay()
        ClassroomSettings.activityInWriting = false
    })
}

function listStudentsToAttribute(ref = null) {
    let classes = Main.getClassroomManager()._myClasses
    if (classes.length == 0) {
        $('#attribute-activity-to-students-close').after(NO_CLASS)
        $('#attribute-activity-to-students-close').hide()

    } else {
        classes.forEach(element => {
            $('#list-student-attribute-modal').append(classeList(element, ref))
        });
        $('.no-classes').remove()
        $('#attribute-activity-to-students-close').show()
    }
}

function teachersList() {
    let teachers = Main.getClassroomManager()._myTeachers
    let html = ''
    teachers.forEach(function (t) {
        html += '<option value="' + t.user.id + '">' + t.user.firstname + ' ' + t.user.surname + '</option>'
    })
    $('#help-student-select').append(html)

}