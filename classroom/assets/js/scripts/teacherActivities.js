function isValidUrl(url) {
    const expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    const regex = new RegExp(expression);
    if (!regex.test(url)) {
        displayNotification('#notif-div', "classroom.notif.invalidUrl", "error");
        $(this).attr('disabled', false);
        return false;
    }
    return true;
}

function createActivity(link = null, id = null, type) {
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
    navigatePanel('classroom-dashboard-other-activity-type-panel', 'dashboard-activities-teacher')
    ClassroomSettings.activityInWriting = true
}

function createActivityPlayer(player) {
    Main.getClassroomManager().canAddActivity({type: 'PLAYER'}).then(data => {
        if (!data.canAdd) {
            pseudoModal.openModal('add-activity-limitation');
            return;
        }

        const title = $('#activity-form-title-iframe').val();
        if (title.length < 1) {
            displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
            $(this).attr('disabled', false);
            return;
        } else {
            $('#activity-form-title-iframe').val("");
            navigatePanel('classroom-dashboard-activity-player', 'dashboard-activities-teacher')
            if(player === "others")
                $("#activity-url-player-container").show();
            else
                $("#activity-url-player-container").hide();
            ClassroomSettings.title = title;
            ClassroomSettings.player = player;
        }

        ClassroomSettings.activityInWriting = true
    });
}

// This is the first step to create an iframe activity
function createActivityIframe() {
    Main.getClassroomManager().canAddActivity({type: 'IFRAME'}).then( data => { // type others
        if (!data.canAdd) {
            pseudoModal.openModal('add-activity-limitation');
            return;
        }

        const title = $('#activity-form-title-iframe').val();
        if (title.length < 1) {
            displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
            $(this).attr('disabled', false);
            return;
        } else {
            $('#activity-form-title-iframe').val("");
            navigatePanel('classroom-dashboard-url-activity-panel', 'dashboard-activities-teacher')
            ClassroomSettings.title = title;
        }

        ClassroomSettings.activityInWriting = true
    });

}

