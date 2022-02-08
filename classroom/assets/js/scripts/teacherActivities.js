/* TODO The code that manage cabri files and drag/drop
     must move to a separate file or plugin */
window.addEventListener("Navigate", function (event) {
    $("#is_drop").hide();
    // Stop iframe connections after changing the page
    const previousPanel = event.detail ? event.detail.previousPanel : undefined;
    if(previousPanel==='classroom-dashboard-new-lti-activity-panel')
      $('#lti-loader-container').empty();
    else if(previousPanel==='classroom-dashboard-activity-panel')
      $('#activity-content').empty();
});

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

function dropHandler(ev) {
    ev.preventDefault();
    const dropZone = $("#drop_zone");

    /* TODO : print error when file is not clmc */
    if (ev.dataTransfer.items) {
        if (ev.dataTransfer.items[0].kind === "file") {
            let file = ev.dataTransfer.items[0].getAsFile();
            dropZone.data("file", file);
            $("#activity-url-notebook").val("");
            $("#is_drop").show();
        }
    } else {
        if (ev.dataTransfer.files) {
            let file = ev.dataTransfer.files[0];
            dropZone.data("file", file);
            $("#activity-url-notebook").val("");
            $("#is_drop").show();
        } else {
            // TODO : notif was not load
        }
    }
    dropZone.css("filter", "");
}

function dragOverHandler(ev) {
    ev.preventDefault();

    let dropZone = $("#drop_zone");
    dropZone.css("filter", "grayscale(0.70)");
}

function dragLeaveHandler(ev) {
    ev.preventDefault();

    let dropZone = $("#drop_zone");
    dropZone.css("filter", "");
}

function onFileHasBeenChoose() {
    $("#activity-url-notebook").val("");
    $("#is_drop").show();
}

/**
 * Manage the display content
 */
function onClickTabActivity(element) {
    const tabClicked = $(element);
    const currentSelectedTab = $(".selected-other-activity");

    if(!tabClicked[0].isSameNode(currentSelectedTab[0])) {
        const idOfCurrentPanel = currentSelectedTab.data("idPanel");
        $('#' + idOfCurrentPanel).css("display", "none");

        const idOfWantedPanel = tabClicked.data("idPanel");
        $('#' + idOfWantedPanel).css("display", "flex");

        currentSelectedTab.removeClass("selected-other-activity");
        tabClicked.addClass("selected-other-activity");
    }
}

/* For panel players */
/* TODO The code bellow must be inside a function */
const playersPanel = [
    {
      "type": "GENIUS",
      "img": "assets/media/logo_apps_cabri/smart.svg",
    },
    {
      "type": "EXPRESS",
      "img": "assets/media/logo_apps_cabri/express.svg",
    },
    {
        "type": "STANDARD",
        "img": "assets/media/logo_apps_cabri/standard.svg",
    },
    {
        "type": "IMUSCICA",
        "img": "assets/media/logo_apps_cabri/imuscica.svg",
    },
    {
        "type": "IFRAME",
        "img": "assets/media/logo_apps_cabri/other.svg",
    },
    {
      "type": "IFRAME-CABRI3D",
      "img": "assets/media/logo_apps_cabri/cabri3d.png"
    }
];
let playersPanelHtml = "";

for(let playerCard of playersPanel){
    playersPanelHtml += `
            <div class='card-app' onclick="createOtherActivity('${playerCard['type']}')">
                <img class='card-img-top interface-img' src='${playerCard['img']}' alt='${playerCard['type']}'>
                <div class='card-body-app'>
                    <h5 class='card-title' data-i18n='classroom.activities.players.${playerCard['type']}.title'></h5>
                    <p class='interface-description' data-i18n='classroom.activities.players.${playerCard['type']}.description'></p>
                </div>
            </div>
            `;
}

document.getElementById('player-panel').innerHTML = playersPanelHtml;

