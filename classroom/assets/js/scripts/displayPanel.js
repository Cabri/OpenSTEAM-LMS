function DisplayPanel() {}

DisplayPanel.prototype.classroom_dashboard_classes_panel_teacher = function () {
    classroomsDisplay();
}

DisplayPanel.prototype.classroom_dashboard_new_activity_panel2 = function (id) {
    $('#new-activity-panel3').attr("onclick", "attributeActivity(" + id + ")")
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_teacher = function () {
    $('#user-name-teacher').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
    Main.getClassroomManager().getTeacherActivity().then(function (data) {
        $('.owned-activities').html(data.ownedActivities)

    })
    getIntelFromClasses()
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_groupadmin = function () {
    $('#user-name-groupadmin').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
}

DisplayPanel.prototype.classroom_dashboard_profil_panel_manager = function () {
    $('#user-name-manager').html(UserManager.getUser().firstname + " " + UserManager.getUser().surname)
}

DisplayPanel.prototype.classroom_dashboard_profil_panel = function () {
    $('#user-name').html(UserManager.getUser().pseudo)
    Main.getClassroomManager().getStudentActivity().then(function (data) {
        $('.todo-activities').html(data.todoActivities)
        $('.todo-courses').html(data.todoCourses)
        $('.done-activities').html(data.doneActivities)
        $('.done-courses').html(data.doneCourses)
    })
}
DisplayPanel.prototype.classroom_dashboard_ide_panel = function (option) {
    if (option == "python" || option == "microbit" || option == "arduino" || option == "esp32" || option == "quickpi") {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/' + option + '/?console=bottom&use=classroom&embed=1&action=new"></iframe>')
    } else if (option == "texas-instruments") {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/microbit/?toolbox=texas-instruments&console=bottom&use=classroom&embed=1&action=new"></iframe>');
    } else {
        $('#classroom-dashboard-ide-panel').html('<iframe width="100%" style="height:85vh;" frameborder="0" allowfullscreen="" style="border:1px #d6d6d6 solid;" src="' + URLServer + '/' + $_GET('interface') + '/?link=' + option + '&embed=1"></iframe>')
    }


    // Hiding the share option in the interface saving process
    function hideShareOptionArea(iframe) {
        let shareOptAreaElt = iframe.contentWindow.document.getElementById('check_box_div');
        let shareOptDescElt = iframe.contentWindow.document.getElementById('check_box_hint');
        if (shareOptAreaElt){
            shareOptAreaElt.style.position = 'absolute';
            shareOptAreaElt.style.top = '-9999px';
            shareOptAreaElt.style.left = '-9999px';
            shareOptDescElt.style.position = 'absolute';
            shareOptDescElt.style.top = '-9999px';
            shareOptDescElt.style.left = '-9999px';
        } else {
            setTimeout(() => {hideShareOptionArea(iframe)}, 400);
        }
    }

    document.querySelector('iframe').addEventListener('load', (e) => {
        let iframe = e.target;
        hideShareOptionArea(iframe);
    });
}

DisplayPanel.prototype.classroom_dashboard_activities_panel = function () {
    $('#header-table-bilan').html('<th style="max-width:200px" data-i18="classroom.navbar.activities"></th>');
    $('#body-table-bilan').html('<td style="max-width:200px">');
    $('table').localize();
    $('#new-activities').html('');
    $('#saved-activities').html('');
    $('#current-activities').html('');
    $('#done-activities-list').html('');
    // Refresh the activities
    Main.getClassroomManager().getStudentActivities(Main.getClassroomManager())
    .then(() => {
        studentActivitiesDisplay();
    });


}
DisplayPanel.prototype.classroom_dashboard_activities_panel_library_teacher = function () {
    if (!$("#resource-center-classroom").length) {
        $('#classroom-dashboard-activities-panel-library-teacher').html('<iframe id="resource-center-classroom" src="/learn/?use=classroom" frameborder="0" style="height:80vh;width:80vw"></iframe>')
    }
}

DisplayPanel.prototype.classroom_dashboard_help_panel = function () {
    if (!Main.getClassroomManager()._myTeachers) {
        Main.getClassroomManager().getTeachers(Main.getClassroomManager()).then(function () {
            teachersList()
        })
    } else {
        teachersList()
    }

    let html = ''
    let index = [3, 2, 4, 4, 3, 2]
    for (let i = 1; i <= index.length; i++) {
        html += "<h4 data-i18n='[html]faqStudentNeutral." + i + ".section_title'></h4>";
        for (let j = 1; j < index[i - 1]; j++) {
            html += `<div class="kit-faq-box">
            <div class="faq-box-header" style="transform: rotate(0deg); transform-origin: 50% 50% 0px;">
                <div class="faq-box-dropdown">
                    <span class="fa fa-chevron-right" style="line-height:40px; font-size:16px;"></span>
                </div>
                <p style="font-size:16px; margin:0; padding:0;">
                    <b data-i18n='[html]faqStudentNeutral.` + i + `.question_list.` + j + `.title'></b>
                </p>
            </div>
            <div class="faq-box-content">
            <p data-i18n='[html]faqStudentNeutral.` + i + `.question_list.` + j + `.answer'></p>
            </div>
        </div>`

        }
    }
    $('#student-faq-container').html(html)
    $("#student-faq-container").localize();

    var headers = document.getElementsByClassName("faq-box-header");
    $(headers).rotate({
        bind: {
            click: function () {
                var drop = $(this).find(".faq-box-dropdown");
                var content = $(this).parent().find(".faq-box-content");
                if (drop.hasClass("dropped")) {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 0
                    });
                    content.fadeOut("slow", function () {
                        drop.removeClass("dropped");
                    });
                } else {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 90
                    });
                    content.fadeIn("slow", function () {
                        drop.addClass("dropped");
                    });
                }
            }
        }
    });
}