function createCabriIframeActivity(link = null, id = null) {
  ClassroomSettings.status = "attribute"
  ClassroomSettings.isNew = true;
  if (id == null) {

    if (link) {
      $('.wysibb-text-editor').html('[iframe]' + URLServer + '' + link + '[/iframe]')
    } else {
      $('.wysibb-text-editor').html('') // me pass here
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

  Main.getClassroomManager().canAddActivity({type: 'IFRAME'}).then( data => {
    if (!data.canAdd) {
      pseudoModal.openModal('add-activity-limitation');
      return;
    }

    navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
    ClassroomSettings.activityInWriting = true
  });
}

function createCabriLtiActivity(link = null, id = null, type) {
  ClassroomSettings.status = "attribute"
  ClassroomSettings.isNew = true;
  const targetId = "classroom-dashboard-new-cabriexpress-activity-panel";


  if(type === "player") {
      let file;
      let isUrl = false;

      let urlFile = document.getElementById("activity-url-notebook");
      let loadFile = document.getElementById("notebook");

      if (urlFile && urlFile.value && urlFile !== "") {
        file = urlFile.value;
          console.log("File : ", file);
        isUrl = true;
      }
      else {
          if (loadFile.files.length === 1) {
              console.log("File : ", loadFile.files[0]);
              file = loadFile.files[0];
              isUrl = false;
          } else {
              // TODO : notif remplir un des champs
              return;
          }
      }

      if(isUrl && !isValidUrl(urlFile.value)) return;

      let data = {
          type: isUrl ? "url" : "file",
          value: file
      }

      let sendFile = (event) => {
          console.log("event origin : ", event.origin);
          console.log("event source : ", event.source);
          console.log("event data : ", event.data);

          if(event.data.type === "loaded") {
              let iframeTarget = document.getElementById("lti_teacher_iframe");
              //console.log("target : ", iframeTarget);

              // to wait SceneUpdater load in player TODO : improve loading in iMuSciCA player
              setTimeout(()=> {
                  iframeTarget.contentWindow.postMessage(data, event.origin);
              }, 1000);
          }
      };

      window.addEventListener("message", sendFile);

      // to clear form and event
      window.addEventListener("Navigate", (event) => {
          $(urlFile).val("");
          $(loadFile).val("");
          if(!(event.detail.id === targetId))
            window.removeEventListener("message", sendFile);
      });

      type = ClassroomSettings.player;
  }

    if (id == null) {
        // creation
        if (link) {

            $('.wysibb-text-editor').html('[iframe]' + URLServer + '' + link + '[/iframe]')
        } else {

            $('.wysibb-text-editor').html('')
        }

        $('#activity-lti-form-title').val('')

    } else {
        // edition
        ClassroomSettings.activity = id
        ClassroomSettings.status = 'action';
        Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
            $('#activity-lti-form-title').val(activity.title)
            $('.wysibb-text-editor').html(activity.content)
        })
    }

  Main.getClassroomManager().canAddActivity({type}).then( data => {
    if(!data.canAdd) {
      pseudoModal.openModal('add-activity-limitation');
      return;
    }


    let baseToolUrl;
    let isNeedTitle = false;
      switch (type) {
          case "standard":
              return; // TODO: to do later
          case "imuscica":
              baseToolUrl = "https://workbench-imuscica.cabricloud.com";
              break;
          default:
              baseToolUrl = "https://lti1p3.cabricloud.com";
              isNeedTitle = true;
              break;
      }

      $('#lti-loader-container').html(
        `
            <input id="activity-form-content-lti" type="text" hidden/>
            <form name="lti_teacher_login_form" action="${baseToolUrl}/login" method="post" target="lti_teacher_iframe">
              <input id="lti_teacher_iss" type="hidden" name="iss"/>
              <input id="lti_teacher_login_hint" type="hidden" name="login_hint"/>
              <input id="lti_teacher_client_id" type="hidden" name="client_id" value="client_id_php" />
              <input id="lti_teacher_target_link_uri" type="hidden" name="target_link_uri" value="${baseToolUrl}/deeplink" />
            </form>
            <div style="width: 100%; height: 100%;">
                <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" width="100%"  height="100%" allowfullscreen></iframe>
            </div>`
      );

    navigatePanel(targetId, 'dashboard-activities-teacher')

      if(isNeedTitle) {
          pseudoModal.openModal('add-lti-activity-name');
          // todo cabri must remove previous exit events listeners before setting a new one !
          pseudoModal.clickOnExit('add-lti-activity-name', ()=>{
              navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
          });
      } else {
          $('#activity-lti-form-title').val(ClassroomSettings.title);
      }
    ClassroomSettings.activityInWriting = true

    // Start LTI 1.3 tool launch
    const loginHint = {
      userId: UserManager.getUser().id,
      isStudentLaunch: false,
      activityType: type
    };

   // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
    $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
    $('#lti_teacher_iss').val(location.origin); // platform url
    document.forms["lti_teacher_login_form"].submit();

  });
}

/*function createCabriLtiActivity(link = null, id = null, type) {
    ClassroomSettings.status = "attribute"
    ClassroomSettings.isNew = true;
    if (id == null) {
        // creation
        if (link) {

            $('.wysibb-text-editor').html('[iframe]' + URLServer + '' + link + '[/iframe]')
        } else {

            $('.wysibb-text-editor').html('')
        }

        $('#activity-lti-form-title').val('')

    } else {
        // edition
        ClassroomSettings.activity = id
        ClassroomSettings.status = 'action';
        Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
            $('#activity-lti-form-title').val(activity.title)
            $('.wysibb-text-editor').html(activity.content)
        })
    }

    Main.getClassroomManager().canAddActivity({type}).then( data => {
        if(!data.canAdd) {
            pseudoModal.openModal('add-activity-limitation');
            return;
        }

        navigatePanel('classroom-dashboard-new-cabriexpress-activity-panel', 'dashboard-activities-teacher')
        pseudoModal.openModal('add-lti-activity-name');
        // todo cabri must remove previous exit events listeners before setting a new one !
        pseudoModal.clickOnExit('add-lti-activity-name', ()=>{
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
        });
        ClassroomSettings.activityInWriting = true

        // Start LTI 1.3 tool launch
        const loginHint = {
            userId: UserManager.getUser().id,
            isStudentLaunch: false,
            activityType: type
        };

        // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
        $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
        $('#lti_teacher_iss').val(location.origin); // platform url
        $('#lti_teacher_iframe').css({'filter': 'blur(5px)', 'pointer-events': 'none'})
        document.forms["lti_teacher_login_form"].submit();

    });
}*/

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
  pseudoModal.openModal('activity-delete-confirm')
})