/* For panel iframe */
const iframesPanel = [
    {
        "type": "IFRAME-VIDEO",
        "img": "assets/media/logo_apps_cabri/video.svg",
    },
    {
        "type": "IFRAME-PAGE",
        "img": "assets/media/logo_apps_cabri/web.svg",
    }
];

let iframesPanelHtml = "";

for(let iframeCard of iframesPanel){
    iframesPanelHtml += `
            <div class='card-app' onclick="createOtherActivity('${iframeCard['type']}')">
                <img class='card-img-top interface-img' src='${iframeCard['img']}' alt='${iframeCard['type']}'>
                <div class='card-body-app'>
                    <h5 class='card-title' data-i18n='classroom.activities.iframes.${iframeCard['type']}.title'></h5>
                    <p class='interface-description' data-i18n='classroom.activities.iframes.${iframeCard['type']}.description'></p>
                </div>
            </div>
            `;
}

document.getElementById('web-panel').innerHTML = iframesPanelHtml;

/* For send file to player */
let sendFile = (event) => {
    if(event.data.type === "loaded") {
        let iframeTarget = document.getElementById("lti_teacher_iframe");
        // to wait SceneUpdater load in player TODO : improve loading in iMuSciCA player
        setTimeout(()=> {
            iframeTarget.contentWindow.postMessage(ClassroomSettings.message, event.origin);
        }, 1000);
    }
};
window.addEventListener("message", sendFile);


/* TODO Code too complicated
    Must refactor these functions: createActivity(), createOtherActivity(),  createActivityPlayer(), createActivityIframe()*/
function createOtherActivity(type) {
    /*if(type)
        type = type.toUpperCase();*/

    if(type==="EXPRESS" || type==='GENIUS')
        createCabriActivity(null, type, null)
    else if(type === "STANDARD" || type === "IMUSCICA" || type === "IFRAME" || type === "IFRAME-CABRI3D")
        createActivityPlayer(type)
    else
        createActivityIframe(type)
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

    $("#choose-player").click(); // active first tabs
    navigatePanel('classroom-dashboard-other-activity-type-panel', 'dashboard-activities-teacher')
    ClassroomSettings.activityInWriting = true
}

function createActivityPlayer(player) {
    Main.getClassroomManager().canAddActivity({type: 'PLAYER'}).then(data => {
        if (!data.canAdd) {
            pseudoModal.openModal('add-activity-limitation');
            return;
        }

        /*const title = $('#activity-form-title-others').val();
        if (title.length < 1) {
            displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
            $(this).attr('disabled', false);
            return;
        } else {
            $('#activity-form-title-others').val("");*/
            if(ClassroomSettings.status !== "edit") {
                $("#activity-form-title-others_player").val("");
                $("#activity-url-player").val("");
                $("#activity-url-notebook").val("");
                $("#notebook").val("");
                $("#drop_zone").data("file", null);
                //$("#activity-notebook-update-message").hide();
            }
            navigatePanel('classroom-dashboard-activity-player', 'dashboard-activities-teacher')
            if(player === "IFRAME")
                $("#activity-url-player-container").show();
            else {
              $("#activity-url-player-container").hide();
              if(player==='IFRAME-CABRI3D')
                $("#activity-url-player").val('https://gallery.cabri.com/player');
            }
            //ClassroomSettings.title = title;
            ClassroomSettings.player = player;
        //}

        ClassroomSettings.activityInWriting = true
    });
}

// This is the first step to create an iframe activity
function createActivityIframe(type) {
    Main.getClassroomManager().canAddActivity({type}).then( data => { // type others
        if (!data.canAdd) {
            pseudoModal.openModal('add-activity-limitation');
            return;
        }

        /*const title = $('#activity-form-title-others').val();
        if (title.length < 1) {
            displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
            $(this).attr('disabled', false);
            return;
        } else {*/
            navigatePanel('classroom-dashboard-url-activity-panel', 'dashboard-activities-teacher')
            //ClassroomSettings.title = title;
        //}
        $('#activity-form-title-others_iframe').val("");

        ClassroomSettings.activityInWriting = true
        ClassroomSettings.iframeActivityType = type;
    });

}