DisplayPanel.prototype.classroom_dashboard_help_panel_teacher = function () {
    let html = '';
    let index = [7, 12, 5, 3, 3, 3]; // number of questions+1 per category in faq

    // capitalize demoStudent name
    let capitalizedDemoStudentName = `${demoStudentName.charAt(0).toUpperCase()}${demoStudentName.slice(1)}`;

    for (let i = 1; i <= index.length; i++) {
        html += "<h4 data-i18n='[html]faqTeacherNeutral." + i + ".section_title'></h4>";
        for (let j = 1; j < index[i - 1]; j++) {
            html += `<div class="kit-faq-box">
            <div class="faq-box-header" style="transform: rotate(0deg); transform-origin: 50% 50% 0px;">
                <div class="faq-box-dropdown">
                    <span class="fa fa-chevron-right" style="line-height:40px; font-size:16px;"></span>
                </div>
                <p style="font-size:16px; margin:0; padding:0;">
                    <b data-i18n='[html]faqTeacherNeutral.` + i + `.question_list.` + j + `.title'></b>
                </p>
            </div>
            <div class="faq-box-content">
            <p data-i18n='[html]faqTeacherNeutral.` + i + `.question_list.` + j + `.answer' data-i18n-options={"demoStudent":"${capitalizedDemoStudentName}"}></p>
            </div>
        </div>`;
        }
    }
    $('#teacher-faq-container').html(html);
    $("#teacher-faq-container").localize();

    var headers = document.getElementsByClassName("faq-box-header");
    $(headers).rotate({
        bind: {
            click: function () {
                var drop = $(this).find(".faq-box-dropdown");
                var content = $(this).parent().find(".faq-box-content");
                if (drop.hasClass("dropped")) {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 0
                    });
                    content.fadeOut("slow", function () {
                        drop.removeClass("dropped");
                    });
                } else {
                    drop.rotate({
                        angle: drop.getRotateAngle(),
                        animateTo: 90
                    });
                    content.fadeIn("slow", function () {
                        drop.addClass("dropped");
                    });
                }
            }
        }
    });
}

DisplayPanel.prototype.classroom_dashboard_sandbox_panel = function () {
    ClassroomSettings.activity = false
    if (!Main.getClassroomManager()._myProjects) {
        Main.getClassroomManager().getSandboxProject(Main.getClassroomManager()).then(function () {
            sandboxDisplay()
        })
    } else {
        sandboxDisplay()
    }
}

