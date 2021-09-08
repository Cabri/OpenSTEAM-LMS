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

    } else {
        ClassroomSettings.activity = id
        ClassroomSettings.status = 'action';
        Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
            $('#activity-form-title').val(activity.title)
            $('.wysibb-text-editor').html(activity.content)
        })
    }
    navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
    ClassroomSettings.activityInWriting = true
}

function createCabriActivity(link = null, id = null, type) {
  ClassroomSettings.status = "attribute"
  ClassroomSettings.isNew = true;
  if (id == null) {
    if (link) {

      $('.wysibb-text-editor').html('[iframe]' + URLServer + '' + link + '[/iframe]')
    } else {

      $('.wysibb-text-editor').html('')
    }

    $('#activity-form-title').val('')

  } else {
    ClassroomSettings.activity = id
    ClassroomSettings.status = 'action';
    Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
      $('#activity-form-title').val(activity.title)
      $('.wysibb-text-editor').html(activity.content)
    })
  }

  Main.getClassroomManager().canAddActivity({type}).then( data => {
    console.log(data);
    if(!data.canAdd) {
      alert('Cannot add activity because of limitation ');
      return;
    }

    navigatePanel('classroom-dashboard-new-cabriexpress-activity-panel', 'dashboard-activities-teacher')
    ClassroomSettings.activityInWriting = true

    // Start LTI 1.3 tool launch
    const loginHint = {
      userId: UserManager.getUser().id,
      isStudentLaunch: false,
      activityType: type
    };

   // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
    $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
    $('#lti_teacher_iss').val(location.host); // platform url

    document.forms["lti_teacher_login_form"].submit();

  });
}

// Lorsque le stockage local change, regarder l'état de la correction.
window.addEventListener('storage', () => {
    if (Activity.autocorrection && window.localStorage.autocorrect == 'true') {
        if ($('#activity-validate').is(':visible') && window.localStorage.classroomActivity != null) {
            let autocorrection = window.localStorage.classroomActivity
            delete window.localStorage.classroomActivity
            Activity.timePassed += ClassroomSettings.chrono
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
$('body').on('click', '.activity-card-top i', function (event) {
    ClassroomSettings.activity = $(this).parent().parent().parent().find('.info-tutorials').attr('data-id')
})

//activité modal-->supprimer
$('body').on('click', '.modal-activity-delete', function () {
    let confirm = window.confirm("Etes vous sur de vouloir supprimer l'activité'?")
    if (confirm) {
        Main.getClassroomManager().deleteActivity(ClassroomSettings.activity).then(function (activity) {
            displayNotification('#notif-div', "classroom.notif.activityDeleted", "success", `'{"activityName": "${activity.name}"}'`);
            deleteTeacherActivityInList(activity.id);
            teacherActivitiesDisplay();
        })
        ClassroomSettings.activity = null;
    }
})

//activité modal-->modifier
function activityModify(id) {
    ClassroomSettings.activity = id
    $('#activity-form-title').val('')
    $('.wysibb-text-editor').html('')
    Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
        $('#activity-form-title').val(activity.title)
        $('.wysibb-text-editor').html(activity.content)
    })
    ClassroomSettings.status = 'edit';
    navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')

}

//création activité vers attribution
function attributeActivity(id, ref = null) {
    console.log("attribute")
    ClassroomSettings.activity = id
    ClassroomSettings.ref = ref
    $('#list-student-attribute-modal').html('')
    listStudentsToAttribute(ref)
    $('#form-autocorrect').hide()
    ClassroomSettings.willAutocorrect = false;
    Main.getClassroomManager().isActivityAutocorrected().then(function (result) {
        navigatePanel('classroom-dashboard-new-activity-panel3', 'dashboard-activities-teacher', ref)
        if (result) {
            $('#form-autocorrect').show()
        }
    })
}

function undoAttributeActivity(ref) {
    Main.getClassroomManager().undoAttributeActivity(ref).then(function (result) {
        Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(()=>{
            displayNotification('#notif-div', "classroom.notif.attributeActivityUndone", "success");
            navigatePanel('classroom-table-panel-teacher', 'dashboard-classes-teacher', ClassroomSettings.classroom);
        });
    })
}

//ouverture du modal listant les élèves pour leur attribuer l'activité
$('#new-activity-attribute').click(function () {
    pseudoModal.openModal('attribute-activity-modal')
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
    let studentId = $('.student-attribute-form-row')
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
            if (ClassroomSettings.ref != null) {
                Main.getClassroomManager().undoAttributeActivity(ClassroomSettings.ref)
            }
            Main.getClassroomManager().attributeActivity({
                'activity': activity,
                'students': students,
                'classrooms': classrooms,
                "dateBegin": $("#date-begin-activity-form").val(),
                "dateEnd": $("#date-end-activity-form").val(),
                "evaluation": ClassroomSettings.isEvaluation,
                "autocorrection": ClassroomSettings.willAutocorrect,
                "introduction": $("#introduction-activity-form").val(),
                "isFromClassroom": true
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
    $(this).find('i').toggleClass('fa-arrow-right')
    $(this).find('i').toggleClass('fa-arrow-down')
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
            Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(function () {
                teacherActivitiesDisplay()
                ClassroomSettings.activityInWriting = false
            })
        })

    }
})

//création/modification de l'activité de type LTI
$('.new-activity-panel-lti').click(function () {
  $(this).attr('disabled', 'disabled')
  if (document.getElementById('activity-form-title').value.length < 1) {
    displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
    return;
  }
  if (ClassroomSettings.status != 'edit') {
    const ltiID = $('#activity-form-content-lti').val();
    Main.getClassroomManager().addActivity({
      'title': $('#activity-form-title').val(),
      'content': ltiID,
      "isFromClassroom": true,
      'type': JSON.parse($('#lti_teacher_login_hint').val()).activityType
    }).then(function (activity) {
      ClassroomSettings.activity = activity.id
      displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
      $('.new-activity-panel2').attr('disabled', false)
      navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
      addTeacherActivityInList(activity)
      teacherActivitiesDisplay()
      ClassroomSettings.activityInWriting = false
      /*
      // create LTI lineItem
      Main.getClassroomManager().addLtiLineItem({
        'id': ltiID,
        'score_maximum': 100,
        'label': 'label',
        'tag': 'tag',
        'resource_id': activity.id,
        'resource_link_id': activity.id
      }).then(lineItem=>{      });

        console.log('success addLtiLineItem');*/


    });


  } else {
    /*Main.getClassroomManager().editActivity({
      'id': ClassroomSettings.activity,
      'title': $('#activity-form-title').val(),
      'content': $('#activity-form-content').bbcode()
    }).then(function (activity) {
      displayNotification('#notif-div', "classroom.notif.activityChanged", "success", `'{"activityTitle": "${activity.title}"}'`);
      $('.new-activity-panel2').attr('disabled', false)
      navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
      Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(function () {
        teacherActivitiesDisplay()
        ClassroomSettings.activityInWriting = false
      })
    })*/

  }
});

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