function extractCabriPlayerData(type, button) {
    let file;
    let isUrl = false;

    const title = document.getElementById('activity-form-title-others_player');
    if (title.value.length < 1) {
      displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
      $(button).attr('disabled', false);
      return false;
    }
    ClassroomSettings.title = title.value;

    if(type === 'IFRAME' || type === 'IFRAME-CABRI3D') {
      const playerURL = $('#activity-url-player').val();
      if(playerURL.length<1) {
        displayNotification('#notif-div', "classroom.notif.activityPlayerMissing", "error");
        $(button).attr('disabled', false);
        return false;
      }
      ClassroomSettings.playerURL = playerURL;
    }


    let urlFile = document.getElementById("activity-url-notebook");
    let loadFile = document.getElementById("notebook");
    let dropFile = $("#drop_zone");

    if (urlFile && urlFile.value && urlFile !== "") {
      file = urlFile.value;
      isUrl = true;
    }
    else {
      if (loadFile.files.length === 1) {
        file = loadFile.files[0];
        isUrl = false;
      } else if (dropFile.data("file")) {
        file = dropFile.data("file");
        isUrl = false;
      } else {
        displayNotification('#notif-div', "classroom.notif.addFile", "error");
        return false;
      }
    }

    if(isUrl && !isValidUrl(urlFile.value)) return false;

    let data = {
      type: isUrl ? "url" : "file",
      value: file
    }

    ClassroomSettings.message = data;

    const onNavigate = (event) => {
      $(urlFile).val("");
      $(loadFile).val("");
      dropFile.data("file", null);

    };
    // to clear form and event
    window.addEventListener("Navigate", onNavigate, {once: true});

    return true;
    //type = ClassroomSettings.player;
}

async function createCabriActivity(id, type, button) {
  $(button).attr('disabled', 'disabled'); // disable button
  ClassroomSettings.isNew = true;
  let cabriActivityType = type;
  if(type==='PLAYER') {
    cabriActivityType = ClassroomSettings.player;
    if (!extractCabriPlayerData(cabriActivityType, button))
      return;
  }

  if (id == null)
    $('#activity-lti-form-title').val('')

  if(cabriActivityType === 'STANDARD' || cabriActivityType === 'IMUSCICA'
    || cabriActivityType === 'EXPRESS' || cabriActivityType === 'GENIUS')
    createCabriLtiActivity(cabriActivityType, button);
  else if(cabriActivityType==='IFRAME' || cabriActivityType==='IFRAME-CABRI3D')
    createCabriIframeActivity(button);

}

