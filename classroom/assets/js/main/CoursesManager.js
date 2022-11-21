class CoursesManager {
    /**
     * Creates an instance of Courses.
     * @public
     */
    constructor() {
        this.myCourses = [];
        this.actualCourse = {
            id: null,
            state: null,
            link: null,
            activity: null
        };
        this.courseId = null;
        this.isUpdate = false;
        this.lastestCourse = null;
        this.coursesAsStudent = [];
        this.courseData = {
            courses: [],
            title: null,
            description: null,
            image: null,
            parameters: {
                duration: null,
                difficulty: null,
                language: null,
                license: null,
            }
        };
        this.dragula = null;
        this.resetCourseData = null;
        this.attributeData = {
            students: [],
            classrooms: [],
            courseId: null,
        };
    }

    init() {
        this.dragula = dragula();
        this.resetCourseData = () => {
            this.isUpdate = false;
            this.courseId = null;
            this.actualCourse = {
                id: null,
                state: null,
                link: null,
                activity: null
            };
            this.courseData = {
                courses: [],
                title: null,
                description: null,
                image: null,
                parameters: {
                    duration: null,
                    difficulty: null,
                    language: null,
                    license: null,
                }
            }
            this.refreshCourses();
        };

        if (UserManager.getUser()) {
            if (UserManager.getUser().isRegular) {
                this.actualizeCourse();
            }
        }

        $('#new-course-attribute').click(function () {
            pseudoModal.openModal('attribute-activity-modal');
            $("#attribute-activity-modal").localize();
        })
    }

    goToCreate(fresh = false) {
        if (fresh) {
            this.courseData.courses = [];
        }
        this.refreshCourses();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    goToTitle() {
        if (this.courseData.title != null && this.courseData.description != null) {
            document.getElementById('course-title').value = this.courseData.title;
            document.getElementById('course-description').value = this.courseData.description;
        } else {
            document.getElementById('course-title').value = '';
            document.getElementById('course-description').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-title', 'dashboard-activities-teacher');
    }

    goToParameters() {
        if (this.courseData.parameters.duration != null) {
            document.getElementById('course-duration').value = this.courseData.parameters.duration;
        } else {
            document.getElementById('course-duration').value = 1;
        }
        if (this.courseData.parameters.difficulty != null) {
            document.getElementById('course-difficulty').value = this.courseData.parameters.difficulty;
        } else {
            document.getElementById('course-difficulty').value = '';
        }
        if (this.courseData.parameters.license != null) {
            document.getElementById('course-license').value = this.courseData.parameters.license;
        } else {
            document.getElementById('course-license').value = '';
        }
        navigatePanel('classroom-dashboard-classes-new-course-parameters', 'dashboard-activities-teacher');
    }

    goToAttribution(fromParameters = false) {
        if (fromParameters) {

            if (!this.isUpdate) {
                this._requestAddCourse().then((res) => {
                    if (res.hasOwnProperty('success')) {
                        this.lastestCourse = res.course.id;
                        navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
                        this.resetCourseData();
                        this.actualizeCourse();
                    } else {
                        displayNotification('error', res.message);
                    }
                })
            } else {
                this._requestUpdateCourse().then((res) => {
                    if (res.hasOwnProperty('success')) {
                        this.lastestCourse = res.course.id;
                        navigatePanel('classroom-dashboard-classes-new-course-attribution', 'dashboard-activities-teacher');
                        this.resetCourseData();
                        this.actualizeCourse();
                    } else {
                        displayNotification('error', res.message);
                    }
                });
            }

        }
    }

    facultativeOptions() {
        $('#course-options').toggle()
        $('#i-course-options').toggleClass('fa-chevron-down')
        $('#i-course-options').toggleClass('fa-chevron-up')
    }

    refreshCourses() {
        const coursesDiv = document.getElementById('course-activities-content');
        coursesDiv.innerHTML = '';
        this.courseData.courses.forEach(course => {
            let activityImg = foldersManager.icons.hasOwnProperty(course.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[course.type]}" alt="${course.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course-item-draggable');
            courseDiv.setAttribute('data-course-id', course.id);
            courseDiv.innerHTML = `
                <div class="preview-activity-in-courses">
                    ${activityImg}    
                    ${course.title}
                    <button class="btn btn-warning btn-sm btn-delete-course" onclick="coursesManager.deleteActivityFromCourse(${course.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            coursesDiv.appendChild(courseDiv);
        });
        this.dragulaInit();
    }

    // Wip
    dragulaInit() {
        let activityFromCourses = document.getElementById('course-activities-content');
        if (this.dragula.containers.length > 0) {
            this.dragula.containers = [];
        }
        this.dragula = dragula([activityFromCourses]).on('drop', () => {
            setTimeout(() => {
                this.sortActualCourseArrayFromDiv();
            }, 150);
        });
    }


    showCoursePanel() {
        this.resetCourseData();
        navigatePanel('classroom-dashboard-classes-new-course', 'dashboard-activities-teacher');
    }

    sortActualCourseArrayFromDiv() {
        const courseItems = document.querySelectorAll('div[class^=course-item-draggable]');
        this.courseData.courses = [];
        courseItems.forEach(item => {
            const courseId = parseInt(item.getAttribute('data-course-id'));
            this.courseData.courses.push(Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === courseId));
        });
    }

    addActivityToCourse() {
        // get all the activities
        const activitiesDiv = document.getElementById('add-activity-content'),
            activities = Main.getClassroomManager()._myTeacherActivities;

        // filter with the ones that are not in the course
        let activitiesToAdd = activities.filter(activity => {
            return !this.courseData.courses.some(course => {
                return course.id === activity.id;
            });
        });

        activitiesDiv.innerHTML = '';
        // create the list of activities
        activitiesToAdd.forEach(activity => {
            const activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>",
                activityDiv = document.createElement('div');
            activityDiv.classList.add('activity-item-courses');
            activityDiv.classList.add('mt-3');
            activityDiv.setAttribute('data-activity-id', activity.id);
            // add checkbox 
            activityDiv.innerHTML = `
                    <div class="form-check">
                        <input class="activity-item-checkbox-input" type="checkbox" value="${activity.id}" id="courses-activity-${activity.id}">
                        <label class="form-check-label" for="courses-activity-${activity.id}">
                            ${activityImg}    
                            ${activity.title}
                        </label>
                    </div>
            `;
            activitiesDiv.appendChild(activityDiv);
        });

        this.bindEventsToSearch();
        pseudoModal.openModal('add-activity-to-course');
    }

    bindEventsToSearch() {
        document.getElementById('course-activity-search').addEventListener('input', () => {
            const search = document.getElementById('course-activity-search').value,
                activities = Main.getClassroomManager()._myTeacherActivities,
                activitiesDiv = document.getElementById('add-activity-content');

            let activitiesToAdd = activities.filter(activity => {
                return !this.courseData.courses.some(course => {
                    return course.id === activity.id;
                });
            });

            activitiesDiv.innerHTML = '';
            activitiesToAdd.forEach(activity => {
                if (activity.title.toLowerCase().includes(search.toLowerCase())) {
                    let activityImg = foldersManager.icons.hasOwnProperty(activity.type) ? `<img class="list-item-img d-inline" src="${foldersManager.icons[activity.type]}" alt="${activity.type}" class="folder-icons">` : "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
                    const activityDiv = document.createElement('div');
                    activityDiv.classList.add('activity-item-courses');
                    activityDiv.setAttribute('data-activity-id', activity.id);
                    // add checkbox 
                    activityDiv.innerHTML = `
                            <div class="form-check">
                                <input class="activity-item-checkbox-input" type="checkbox" value="${activity.id}" id="courses-activity-${activity.id}">
                                <label class="form-check-label" for="courses-activity-${activity.id}">
                                    ${activityImg}    
                                    ${activity.title}
                                </label>
                            </div>
                    `;
                    activitiesDiv.appendChild(activityDiv);
                }
            });
        });
    }

    persistActivityToCourse() {
        const activities = Main.getClassroomManager()._myTeacherActivities;
        const activitiesChecked = document.getElementsByClassName('activity-item-checkbox-input');

        for (let i = 0; i < activitiesChecked.length; i++) {
            let id = parseInt(activitiesChecked[i].value);
            if (activitiesChecked[i].checked && id) {
                this.courseData.courses.push(activities.find(activity => {
                    return activity.id === id;
                }));
            }
        }

        this.refreshCourses();
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    deleteActivityFromCourse(activityId) {
        this.courseData.courses = this.courseData.courses.filter(course => {
            return course.id !== activityId;
        });
        this.refreshCourses();
    }

    cancelActivityToCourse() {
        this.emptyDivFromActivityToCourse();
        pseudoModal.closeModal('add-activity-to-course');
    }

    emptyDivFromActivityToCourse() {
        document.getElementById('add-activity-content').innerHTML = '';
    }

    persistTitlePage() {
        const title = document.getElementById('course-title').value,
            description = document.getElementById('course-description').value,
            image = null;
            //image = document.getElementById('course-image').files[0];

        if (title && description) {
            this.courseData.title = title;
            this.courseData.description = description;
            this.courseData.image = image;
            this.goToParameters(true);
        } else {
            displayNotification('#notif-div', "classroom.notif.courseMissingData", "error");
        }
    }

    persistParameters() {
        const duration = document.getElementById('course-duration').value,
            difficulty = document.getElementById('course-difficulty').value,
            language = getCookie("lng") != "" ? getCookie("lng") : "fr",
            license = document.getElementById('course-license').value;

        if (duration && difficulty && language && license) {
            this.courseData.parameters.duration = duration;
            this.courseData.parameters.difficulty = difficulty;
            this.courseData.parameters.language = language;
            this.courseData.parameters.license = license;
            this.goToAttribution(true);
        } else {
            displayNotification('#notif-div', "classroom.notif.courseMissingParameters", "error");
        }
    }

    restoreParametersForUpdate(course) {
        this.isUpdate = true;
        this.courseId = course.id;
        this.courseData.title = course.title;
        this.courseData.description = course.description;
        this.courseData.image = course.image;
        this.courseData.parameters.duration = course.duration;
        this.courseData.parameters.difficulty = course.difficulty;
        this.courseData.parameters.language = course.lang;
        this.courseData.parameters.license = course.rights;

        this.courseData.courses = [];
        course.activities.forEach(item => {
            this.courseData.courses.push(Main.getClassroomManager()._myTeacherActivities.find(activity => activity.id === item.id));
        });
        this.goToCreate(false);
    }


    attributeCourse(id = null) {
        $("#assign-total-student-number-course").text(0);

        if (id) {
            this.courseId = id;
        } else {
            this.courseId = this.lastestCourse;
        }

        if (this.courseId < 1) {
            return displayNotification('#notif-div', "Id de parcours manquant", "error");
        }

        document.getElementsByClassName('student-number')[0].textContent = '0';

        $('#list-student-attribute-modal').html('');
        this.listStudentsToAttributeForCouse();

        navigatePanel('classroom-dashboard-classes-new-course-attribution-select', 'dashboard-activities-teacher');
    }

    persistAttribution() {
        let students = [],
            classrooms = [],
            studentId = $('#attribute-activity-modal .student-attribute-form-row');

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
            $('#attribute-course-to-students').attr('disabled', false)
            displayNotification('#notif-div', "classroom.notif.mustAttributeToStudent", "error")
        }

        this._requestUsersLinkCourse(this.courseId, students, classrooms).then((res) => {
            if (res == true) {
                displayNotification('#notif-div', "classroom.notif.courseAttributed", "success")
                $('#attribute-course-to-students').attr('disabled', false)
                navigatePanel('classroom-dashboard-activities-panel-teacher', 'dashboard-activities-teacher')
            } else {
                displayNotification('#notif-div', "classroom.notif.courseNotAttributed", "error")
            }
        });
    }

    listStudentsToAttributeForCouse() {
        let classes = Main.getClassroomManager()._myClasses;
        if (classes.length == 0) {
            $('#attribute-activity-to-students-close').after(NO_CLASS);
            $('#attribute-activity-to-students-close').hide();

        } else {
            classes.forEach(element => {
                $('#list-student-attribute-modal').append(classeList(element));
            });
            $('.no-classes').remove();
            $('#attribute-activity-to-students-close').show();
        }
    }


    deleteCourse(id) {
        this.resetInputs();
        this.courseId = id;
        pseudoModal.openModal("course-manager-modal");
    }

    resetInputs() {
        pseudoModal.closeModal("course-manager-modal");
        document.getElementById('validation-delete-course').value = '';
    }

    updateCourse(id = null) {
        if (id == null) {
            id = this.lastestCourse;
        }
        this._requestGetOneCourseById(id).then((res) => {
            if (res.hasOwnProperty('success')) {
                if (res.success) {
                    this.restoreParametersForUpdate(res.course);
                } else {
                    displayNotification('#notif-div', "classroom.notif.errorCourse", "error")
                }
            } else {
                displayNotification('#notif-div', "classroom.notif.undefinedCourse", "error")
            }
        });
    }

    actualizeCourse(fromDeletion = false) {
        this._requestGetMyCourseTeacher().then((res) => {
            this.myCourses = res;
            if (fromDeletion) {
                teacherActivitiesDisplay();
            }
        });
    }

    moveCourseToFolder(id) {
        foldersManager.moveToFolderModal(id, 'course');
    }

    persistDeleteCourse() {
        let id = this.courseId;
        if ($("#validation-delete-course").val() == $("#validation-delete-course").attr("placeholder")) {
            this._requestDeleteCourse(id).then((res) => {
                if (res.hasOwnProperty("success")) {
                    if (res.success) {
                        this.actualizeCourse(true);
                        displayNotification('#notif-div', "classroom.notif.courseDeleted", "success");
                        pseudoModal.closeModal("course-manager-modal");
                    } else {
                        displayNotification('#notif-div', "classroom.notif.courseNotDeleted", "error");
                    }
                } else {
                    displayNotification('#notif-div', "manager.input.writeDelete", "error");
                }
            });
        }
    }

    duplicateCourse(id) {
        this._requestDuplicateCourse(id).then((res) => {
            if (res.hasOwnProperty("success")) {
                if (res.success) {
                    this.actualizeCourse(true);
                    displayNotification('#notif-div', "classroom.notif.courseDuplicated", "success");
                    pseudoModal.closeModal("course-manager-modal");
                } else {
                    displayNotification('#notif-div', "classroom.notif.courseNotDuplicated", "error");
                }
            } else {
                displayNotification('#notif-div', "manager.input.writeDuplicate", "error");
            }
        });
    }


    teacherCourseItem(course, displayStyle) {
        let content = "";
        if (displayStyle == "card") {
            content = `<div class="course-item course-teacher" data-id="${course.id}">
                            <div>
                                <div class="course-card">
                                <img src="./assets/media/cards/card-course.png" class="course-card-img">
                                <div class="course-card-info">
                                    <div class="course-card-top">
                                        <div class="dropdown">
                                            <i class="fas fa-cog fa-2x" type="button" id="dropdown-courseItem-${course.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            </i>
                                            <div class="dropdown-menu" aria-labelledby="dropdown-courseItem-${course.id}" data-id="${course.id}">
                                                <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.attributeCourse(${course.id})" style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</li>
                                                <li class="dropdown-item classroom-clickable col-12" href="#" onclick="coursesManager.duplicateCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                                <li class=" classroom-clickable col-12 dropdown-item" onclick="coursesManager.updateCourse(${course.id})" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                                <li class="dropdown-item modal-course-delete classroom-clickable col-12" href="#" onclick="coursesManager.deleteCourse(${course.id})">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                                <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.moveCourseToFolder(${course.id})">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
                                            </div>
                                        </div> 
                                    </div>
                                    <div class="course-card-mid">
                                        <span class="course-card-activities-count">${course.activities ? course.activities.length : 0}<span>
                                    </div>
                                    <div class="course-card-bot">
                                        <div class="info-tutorials" data-id="${course.id}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 data-toggle="tooltip" title="${course.title}" class="course-item-title">${course.title}</h3>
                            </div>
                        </div>`
        } else if (displayStyle == "list") {

            let activityImg = "<span class='list-item-img'> <div class='list-item-no-icon'><i class='fas fa-laptop'></i></div></span>";
            /* let activityTypeImg = activity.type != null && "" ?  */
            content = `<div class="row course-item-list" data-id="${course.id}">
                <div class="container-draggable">
                    <div class="course-list">
                        <div class="course-list-icon">
                            ${activityImg}
                        </div>
        
                        <div class="course-list-center">
                            <div class="course-list-title">
                                ${course.title}
                            </div>
                        </div>
        
                        <div class="course-list-options">
                            <div class="course-list-options dropdown">
                                <i class="fas fa-cog fa-2x" type="button" id="dropdown-list-courseItem-${course.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                </i>
                                <div class="dropdown-menu" aria-labelledby="dropdown-list-courseItem-${course.id}" data-id="${course.id}">
                                    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="coursesManager.attributeCourse(${course.id})" style="border-bottom:2px solid rgba(0,0,0,.15">${capitalizeFirstLetter(i18next.t('words.attribute'))}</li>
                                    <li class="dropdown-item classroom-clickable col-12" href="#" onclick="">${capitalizeFirstLetter(i18next.t('words.duplicate'))}</li>
                                    <li class=" classroom-clickable col-12 dropdown-item" onclick="" href="#">${capitalizeFirstLetter(i18next.t('words.modify'))}</li>
                                    <li class="dropdown-item modal-course-delete classroom-clickable col-12" href="#">${capitalizeFirstLetter(i18next.t('words.delete'))}</li>
                                    <li class="classroom-clickable col-12 dropdown-item" href="#" onclick="">${capitalizeFirstLetter(i18next.t('classroom.activities.moveToFolder'))}</li>
                                </div>
                            </div>
                        </div>
                        <div class="info-tutorials d-none" data-id="${course.id}"></div>
                        
                    </div>
                </div>
            </div>`
        }
        return content;
    }

    resetInputsForCourse() {
        // Autocorrect note disclaimer
        $("#activity-auto-corrected-disclaimer-course").hide();
        $("#activity-auto-disclaimer-course").hide();
        $("#activity-content-container-course").hide();

        // Hide all the divs
        $('#activity-introduction-course').hide();
        $('#activity-correction-container-course').hide();
        $("#activity-states-container-course").hide();

        // Field for free activity
        $('#activity-input-container-course').hide();
        $('#activity-student-response-course').hide();
        $('#activity-student-response-content-course').text('');

        // Fields
        $('#activity-states-course').html("");
        $('#activity-title-course').html("");
        $('#activity-details-course').html('');
        $('#activity-content-course').html("");
        $('#activity-correction-course').html("");

        // Hint
        $("#activity-hint-course").text('');
        $("#activity-hint-container-course").hide();

        // Drag and drop
        $('#activity-drag-and-drop-container-course').hide();
        $('#drag-and-drop-fields-course').html('');
        $('#drag-and-drop-text-course').html('');

        // Warning message for
        $('#warning-icon-container-course').hide();
        $('#warning-text-evaluation-course').hide();
        $("#warning-text-no-evaluation-course").hide();

        // Quiz reset input
        deleteQcmFields();
    }


    loadCourseForStudents(isDoable, currentCourse, progressBar = true) {
        // Reset the inputs
        this.resetInputsForCourse();
    
        // Check if the activity has an introduction
        if (Activity.introduction != null && Activity.introduction != "") {
            $('#text-introduction-course').html(bbcodeToHtml(Activity.introduction))
            $('#activity-introduction-course').show()
        }

        let activityType = [
            "reading",
            "dragAndDrop",
            "fillIn",
            "quiz"
        ]

        document.getElementById("course-progress-bar").style.display = progressBar ? "flex" : "none";
        
        if (progressBar) {
            // Add the current course indicator on top of the given activity
            let nbOfExercices = currentCourse.activities.length;
            let currentActivityIndex = currentCourse.activities.findIndex(activity => activity.id == Activity.activity.id);

            // add green cells to .course-state until the current activity, then add grey cells
            let courseState = "";
            for (let i = 0; i < nbOfExercices; i++) {
                if (i <= currentActivityIndex) {
                    courseState += `<div class="course-state-item course-state-done"></div>`;
                } else {
                    courseState += `<div class="course-state-item course-state-todo"></div>`;
                }
            }
            $('.course-state').html(courseState);
        }


        // Check if the correction if available
        if (Activity.correction >= 1) {
            $('#activity-details-course').html(i18next.t("classroom.activities.sentOn") + formatHour(Activity.dateSend), i18next.t("classroom.activities.numberOfTries") + Activity.tries)
        } else {
            $('#activity-details-course').html(i18next.t("classroom.activities.toSend") + formatDay(Activity.dateEnd))
        }

        // Content management
        let content = manageContentForActivity();
        let correction = '';

        if (!UserManager.getUser().isRegular && Activity.correction > 1) {
            document.querySelector('#activity-correction-course').style.display = 'block';
            let activityResultString, activityResultColor;
            switch (Activity.note) {
                case 4:
                    activityResultString = i18next.t('classroom.activities.noProficiency')
                    activityResultColor = 'var(--classroom-text-2)'
                    break;
                case 3:
                    activityResultString = i18next.t('classroom.activities.veryGoodProficiency')
                    activityResultColor = 'var(--correction-3)'
                    break;
                case 2:
                    activityResultString = i18next.t('classroom.activities.goodProficiency')
                    activityResultColor = 'var(--correction-2)'
                    break;
                case 1:
                    activityResultString = i18next.t('classroom.activities.weakProficiency')
                    activityResultColor = 'var(--correction-1)'
                    break;
                case 0:
                    activityResultString = i18next.t('classroom.activities.insufficientProficiency')
                    activityResultColor = 'var(--correction-0)'
                    break;
                default:
                    break;
            }

            correction += `<div class="results-string" style="background-color:${activityResultColor}">${activityResultString}</div>`

            if (Activity.commentary != null && Activity.commentary != "") {
                correction += '<div id="commentary-panel-course">' + Activity.commentary + '</div>'
            } else {
                correction += '<div id="commentary-panel-course">' + i18next.t("classroom.activities.bilan.noComment") + '</div>'
            }

        } else {
            document.querySelector('#activity-correction-course').style.display = 'none';
        }

        injectContentForActivity(content, Activity.correction, Activity.activity.type, correction, isDoable, true);

        if (!Activity.evaluation && correction < 2 && !isDoable) {
            let allKnownActivity = [...activityType, "free"];
            if (!allKnownActivity.includes(Activity.activity.type)) {
                isDoable = false;
            } else {
                isDoable = true;
            }
        }
        this.isTheActivityIsDoable(isDoable);
    }

    validateCourse(correction) {
        switch(Activity.activity.type) {
            case 'free':
                this.coursesFreeValidateActivity(correction);
                break;
            case 'quiz':
                this.coursesquizValidateActivity(correction);
                break;
            case 'fillIn':
                this.coursesfillInValidateActivity(correction);
                break;
            case 'reading':
            case 'custom':
                this.coursesdefaultProcessValidateActivity();
                break;
            case 'dragAndDrop':
                this.coursesdragAndDropValidateActivity(correction);
                break;
            default:
                this.coursesdefaultProcessValidateActivity();
                break;
        }
    }

    coursesFreeValidateActivity(correction = 1) {
        let studentResponse = $('#activity-input-course').bbcode();
        Main.getClassroomManager().saveNewStudentActivity(coursesManager.actualCourse.activity, correction, null, studentResponse, coursesManager.actualCourse.link).then((response) => {
            this.coursesResponseManager(response, 'free');
        });
    }

    coursesquizValidateActivity(correction = 1) {
        let studentResponse = [];
        for (let i = 1; i < $(`input[id^="student-quiz-checkbox-"]`).length+1; i++) {
            let res = {
                inputVal: $(`#student-quiz-suggestion-${i}`).text(),
                isCorrect: $(`#student-quiz-checkbox-${i}`).is(':checked')
            }
            studentResponse.push(res);
        }
        
        Main.getClassroomManager().saveNewStudentActivity(coursesManager.actualCourse.activity, correction, null, JSON.stringify(studentResponse), coursesManager.actualCourse.link).then((response) => {
            this.coursesResponseManager(response, 'quiz');
        });
    }

    coursesdragAndDropValidateActivity(correction = 1) {
        let studentResponse = [];
        for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
            let string = document.getElementById(`dz-${i}`).children.length > 0 ? document.getElementById(`dz-${i}`).children[0].innerHTML : "";
            studentResponse.push({
                string: string
            });
        }
        Main.getClassroomManager().saveNewStudentActivity(coursesManager.actualCourse.activity, correction, null, JSON.stringify(studentResponse), coursesManager.actualCourse.link).then((response) => {
            this.coursesResponseManager(response, 'drag-and-drop');
        });
    }

    coursesfillInValidateActivity(correction = 1) {
        let studentResponse = [];
        for (let i = 1; i < $(`input[id^="student-fill-in-field-"]`).length+1; i++) {
            let string = document.getElementById(`student-fill-in-field-${i}`).value;
            studentResponse.push(string);
        }
        Main.getClassroomManager().saveNewStudentActivity(coursesManager.actualCourse.activity, correction, null, JSON.stringify(studentResponse), coursesManager.actualCourse.link).then((response) => {
            this.coursesResponseManager(response, 'fill-in');
        });
    }

    coursesdefaultProcessValidateActivity() {
        $("#activity-validate").attr("disabled", "disabled");
        let getInterface = tryToParse(Activity.activity.content);
        const vittaIframeRegex = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm;
        getInterface = getInterface ? vittaIframeRegex.exec(getInterface.description) : false;
        if (getInterface == undefined || getInterface == null) {
            let correction = 2;
            Main.getClassroomManager().saveStudentActivity(false, false, Activity.id, correction, 4).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else  {
                    coursesManager.manageAllActivityResponse(activity);
                }
            })
            window.localStorage.classroomActivity = null
        } else if (Activity.autocorrection == false) {
            let correction = 1;
            const interfaceName = getInterface[2];
            let project = window.localStorage[interfaceName + 'CurrentProject']
            Main.getClassroomManager().saveStudentActivity(JSON.parse(project), interfaceName, Activity.id).then(function (activity) {
                if (typeof activity.errors != 'undefined') {
                    for (let error in activity.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                        $("#activity-validate").attr("disabled", false);
                    }
                } else {
                    coursesManager.manageAllActivityResponse(activity);
                }
            })
        } else {
    
            $("#activity-validate").attr("disabled", false);
            window.localStorage.autocorrect = true
        }
    }

    coursesSaveActivitiesResponseManager(activityType = null, response = null) {
        if (activityType == 'fill-in') {

            displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
            if (response.hasOwnProperty("hint")) {
                if (response.hint != null && response.hint != "") {
                    $("#activity-hint-container-course").show();
                    $("#activity-hint-course").text(response.hint);
                }
            }
    
            let lengthResponse = $(`input[id^="student-fill-in-field-"]`).length;
            for (let i = 1; i < lengthResponse+1; i++) {
                if (response.badResponse.includes(i-1)) {
                    $(`#student-fill-in-field-${i}`).css("border","2px solid var(--correction-0)");
                } else {
                    $(`#student-fill-in-field-${i}`).css("border","2px solid var(--correction-3)");
                }
            }

        } else if (activityType == 'drag-and-drop') {

            displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
            for (let i = 0; i < $(`span[id^="dz-"]`).length; i++) {
                $('#dz-' + i).css("border","1px solid var(--correction-3)");
            }
    
            for (let i = 0; i < response.badResponse.length; i++) {
                $('#dz-' + (response.badResponse[i])).css("border","1px solid var(--correction-0)");
            }
    
            if (response.hasOwnProperty("hint")) {
                if (response.hint != null && response.hint != "") {
                    $("#activity-hint-container-course").show();
                    $("#activity-hint-course").text(response.hint);
                }
            }

        } else if (activityType == 'quiz') {

            displayNotification('#notif-div', "classroom.activities.wrongAnswerLarge", "error");
            for (let i = 1; i < $(`input[id^="student-quiz-suggestion-"]`).length+1; i++) {
                $('#student-quiz-suggestion-' + i).parent().addClass('quiz-answer-correct');
            }
    
            for (let i = 0; i < response.badResponse.length; i++) {
                $('#student-quiz-suggestion-' + (response.badResponse[i]+1)).parent().addClass('quiz-answer-incorrect');
            }
    
            if (response.hasOwnProperty("hint")) {
                if (response.hint != null && response.hint != "") {
                    $("#activity-hint-container-course").show();
                    $("#activity-hint-course").text(response.hint);
                }
            }

        } else if (activityType == 'free') {
            displayNotification('#notif-div', "classroom.activities.wrongAnswer", "error");
        }

    }


    coursesResponseManager(response, type) {
        if (response) {
            if (response.hasOwnProperty("message")) {
                if (response.message == "activitySaved") {
                    return "saved";
                } else if (response.message == "emptyAnswer") {
                    return "empty";
                }
            } else if (response.hasOwnProperty("badResponse")) {
                this.coursesSaveActivitiesResponseManager(type, response);
                return "bad";
            } else {
                this.coursesValidateDefaultResponseManagement(response);
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.errorSending", "error");
        }
    }

    coursesValidateDefaultResponseManagement(response) {
        $("#activity-validate-course").attr("disabled", false);

        if (response.note != null && response.correction > 1) {
            this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1).then(res => {
                coursesManager.manageAllActivityResponse(response);
            });
        } else {
            navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-classes-teacher');
        }
    }

    manageAllActivityResponse(response) {
        
        let messageDiv = document.getElementById("course-result-message"),
            endCourse = document.getElementById("course-options-course-buttons"),
            messageContent = document.getElementById("course-result-message-content"),
            validateBtn = document.getElementById("course-validate-buttons");

        validateBtn.style.display = "none";
        endCourse.style.display = "none";
        messageDiv.style.display = "none";

        if (response.note != null && response.correction > 1) {
            this._requestUpdateState(coursesManager.actualCourse.id, coursesManager.actualCourse.state + 1).then(res => {
                if (res.hasOwnProperty('success')) {
                    if (res.success) {
                        let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == coursesManager.actualCourse.id);
                        if (course.activities.length <= coursesManager.actualCourse.state + 1) {
                            // the course is ended
                            this.readCourseFromStudent();
                        } else {
                            // the course is not ended
                            messageDiv.style.display = "block";
                            endCourse.style.display = "flex";
                            messageContent.classList.add("course-text-success");
                            messageContent.innerHTML = "BRAVO ! TU AS RÉUSSI CETTE ACTIVIÉ !";
                        }
                    } else {
                        displayNotification('#notif-div', "classroom.notif.errorSending", "error");
                    }
                }
            });
        } else {
            navigatePanel('classroom-dashboard-activity-panel-correcting', 'dashboard-activities');
        }
    }

    viewCourseActivitiesResult(id = null) {
        let activitiesResultDiv = document.getElementById("course-activities-result"),
            courseResultNote = document.getElementById("course-result-note");

        activitiesResultDiv.innerHTML = "";
        let course = id == null ? Main.getClassroomManager()._myCourses.find(course => course.course.id == this.actualCourse.id) : Main.getClassroomManager()._myCourses.find(course => course.course.id == id);
        let courseLength = course.activities.length,
            courseSuccess = 0;
     
        for (let i = 0; i < course.activities.length; i++) {
            let note = 0;
            if (course.activities[i].activityLinkUser.note == 3) {
                note = "BIEN, tu as réussi cette activité !";
            } else if (course.activities[i].activityLinkUser.note < 3 && course.activities[i].activityLinkUser.note > 0) {
                note = "À REVOIR, la réponse n'est pas correcte";
            } else if (course.activities[i].activityLinkUser.note == 4) {
                note = "NON NOTÉ";
            }

            let html = `<div class="course-activities-result-activity" id="course-${course.id}"> 
                            <div class="preview-result-course-activity-title">
                                <p onclick="coursesManager.loadActivity(${course.course.id}, ${course.activities[i].activityLinkUser.id})">ACTVITÉ <br> N°${i+1}</p>
                            </div>

                            <div>
                                <div class="bilan-cell-course bilan-${course.activities[i].activityLinkUser.note}"></div>
                            </div>

                            <div class="align-self-center"> 
                                <p class="course-texte-result">${note}</p>
                            </div>
                        </div>`;

            activitiesResultDiv.innerHTML += html;

            if (course.activities[i].activityLinkUser.note === 3) {
                courseSuccess++;
            } else if (course.activities[i].activityLinkUser.note === 4) {
                courseLength -= 1;
            }
        }

        courseResultNote.innerText = `${courseSuccess}/${courseLength}`;
        navigatePanel('classroom-dashboard-course-panel-ended', 'dashboard-activities');
    }

    loadActivity(courseId, activityId) {
        let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == courseId),
            btnContainer = document.getElementById("course-validate-buttons");
        Activity = course.activities.find(activity => activity.activityLinkUser.id == activityId).activityLinkUser;
        navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities-teacher', 'course', '');
        this.loadCourseForStudents(true, course, false);
        btnContainer.style.display = "none";
    }

    readCourseFromStudent(id = null) {
        let resMessage = document.getElementById("course-result-message"),
            btnNext = document.getElementById("course-options-course-buttons"),
            btnValidate = document.getElementById("course-validate-buttons");

        resMessage.style.display = "none";
        btnNext.style.display = "none";

        this._requestGetMyCourseStudent().then(res => {
            Main.getClassroomManager()._myCourses = res;

            if (id == null) {
                id = coursesManager.actualCourse.id;
            }
    
            let course = Main.getClassroomManager()._myCourses.find(course => course.course.id == id);

            if (course.courseState == 999) {
                this.viewCourseActivitiesResult(id);
                return false;
            }
            
            Activity = course.activities[course.courseState].activityLinkUser;
            this.actualCourse = {
                id: id, 
                state: course.courseState, 
                link: Activity.id, 
                activity: Activity.activity.id
            };
        
            navigatePanel('classroom-dashboard-course-panel', 'dashboard-activities-teacher', 'course', '');
            this.loadCourseForStudents(true, course);
            btnValidate.style.display = "block";
        });
    }

    isTheActivityIsDoable(doable, hideValidationButton = false) {
        if (doable == false || UserManager.getUser().isRegular) {
            $('#activity-validate-course').hide();
            $('#activity-save-course').hide();
        } else {
            let getInterface = /\[iframe\].*?vittascience(|.com)\/([a-z0-9]{5,12})\/?/gm.exec(Activity.activity.content)
            if (!hideValidationButton) {
                if (!Activity.activity.isLti) {
                    $('#activity-validate-course').show();
                }
            }
            
             if (getInterface != undefined && getInterface != null) {
                $('#activity-save-course').show()
            }
    
            if (!Activity.activity.isLti) { 
                $('#activity-validate-course').show();
                if (Activity.activity.type != 'reading') {
                    $('#activity-save-course').show();
                }
            }
        }
    }

    _requestUpdateState(id,state) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=set_state_from_course",
                data: {
                    courseId: id,
                    state: state
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }


    _requestGetOneCourseById(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=get_one_from_classroom",
                data: {
                    courseId: id
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestAddCourse() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=add_from_classroom",
                data: {
                    course: JSON.stringify(this.courseData),
                    folder: foldersManager.actualFolder
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestUpdateCourse() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=update_from_classroom",
                data: {
                    courseId: this.courseId,
                    course: JSON.stringify(this.courseData)
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestDeleteCourse(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=delete_from_classroom",
                data: {
                    courseId: id,
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }


    _requestDuplicateCourse(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=course&action=duplicate_from_classroom",
                data: {
                    courseId: id,
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestUsersLinkCourse(courseId, students, classrooms) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=link_user_to_course",
                data: {
                    courseId: courseId,
                    students: students,
                    classrooms: classrooms
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestGetMyCourseTeacher() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=get_my_courses_as_teacher",
                success: (response) => {
                    let courses = [];
                    response = JSON.parse(response);
                    response.forEach(course => {
                        // keep only course when linked to activity
                        if (course.hasOwnProperty("activities")) {
                            courses.push(course);
                        }
                    });
                    resolve(courses);
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }

    _requestGetMyCourseStudent() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user_link_course&action=get_my_courses_as_student",
                success: (response) => {
                    let courses = [];
                    response = JSON.parse(response);
                    response.forEach(course => {
                        // keep only course when linked to activity
                        if (course.hasOwnProperty("activities")) {
                            courses.push(course);
                        }
                    });
                    resolve(courses);
                }
            });
        })
    }



}
// Initialize
const coursesManager = new CoursesManager();
coursesManager.init();