DisplayPanel.prototype.classroom_dashboard_form_classe_panel = function () {
    if (ClassroomSettings.classroom != null) {
        let classroom = getClassroomInListByLink(ClassroomSettings.classroom)[0]
        $('#classroom-form-name').val(classroom.classroom.name),
            $('#classroom-form-school').val(classroom.classroom.school)
        $('#add-student-div').html(BASE_STUDENT_FORM)
        if (classroom.classroom.isBlocked) {
            document.querySelector('#classroom-form-is-blocked').checked = true;
        } else {
            document.querySelector('#classroom-form-is-blocked').checked = false;
        }
        classroom.students.forEach(function (student) {
            let html = `<div class="c-primary-form row col-12">
            <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
            <input class="col-5 student-form-name" type="text" value="` + student.user.pseudo + `" data-id="` + student.user.id + `">
        </div>`
            $('#add-student-div').append(html)
        })
    } else {
        document.querySelector('#classroom-form-is-blocked').checked = false;
        $('#classroom-form-name').val(''),
            $('#classroom-form-school').val('')
        $('#add-student-div').html(BASE_STUDENT_FORM)
    }
}

DisplayPanel.prototype.classroom_dashboard_activities_panel_teacher = function () {
    ClassroomSettings.activity = false;
    // Refresh the activities
    Main.getClassroomManager().getTeacherActivities(Main.getClassroomManager())
    .then(() => {
        teacherActivitiesDisplay();
    });
}

DisplayPanel.prototype.classroom_table_panel_teacher = function (link) {
    if (link != 'null') {
        // hide the non relevant elements in gar context
        if (UserManager.getUser().isFromGar) {
            document.getElementById('add-student-container').style.display = 'none';
            document.getElementById('classroom-info').style.display = 'none';
        }

        // restore the add student div to its default content to remove potential changes from the update classroom modal
        $('#classroom-form-name').val(''),
            $('#classroom-form-school').val('')
        $('#add-student-div').html(BASE_STUDENT_FORM);
        if (!Main.getClassroomManager()._myClasses) {
            Main.getClassroomManager().getClasses().then(function () {
                let students = getClassroomInListByLink(link)[0].students
                displayStudentsInClassroom(students)
                $('.classroom-link').html(ClassroomSettings.classroom)
            })

        } else {
            if (link == null || link == '') {
                if (ClassroomSettings.classroom != null) {
                    link = ClassroomSettings.classroom;
                } else {
                    navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher', '', '');
                    return;
                }
            }
            // Load the classroom with the current cache data
            let students = getClassroomInListByLink(link)[0].students
            displayStudentsInClassroom(students)
            $('.classroom-link').html(ClassroomSettings.classroom)
            // Block classroom feature
            if (getClassroomInListByLink(link)[0].classroom.isBlocked == false) {
                $('#classroom-info').removeClass('greyscale')
                $('#classroom-info > *:not(:first-child)').css('display','unset');
                $('#classroom-info > button:first-child > i.fa').removeClass('fa-lock').addClass('fa-lock-open');

            } else {
                $('#classroom-info').addClass('greyscale')
                $('#classroom-info > *:not(:first-child)').css('display','none');
                $('#classroom-info > button:first-child > i.fa').removeClass('fa-lock-open').addClass('fa-lock');


            }
            // Get the classes from database and refresh the dashboard
            Main.getClassroomManager().getClasses(Main.getClassroomManager()).then(() => {
                let students = getClassroomInListByLink(link)[0].students
                displayStudentsInClassroom(students)
            });
        }

        setTimeout(dashboardAutoRefresh, 15000);
    } else {
        navigatePanel('classroom-dashboard-classes-panel-teacher', 'dashboard-classes-teacher', 'WK' + id, '')
        displayNotification('#notif-div', "classroom.login.noClass", "warning")
    }
}
DisplayPanel.prototype.classroom_dashboard_new_activity_panel3 = function (ref) {
    if (ref != null && ref != 'null') {
        let attribution = getAttributionByRef(ref)
        $('#introduction-activity-form').val(attribution.introduction)
        $('#date-begin-activity-form').val(formatDateInput(new Date(attribution.dateBegin.date)))
        $('#date-end-activity-form').val(formatDateInput(new Date(attribution.dateEnd.date)))
        if (attribution.evaluation == false) {
            $('#isEval-activity-form').attr('checked', 'checked')
        } else {
            $('#isExo-activity-form').attr('checked', 'checked')
        }
        if (attribution.autocorrection == true) {
            ClassroomSettings.willAutocorrect = true;
        }
    } else {
        let now = new Date()
        let future = new Date()
        future.setDate(future.getDate() + 7);
        $('#date-begin-activity-form').val(formatDateInput(now))
        $('#date-end-activity-form').val(formatDateInput(future))
        $('#introduction-activity-form').val('')
    }
}
DisplayPanel.prototype.classroom_dashboard_activity_panel = function (id) {
    if (id != 'null') {
        if (UserManager.getUser().isRegular) {
            if (id.slice(0, 2) == "WK") {
                ClassroomSettings.activity = id = Number(id.slice(2))
                Activity = getActivity(id)
                getTeacherActivity()

            } else {
                ClassroomSettings.activity = id = Number(id.slice(2))
                Main.getClassroomManager().getOneUserLinkActivity(id).then(function (result) {
                    Activity = result
                    loadActivity(false)
                })
            }
        } else {
           if ($_GET('interface') == 'newActivities' || $_GET('interface') == 'savedActivities') {
                var isDoable = true
            } else {
                var isDoable = false
            }
            ClassroomSettings.activity = id = Number(id.slice(2))
            Activity = getActivity(id, $_GET('interface'))
            loadActivity(isDoable)

        }
    }
}