async function createCabriLtiActivity(type, button) {
  const data = await Main.getClassroomManager().canAddActivity({type});
  if(!data.canAdd) {
    pseudoModal.openModal('add-activity-limitation');
    $(button).attr('disabled', null); // enable button
    return;
  }

  let baseToolUrl, deploymentId, disableIframe;
  let askForTitle = false;
  switch (type) {
    case "STANDARD":
      baseToolUrl = "https://lti1p3-player.cabricloud.com";
      //baseToolUrl = "https://d52b-82-216-88-13.eu.ngrok.io";
      deploymentId = 'opensteam-lms_cabri-player';
      break;
    case "IMUSCICA":
      baseToolUrl = "https://workbench-imuscica.cabricloud.com";
      deploymentId = 'opensteam-lms_imuscica';
      break;
    case "EXPRESS":
    case "GENIUS":
      baseToolUrl = "https://lti1p3.cabricloud.com";
      askForTitle = true;
      deploymentId= 'opensteam-lms_cabri-express';
      disableIframe = true;
      break;

  }

  $('#lti-loader-container').html(
    `
            <input id="activity-form-content-lti" type="text" hidden/>
            <form name="lti_teacher_login_form" action="${baseToolUrl}/login" method="post" target="lti_teacher_iframe">
              <input id="lti_teacher_iss" type="hidden" name="iss"/>
              <input id="lti_teacher_login_hint" type="hidden" name="login_hint"/>
              <input id="lti_teacher_client_id" type="hidden" name="client_id" value="${deploymentId}" />
              <input id="lti_teacher_target_link_uri" type="hidden" name="target_link_uri" value="${baseToolUrl}/deeplink" />
            </form>
            <div style="width: 100%; height: 100%;" class="lti-iframe-holder">
                <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" width="100%"  height="100%" allowfullscreen></iframe>
            </div>`
  );

  navigatePanel("classroom-dashboard-new-lti-activity-panel", 'dashboard-activities-teacher')

  if(askForTitle) {
    pseudoModal.openModal('add-lti-activity-name');
    // todo cabri must remove previous exit events listeners before setting a new one !
    pseudoModal.clickOnExit('add-lti-activity-name', ()=>{
      navigatePanel('classroom-dashboard-other-activity-type-panel', 'dashboard-activities-teacher');
    });
  } else {
    $('#activity-lti-form-title').val(ClassroomSettings.title);
  }
  ClassroomSettings.activityInWriting = true

  // Start LTI 1.3 tool launch
  const loginHint = ClassroomSettings.status === "edit" ? ClassroomSettings.loginHint : {
    userId: UserManager.getUser().id,
    isStudentLaunch: false,
    activityType: type
  };

  loginHint['deploymentId'] = deploymentId;

  // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
  $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
  $('#lti_teacher_iss').val(location.origin); // platform url
  if(disableIframe)
    $('#lti_teacher_iframe').css({'filter': 'blur(5px)', 'pointer-events': 'none'})

  document.forms["lti_teacher_login_form"].submit();
  $(button).attr('disabled', null); // enable button
}

async function createCabriIframeActivity(button) {
  /*if(ClassroomSettings.status !== 'edit') {
    const data = await Main.getClassroomManager().canAddActivity({type: 'other'});
    if(!data.canAdd) {
      pseudoModal.openModal('add-activity-limitation');
      $(button).attr('disabled', null); // enable button
      return;
    }
  }*/

  $(button).attr('disabled', 'disabled'); // enable button
  let activityURL;
  // If file is given then, upload it to Azure
  if(ClassroomSettings.message.type === 'file')
    try {
      // TODO In case of update, we must delete the previously stored file on Azure Storage
      const data = await Main.getClassroomManager().uploadActivityFile(ClassroomSettings.message.value)
      activityURL = data.url;
    } catch(e) {
      console.error('Error in : "ClassroomManager.uploadActivityFile()" => \n ', e);
      displayNotification('#notif-div', `classroom.notif.generalBackendError`, "error");
      $(button).attr('disabled', null);
      return;
    }

  else if(ClassroomSettings.message.type === 'url')
    activityURL = ClassroomSettings.message.value;

  if (ClassroomSettings.status !== 'edit')
    try {
      const activity = await Main.getClassroomManager().addActivity({
        'title': ClassroomSettings.title,
        'content': `${ClassroomSettings.playerURL}?clmc=${activityURL}`,
        "isFromClassroom": true,
        'type': 'IFRAME'
      })

      $('.new-activity-iframe').attr('disabled', false)

      if (activity.errors) {
        for (let error in activity.errors)
          displayNotification('#notif-div', `classroom.notif.${error}`, "error");
      }
      else {
        ClassroomSettings.activity = activity.id;
        displayNotification('#notif-div', "classroom.notif.activityCreated", "success", `'{"activityTitle": "${activity.title}"}'`);
        $('#activity-form-content-iframe').val("");
        navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity);
        addTeacherActivityInList(activity);
        teacherActivitiesDisplay();
        ClassroomSettings.activityInWriting = false;
      }
      $(button).attr('disabled', null); // enable button
      //ClassroomSettings.activityInUpload = false;

    } catch (e) {
      console.log('Error in : "ClassroomManager.addActivity()" => \n ', e);
      $(button).attr('disabled', null); // enable button
      //ClassroomSettings.activityInUpload = false;
    }

  else {
    try {
      const activity = await Main.getClassroomManager().editActivity({
        'id': ClassroomSettings.activity,
        'title': ClassroomSettings.title,
        'content': `${ClassroomSettings.playerURL}?clmc=${activityURL}`,
      });

      displayNotification('#notif-div', "classroom.notif.activityChanged", "success", `'{"activityTitle": "${activity.title}"}'`);
      $('#activity-form-content-iframe').val("");
      navigatePanel('classroom-dashboard-new-activity-panel2', 'dashboard-activities-teacher', ClassroomSettings.activity)
      $(button).attr('disabled', null); // enable button

      await Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager());
      teacherActivitiesDisplay()
      ClassroomSettings.activityInWriting = false

    } catch (e) {
      console.log('Error in : "ClassroomManager.addActivity()" => \n ', e);
      $(button).attr('disabled', null); // enable button
      //ClassroomSettings.activityInUpload = false;
    }
  }
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
  pseudoModal.openModal('activity-delete-confirm')
})