//activité modal-->modifier
function activityModify(id) {
    ClassroomSettings.activity = id
    $('#activity-form-title').val('')
    $('.wysibb-text-editor').html('')
    Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
        ClassroomSettings.status = 'edit';

        if(!activity.type || activity.type === 'IFRAME') {
          // Other Activity type
          $('#activity-form-title').val(activity.title)
          $('.wysibb-text-editor').html(activity.content)
          navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
        }
        else {
          // Cabri Activity
          $('#activity-lti-form-title').val(activity.title)
          navigatePanel('classroom-dashboard-new-cabriexpress-activity-panel', 'dashboard-activities-teacher')

          // update modal title
          $('#add-lti-activity-name .vitta-modal-header .vitta-modal-title').html();

          pseudoModal.openModal('add-lti-activity-name');
          // todo cabri must remove previous exit event listeners before setting a new one !
          pseudoModal.clickOnExit('add-lti-activity-name', ()=>{
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
          });

          // Start LTI 1.3 tool launch
          const loginHint = {
            userId: UserManager.getUser().id,
            isStudentLaunch: false,
            isUpdate: true,
            updateURL: activity.content,
            activityType: activity.type
          };

          // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
          $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
          $('#lti_teacher_iss').val(location.origin); // platform url

          document.forms["lti_teacher_login_form"].submit();
        }
    })
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
$('.new-activity-iframe').click(function () {
    $(this).attr('disabled', 'disabled');

    let url = $('#activity-form-content-iframe').val();

    const expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    const regex = new RegExp(expression);
    if (!regex.test(url)) {
        displayNotification('#notif-div', "classroom.notif.invalidUrl", "error");
        $(this).attr('disabled', false);
        return;
    }

    if(url.startsWith("www"))
        url = "http://" + url;


    if (ClassroomSettings.status != 'edit') {
        // Activity creation (not in edit status)
        Main.getClassroomManager().addActivity({
            'title': ClassroomSettings.title,
            'content': url,
            "isFromClassroom": true,
            'type': 'IFRAME'
        }).then(function (activity) {
            $('.new-activity-iframe').attr('disabled', false)
            if (activity.errors) {
                for (let error in activity.errors) {
                    displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                }
            }else{
                ClassroomSettings.activity = activity.id;
                displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
                $('#activity-form-content-iframe').val("");
                navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity);
                addTeacherActivityInList(activity);
                teacherActivitiesDisplay();
                ClassroomSettings.activityInWriting = false;
            }
        });
    } else {
        Main.getClassroomManager().editActivity({
            'id': ClassroomSettings.activity,
            'title': ClassroomSettings.title,
            'content': $('#activity-form-content-iframe').val()
        }).then(function (activity) {
            displayNotification('#notif-div', "classroom.notif.activityChanged", "success", `'{"activityTitle": "${activity.title}"}'`);
            $('.new-activity-iframe').attr('disabled', false)
            navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
            Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(function () {
                teacherActivitiesDisplay()
                ClassroomSettings.activityInWriting = false
            })
        })

    }
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
            "isFromClassroom": true,
            'type': 'IFRAME'
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
    console.log("ClassroomSettings.status : ", ClassroomSettings.status)
  $(this).attr('disabled', 'disabled')
  if (document.getElementById('activity-lti-form-title').value.length < 1) {
    displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
    return;
  }
  if (ClassroomSettings.status !== 'edit') {
    // activity creation
    const ltiID = $('#activity-form-content-lti').val();
    Main.getClassroomManager().addActivity({
      'title': $('#activity-lti-form-title').val(),
      'content': ltiID,
      "isFromClassroom": true,
      'type': JSON.parse($('#lti_teacher_login_hint').val()).activityType
    }).then(function (activity) {
      ClassroomSettings.activity = activity.id
      displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
      $('.new-activity-panel-lti').attr('disabled', false);

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
    // activity update
    const ltiID = $('#activity-form-content-lti').val();
    Main.getClassroomManager().editActivity({
      'id': ClassroomSettings.activity,
      'title': $('#activity-lti-form-title').val(),
      'content': ltiID,
    }).then((activity)=>{
      displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
      $('.new-activity-panel-lti').attr('disabled', false);
      navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
      Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager()).then(function () {
        teacherActivitiesDisplay()
        ClassroomSettings.activityInWriting = false
      })
    });
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