function addZero(number, lenght) {
    number = String(number)

    while (number.length < lenght) {
        number = "0" + number
    }
    return number
}

function formatDateInput(date) {

    return date.getFullYear() + "-" + addZero((Number(date.getMonth()) + 1), 2) + "-" + addZero(date.getDate(), 2)
}

function getTeacherActivity() {
    $('#activity-title').html(Activity.title + `<button class="btn btn-link" onclick="attributeActivity(` + Activity.id + `)">
    <i class="fas fa-arrow-down"></i> ` + capitalizeFirstLetter(i18next.t('words.attribute')) + `
</button>`)

    let activityContent = $('#activity-content');
    let activityContentLti = $('#activity-content-lti');

   // TODO cabri replace with IF LTI
    if(Activity.content.startsWith('http')) {
      activityContentLti.html('<iframe style="width: 100%; height: 100%;" allowfullscreen="true" frameborder="0" src="https://cabricloud.com/ed/opensteam/express?isMobile&calculator=false&clmc=' + Activity.content + '" allowfullscreen></iframe>');
    }
    else
      activityContent.html(bbcodeToHtml(Activity.content))

    activityContent.css('display', 'block');
    activityContentLti.css('display', 'block');
    $('#activity-introduction').hide()
    $('#activity-validate').hide()
    $('#lti-review-submission').hide()
    $('#activity-correction').hide();
}

function getIntelFromClasses() {
    $('#list-classes').html('')
    let classes = Main.getClassroomManager()._myClasses
    if (classes.length == 0) {
        $('.tocorrect-activities').html('0')
        $('#mode-student-check').after(NO_CLASS)
        $('#mode-student-check').hide()

    } else {
        let correctionCount = 0
        classes.forEach(element => {
            element.students.forEach(e => {
                e.activities.forEach(a => {
                    if (a.correction == 1) {
                        correctionCount++
                    }
                })
            })
            $('#list-classes').append('<div><input class="mx-5" type="radio" name="classroom" id="' + element.classroom.link + '" value="' + element.classroom.link + '"><label for="' + element.classroom.link + '">' + element.classroom.name + '</label></div>')
        });
        $('.no-classes').remove()
        $('#mode-student-check').show()
        $('.tocorrect-activities').html(correctionCount)
    }
}