//activité modal-->modifier
function activityModify(id, type) {
    ClassroomSettings.activity = id
    $('#activity-form-title').val('')
    $('.wysibb-text-editor').html('')
    Main.getClassroomManager().getActivity(ClassroomSettings.activity).then(function (activity) {
        ClassroomSettings.status = 'edit';
        //let activityType = activity.type ? activity.type.toLowerCase() : activity.type;
        let activityType = activity.type;
        if(!activityType) {
          // Other Activity type
          $('#activity-form-title').val(activity.title)
          $('.wysibb-text-editor').html(activity.content)
          navigatePanel('classroom-dashboard-new-activity-panel', 'dashboard-activities-teacher')
        }
        else if (activityType === "EXPRESS" || activityType === "GENIUS") {
          // Cabri Activity
          $('#activity-lti-form-title').val(activity.title)
          navigatePanel('classroom-dashboard-new-lti-activity-panel', 'dashboard-activities-teacher')

          // update modal title
          $('#add-lti-activity-name .vitta-modal-header .vitta-modal-title').html();

          pseudoModal.openModal('add-lti-activity-name');
          // todo cabri must remove previous exit event listeners before setting a new one !
          pseudoModal.clickOnExit('add-lti-activity-name', ()=>{
            navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher');
          });


          let baseToolUrl, deploymentId;
          let isNeedTitle = false;
          switch (type) {
            case "STANDARD":
              deploymentId = 'opensteam-lms_cabri-player';
              return; // TODO: to do later
            case "IMUSCICA":
              baseToolUrl = "https://workbench-imuscica.cabricloud.com";
              deploymentId = 'opensteam-lms_imuscica';
              break;
            case "EXPRESS":
            case "GENIUS":
              baseToolUrl = "https://lti1p3.cabricloud.com";
              deploymentId = "opensteam-lms_cabri-express";
              isNeedTitle = true;
              break;
          }

          $('#lti-loader-container').html(
            `
            <input id="activity-form-content-lti" type="text" hidden/>
            <form name="lti_teacher_login_form" action="${baseToolUrl}/login" method="post" target="lti_teacher_iframe">
              <input id="lti_teacher_iss" type="hidden" name="iss"/>
              <input id="lti_teacher_login_hint" type="hidden" name="login_hint"/>
              <input id="lti_teacher_client_id" type="hidden" name="client_id" value="${deploymentId}" />
              <input id="lti_teacher_target_link_uri" type="hidden" name="target_link_uri" value="${baseToolUrl}/deeplink" />
            </form>
            <div style="width: 100%; height: 100%;" class="lti-iframe-holder">
                <iframe id="lti_teacher_iframe" src="about:blank" name="lti_teacher_iframe" title="Tool Content" width="100%"  height="100%" allowfullscreen></iframe>
            </div>`
          );

          // Start LTI 1.3 tool launch
          const loginHint = {
            userId: UserManager.getUser().id,
            isStudentLaunch: false,
            isUpdate: true,
            updateURL: activity.content,
            activityType: activity.type,
            deploymentId
          };

          // document.getElementsByName('lti_teacher_login_form')[0].style.display = 'none';
          $('#lti_teacher_login_hint').val(JSON.stringify(loginHint));
          $('#lti_teacher_iss').val(location.origin); // platform url

          document.forms["lti_teacher_login_form"].submit();
        }
        else {
            //createOtherActivity(activityType);
            if(activityType === 'STANDARD' || activityType === 'IMUSCICA' || activityType === 'IFRAME') {
              let notebookURL;
              $("#activity-form-title-others_player").val(activity.title);

              if(activityType === 'IFRAME') {
                const url = new URL(activity.content);
                const playerURL = url.origin + url.pathname;
                notebookURL = url.searchParams.get('clmc');

                $("#activity-url-player").val(playerURL);
                $("#activity-url-player-container").show();
              }
              else if(activityType === 'STANDARD' || activityType === 'IMUSCICA') {
                notebookURL = activity.content;
                $("#activity-url-player-container").hide();
                ClassroomSettings.loginHint = {
                  userId: UserManager.getUser().id,
                  isStudentLaunch: false,
                  isUpdate: true,
                  updateURL: activity.content,
                  activityType: activity.type
                };
              }

              ClassroomSettings.player = activityType;
              //$("#activity-notebook-update-message").show();
              $("#activity-url-notebook").val(notebookURL);
              $("#notebook").val("");
              $("#drop_zone").data("file", null);

              navigatePanel('classroom-dashboard-activity-player', 'dashboard-activities-teacher')
            }
            else if (activityType === 'IFRAME-PAGE' || activityType === 'IFRAME-VIDEO'){
              $("#activity-form-title-others_iframe").val(activity.title);
              $("#activity-form-content-iframe").val(activity.content);

              navigatePanel('classroom-dashboard-url-activity-panel', 'dashboard-activities-teacher')
            }
            /*
            if(activityType === "iframe") {
                $("#choose-iframe").click();
                $("#activity-form-content-iframe").val(activity.content);
            } else {

                $("#choose-player").click();
                // Start LTI 1.3 tool launch
                const loginHint = {
                    userId: UserManager.getUser().id,
                    isStudentLaunch: false,
                    isUpdate: true,
                    updateURL: activity.content,
                    activityType: activity.type
                };
                ClassroomSettings.loginHint = loginHint;
                $("#activity-url-notebook").val(activity.content);
            }

          $("#activity-form-title-others").val(activity.title);


          navigatePanel('classroom-dashboard-other-activity-type-panel', 'dashboard-activities-teacher')
          */
        }
    })
}

//création activité vers attribution
function attributeActivity(id, ref = null) {
    ClassroomSettings.activity = id
    ClassroomSettings.ref = ref
    document.getElementsByClassName('student-number')[0].textContent = '0';
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

            /** @ToBeDeleted last check Novembre 2021 */
            /* if (ClassroomSettings.ref != null) {
                Main.getClassroomManager().undoAttributeActivity(ClassroomSettings.ref)
            } */

            // get the checkbox value then set it by default for the next time
            retroAttribution = $('#retro-attribution').prop('checked')
            $('#retro-attribution').prop('checked',false)

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

// Etape finale de création d'une activité type iframe (video ou page-web)
$('.new-activity-iframe').click(function () {
    $(this).attr('disabled', 'disabled');

    const title = $('#activity-form-title-others_iframe').val();
    if (title.length < 1) {
      displayNotification('#notif-div', "classroom.notif.activityTitleMissing", "error");
      $(this).attr('disabled', false);
      return;
    }
    ClassroomSettings.title = title;

    let url = $('#activity-form-content-iframe').val();
    if (!isValidUrl(url)) {
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
            'type': ClassroomSettings.iframeActivityType
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


//création/modification de l'activité de type LTI
$('.new-activity-panel-lti').click(function () {
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
