/**
 * ClassroomManager
 * Copyright 2020 Vittascience.
 * https://vittascience.com
 *
 *
 * This class purpose to manage the resources.
 */

/**
 * @class ClassroomManager
 * @author: Clemenard (Clément Menard)
 */
class ClassroomManager {
    /**
     * Creates an instance of ClassroomManager.
     * @public
     */
    constructor() {
        this._myActivities = [];
        this._myClasses = [];
        this._selectedClassroomToDelete = null;
        this._myTeacherActivities = [];
        this._tasksQueue = [];
        this._isExecutingTaskInQueue = false;
        this._allActivities = []
        this._allApps = []
        this._createActivity = {}
        this._lastCreatedActivity = 0;
        this._idActivityOnAttribution = 0;
        this.setDefaultActivityData();
        this.dragulaGlobal = false;
        this.displayMode = localStorage.getItem('classroomViewMode') != null ? localStorage.getItem('classroomViewMode') : 'card';
        this.wbbOpt = {
            allButtons : {
            },
            resize_maxheight: 354,
            autoresize: false,
            buttons: ",bold,italic,underline|,justifyleft,justifycenter,justifyright,customimageupload,link,|,quote,bullist,|,vittaiframe,cabriiframe,custompdfupload,video,peertube,vimeo,genialyiframe,gdocsiframe,answer",
        }
    }

    /**
     * Add a task to the queue and execute the queue manager
     * @param {function} task - Function that perform an xhr
     */
    _addTaskToQueue(task) {
        this._tasksQueue.push(task);
        this._executeTasksInQueue();
    }

    /**
     * Loop in the queue and execute queued taks one after another. If the executing loop is already in progress, doesn't do anything.
     */
    async _executeTasksInQueue() {
        // Return if the loop is already in progress.
        if (this._isExecutingTaskInQueue)
            return;
        // Change the state to currently executing the loop
        this._isExecutingTaskInQueue = true;
        // Loop in the queue by shifting tasks and executing them one by one (awaiting for a task to end before looping again)
        while (this._tasksQueue.length > 0) {
            let currentTask = this._tasksQueue.shift();
            await new Promise((resolve, reject) => {
                try {
                    currentTask(resolve);
                } catch (error) {
                    console.warn(error);
                    resolve();
                }
            });
        }
        // When the loop has ended (no more task in the queue), change the state to currently idle
        this._isExecutingTaskInQueue = false;
    }

    /**
     * Get activities linked to an user
     * Access with Main.getClassroomManager()._myActivities
     * @public
     * @returns {Array}
     */
    getStudentActivities(container) {
        return new Promise(function (resolve, reject) {
            $("#spinner-loading").show();
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myActivities = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_student_activities",
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            }).always((resolve) => {
                $("#spinner-loading").hide();
            });
        })
    };

    /**
     * Get classrooms from the user
     * Access with Main.getClassroomManager()._myClasses
     * @public
     * @returns {Array}
     */
    getClasses(container) {
        return new Promise((resolve, reject) => {
            // Wrap the current action into a task function
            let currentTask = (onEnd) => {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=classroom&action=get_by_user",
                    success: function (response) {
                        if (JSON.parse(response).error_message && JSON.parse(response).error_message !== undefined) {
                            container.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                        }
                        let responseParsed = JSON.parse(response);
                        for (let classroom of responseParsed){
                            if(classroom.classroom.groupe) {
                                classroom.classroom.name = `${classroom.classroom.name} | ${classroom.classroom.groupe}`;
                            }
                        }
                        container._myClasses = responseParsed;
                        onEnd();
                        resolve();
                    },
                    error: function () {
                        console.log('error');
                        onEnd();
                    }
                });
            }
            // Add the current task to the tasks queue
            this._addTaskToQueue(currentTask);
        });
    }

    /**
     * Get teachers from the classroom
     * Access with Main.getClassroomManager()._myTeachers
     * @public
     * @returns {Array}
     */
    getTeachers(container) {
        return new Promise(function (resolve, reject) {
            var process = function (thisInstance, response) {
                if (response.error_message && response.error_message !== undefined) {
                    thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                }
                thisInstance._myTeachers = response;
                resolve()

            };
            var callBack = function (thisInstance, response) {
                process(thisInstance, response);
            };
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_teachers_by_classroom",
                data: {
                    'classroom': ClassroomSettings.classroom
                },
                success: function (response) {
                    callBack(container, JSON.parse(response));
                },
                error: function () {
                    console.log('error')
                }
            });
        })
    };

    /**
     * Get activities created by the user
     * Access with Main.ClassroomManager()._myTeacherActivities;
     * @public
     * @returns {Array}
     */
    getTeacherActivities(container) {
        if(window.matomoManager &&  !window.matomoManager.startTime) window.matomoManager.startTimer()
        return new Promise((resolve, reject) => {
            $("#spinner-loading ").show();
            let currentTask = (onEnd) => {
                var process = function (thisInstance, res) {
                    if (res.error_message && res.error_message !== undefined) {
                        thisInstance.errors.push(GET_PUBLIC_PROJECTS_ERROR)
                    }
                    thisInstance._myTeacherActivities = res;
                    resolve()
                    onEnd();
                };
               $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=activity&action=get_mine_for_classroom",
                    success: function (response) {
                        Main.getClassroomManager().getAllApps().then(res => {
                            for (let i = 0; i < res.length; i++) {
                                if (!foldersManager.icons.hasOwnProperty(res[i].name)) {
                                    foldersManager.icons[res[i].name] = res[i].image;
                                }
                            }
                            process(container, JSON.parse(response));
                            onEnd();
                        });
                        if(window.matomoManager)
                            window.matomoManager.stopTimer(false)
                    },
                    error: function () {
                        console.log('error')
                        onEnd();
                    }
                }).then((resolve)=>{
                    $("#spinner-loading ").hide();
                });
            }
            // Add the current task to the tasks queue
            this._addTaskToQueue(currentTask);
        })
    };




    /**
     * create a new classroom
     * @param {FormData}
     * @return {Classroom}
     */
    addClassroom(payload) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=add",
                data: payload,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * update a  classroom
     * @param {FormData}
     * @return {Classroom}
     */
    updateClassroom(payload) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=update",
                data: payload,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * get a classroom by his link
     * @param {FormData}
     * @return {Classroom}
     */
    getClassroom(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_by_link",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * get a classroom by his student
     * @param {FormData}
     * @return {Classroom}
     */
    getMyClassroom(idStudent) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_by_user",
                data: {
                    "user": idStudent
                },
                success: function (response) {
                    resolve(JSON.parse(response).classroom)

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * add a non-gar student
     */
    createAccount(pseudo, classroomLink) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=linkSystem",
                data: {
                    "pseudo": pseudo,
                    "classroomLink": classroomLink
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * connect a non-gar student
     */
    connectAccount(pseudo, password, classroomLink) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=get_one_by_pseudo_and_password",
                data: {
                    "pseudo": pseudo,
                    "password": password,
                    "classroomLink": classroomLink
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function (error) {
                    reject(error);
                }
            });
        })
    }

    /**
     * connect to the demoStudent account
     */
    getDemoStudent(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_demo_student_account",
                data: {
                    "link": link,
                },
                success: function () {

                    window.location.href = "?panel=classroom-dashboard-profil-panel&nav=dashboard-profil";
                    resolve();

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * connect to the teacher account
     */
    getTeacherAccount(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_teacher_account",
                data: {
                    "link": link,
                },
                success: function () {
                    window.location.href = "?panel=classroom-dashboard-profil-panel-teacher&nav=dashboard-profil-teacher";
                    resolve();

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Add students to the classroom
     * @public
     * @returns {Array}
     */
    addUsersToGroup(arrayUsers, arrayExistingUsers, classroom) {
        return new Promise(function (resolve, reject) {
            if (arrayUsers.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=classroom_link_user&action=add_users",
                    data: {
                        "users": arrayUsers,
                        "existingUsers": arrayExistingUsers,
                        "classroom": classroom
                    },
                    success: function (response) {
                        resolve(JSON.parse(response))

                    },
                    error: function () {
                        reject();
                    }
                });
            } else {
                resolve({
                    "noUser": true
                });
            }
        })
    }

    isActivityAutocorrected() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get",
                data: {
                    "id": ClassroomSettings.activity,
                    "classroomLink": ClassroomSettings.classroom,
                    "reference": ClassroomSettings.ref
                },
                success: function (response) {
                    let isRetroAttributed = JSON.parse(response).isRetroAttributed
                    ClassroomSettings.isRetroAttributed = isRetroAttributed
                    let content = JSON.parse(response).content
                    let link = content.replace(/\n/, '');
                    link = content.replace(/.*(\[iframe\].*python\/\?link=)([a-f0-9]{13}).*/, "$2")
                    if (/^[a-f0-9]{13}/.test(link)) {
                        $.ajax({
                            type: "POST",
                            url: "/routing/Routing.php?controller=project&action=is_autocorrected",
                            data: {
                                "link": link
                            },
                            success: function (response) {
                                resolve(JSON.parse(response))

                            },
                            error: function () {
                                reject();
                            }
                        });

                    } else {
                        resolve(false)
                    }
                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * @ToBeRemoved
     * Last check October 2021
     *
     * Get students list in the classroom
     * @public
     * @returns {Array}
     */
    // getUsersInClassroom(link) {
    //     return new Promise(function (resolve, reject) {
    //         $.ajax({
    //             type: "POST",
    //             url: "/routing/Routing.php?controller=classroom_link_user&action=get_by_classroom",
    //             data: {
    //                 "classroom": link
    //             },
    //             success: function (response) {
    //                 resolve(JSON.parse(response))

    //             },
    //             error: function () {
    //                 reject();
    //             }
    //         });
    //     })
    // }

    /**
     * Get general data about the user (activities to do, activities done, courses todo, courses done)
     * @public
     * @returns {Array}
     */
    getStudentActivity() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_student_data",
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get general data about the teacher (activities to do, activities done, courses todo, courses done)
     * @public
     * @returns {Array}
     */
    getTeacherActivity() {
        return new Promise((resolve, reject) => {
            let currentTask = (onEnd) => {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=activity_link_user&action=get_teacher_data",
                    success: function (response) {
                        resolve(JSON.parse(response))
                        onEnd();
                    },
                    error: function () {
                        reject();
                        onEnd();
                    }
                });
            }
            // Add the current task to the tasks queue
            this._addTaskToQueue(currentTask);
        })
    }

    /**
     * Delete a student
     * @public
     * @returns {Array}
     */
    deleteStudent(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=delete",
                data: {
                    "id": parseInt(id)
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Delete a project
     * @public
     * @returns {Array}
     */
    deleteProject(link) {
        return new Promise(function (resolve, reject) {
            link = link.replace(/.+link=([0-9a-f]{13}).+/, '$1')
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project&action=delete_project",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Share a project
     * @public
     * @returns {Array}
     */
    shareProject(linkProject, idUsers) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project_link_user&action=add",
                data: {
                    "linkProject": linkProject,
                    "idUsers": idUsers
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     *
     * @public
     * @returns {Array}
     */
    undoAttributeActivity(ref,classroomId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=remove_by_reference",
                data: {
                    "reference": ref,
                    "classroomId" : classroomId
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Generate a new password for a classroom user
     * @public
     * @returns {Array}
     */
    generatePassword(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=generate_classroom_user_password",
                data: {
                    "id": parseInt(id)
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Generate a new password for a classroom user
     * @public
     * @returns {Array}
     */
    changePseudo(id, pseudo) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=change_pseudo_classroom_user",
                data: {
                    "id": parseInt(id),
                    "pseudo": pseudo
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get one activity of the user by his id
     * @public
     * @returns {Array}
     */
    getOneUserLinkActivity(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=get_one",
                data: {
                    'id': id
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Create an activity
     * */
    addActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=add",
                data: activity,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Create several activities
     * */
    addActivities(activities) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=add_several",
                data: activities,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Update an activity
     * */
    editActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=update",
                data: activity,
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Delete an activity
     * */
    deleteActivity(activity) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=delete",
                data: {
                    "id": activity
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Duplicate a project
     * */
    duplicateProject(link) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=project&action=duplicate",
                data: {
                    "link": link
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Delete a classroom
     * */
    deleteClassroom(classroom) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=delete",
                data: {
                    "link": classroom
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }
    /**
     * Get an activity by his id
     * */
    getActivity(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=get",
                data: {
                    "id": id,
                    "classroomLink": ClassroomSettings.classroom,
                    "reference": ClassroomSettings.ref
                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Associate activity to users
     * @public
     * @returns {Array}
     */
    attributeActivity(data,container) {
        return new Promise((resolve, reject) =>{
            // Wrap the current action into a task function
            let currentTask = onEnd => {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=activity_link_user&action=add_users",
                    data: data,
                    success: function (response) {
                        if (JSON.parse(response).error_message && JSON.parse(response).error_message !== undefined) {
                            container.errors.push(GET_PUBLIC_PROJECTS_ERROR);
                        }
                        onEnd()
                        resolve(JSON.parse(response));
                    },
                    error: function () {
                        onEnd()
                    }
                });
            }
            // Add the current task to the tasks queue
            this._addTaskToQueue(currentTask);
        })
    }
    /**
     * Update a student's exercise with his project
     * */
    saveStudentActivity(project, interfac, activity, correction = 1, note = 0) {
        if (project) {
            return new Promise(function (resolve, reject) {
                let currentCode = JSON.parse(window.localStorage.currentExercise)
                if (currentCode.manuallyModified == null)
                    currentCode.manuallyModified = true
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=project&action=add",
                    data: {
                        'name': project.name,
                        'description': "Copie d'un apprenant",
                        'code': currentCode.code,
                        'dateUpdated': new Date(),
                        'codeText': currentCode.codeText,
                        'codeManuallyModified': currentCode.manuallyModified,
                        'public': false,
                        'mode': project.mode,
                        'interface': interfac,
                        'activity': true

                    },
                    dataType: "JSON",
                    success: function (response) {
                        $.ajax({
                            type: "POST",
                            url: "/routing/Routing.php?controller=activity_link_user&action=update",
                            data: {
                                'project': response.id,
                                'id': activity,
                                'correction': correction,
                                'classroomLink': ClassroomSettings.classroom,
                                'note': note

                            },
                            success: function (r) {
                                resolve(JSON.parse(r))
                            }
                        });

                    },
                    error: function () {
                        reject();
                    }
                });
            })
        } else {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=activity_link_user&action=update",
                    data: {
                        'id': activity,
                        'correction': correction,
                        'classroomLink': ClassroomSettings.classroom,
                        'note': note
                    },
                    success: function (r) {
                        resolve(JSON.parse(r))
                    }
                });
            });
        }
    }


    /**
     * Get class users and their activities
     * @public
     * @returns {Array}
     */
    setActivityCorrection(activity, correction, note, comment) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity_link_user&action=update",
                data: {
                    'project': activity.project,
                    'id': activity.id,
                    'correction': correction,
                    "commentary": comment,
                    'classroomLink': ClassroomSettings.classroom,
                    'note': note

                },
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Get class users and their activities
     * @public
     * @returns {Array}
     */
    getChangesForTeacher() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom_link_user&action=get_changes_for_teacher",
                success: function (response) {
                    resolve(JSON.parse(response))

                },
                error: function () {
                    reject();
                }
            });
        })
    }

    /**
     * Add students to the classroom
     * @public
     * @returns {Array}
     */
    addUsersToGroupByCsv(arrayUsers, classroom) {
        return new Promise(function (resolve, reject) {
            if (arrayUsers.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/routing/Routing.php?controller=classroom_link_user&action=add_users_by_csv",
                    data: {
                        "users": arrayUsers,
                        "classroom": classroom
                    },
                    success: function (response) {
                        resolve(JSON.parse(response))

                    },
                    error: function () {
                        reject();
                    }
                });
            } else {
                resolve([])

            }
        })
    }

    /**
     * Get the password of a student using his id
     * @param {number} userId - the id of the current student
     */
    getStudentPassword(userId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=get_student_password",
                data: {
                    "id": userId
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    /**
     * Reset the password of a student using his id
     * @param {number} userId - the id of the current student
     */
    resetStudentPassword(userId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=user&action=reset_student_password",
                data: {
                    "id": userId
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    /**
     * Update the current teacher account by sending the new typed informations
     * @param {object} formData - form data object
     */
    updateTeacherAccount(formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/routing/Routing.php?controller=user&action=update_user_infos',
                data: {
                    'id': formData.get('teacher-id'),
                    'firstname': formData.get('first-name'),
                    'surname': formData.get('last-name'),
                    'email': formData.get('email'),
                    'password': formData.get('password'),
                    'current_password': formData.get('current-password')
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    /**
     * Create teacher account (registration)
     */
    createTeacherAccount(formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/routing/Routing.php?controller=user&action=register',
                data: {
                    'firstname': formData.get('first-name'),
                    'surname': formData.get('last-name'),
                    'pseudo': formData.get('nickname'),
                    'email': formData.get('email'),
                    'password': formData.get('password'),
                    'password_confirm': formData.get('confirm-password')
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    /**
     * Send e-mail to the LMS owner
     * @param {formData object} formData
     */
    sendHelpRequestFromTeacher(formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/routing/Routing.php?controller=user&action=help_request_from_teacher',
                data: {
                    'subject': formData.get('subject'),
                    'message': formData.get('message'),
                    'id': formData.get('id')
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    /**
     * Send e-mail to the teacher of the current learner
     * @param {formData object} formData
     */
    sendHelpRequestFromLearner(formData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/routing/Routing.php?controller=user&action=help_request_from_student',
                data: {
                    'subject': formData.get('subject'),
                    'message': formData.get('message'),
                    'id': formData.get('id')
                },
                success: function (response) {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        console.warn(error);
                    }
                },
                error: function () {
                    reject();
                }
            });
        });
    }

    getClassroomIdByLink(link){
        for(let classroom of this._myClasses){
            if(classroom.classroom.link == link) return classroom.classroom.id
        }
    }


    // New exercices management

    /**
     * @public
     * @param {string} activityId
     * @returns {Activity}
     * @memberof ActiviiesManager
     * @description Get an activity by its id
     * @example
     * const activity = activitiesManager.getActivityById('activityId')
     */
    getActivityById(activityId) {
        return this._allActivities.find(activity => activity.id === activityId)
    }


    /**
     * Get all the apps
     * @public
     * @returns {Array}
     */
    getAllApps() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=get_all_apps",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject('error')
                }
            });
        })
    };

    //get one app by id
    // write the commentaries

    /**
     * @public
     * @param {string} activityId
     * @returns {Activity}
     * @description Get an activity by its id
     * @example
     * const activity = main.getClassroomManager.getActivityById('activityId')
     */
    getActivityById(id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=get_one_activity",
                data: {
                    'id': id
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

    // create a new activity
    createNewActivity($title, $type, $content, $solution, $tolerance, $autocorrect, $folder, $typeTool) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=create_exercice",
                data: {
                    'title' : $title,
                    'type' : $type,
                    'content' : $content,
                    'solution' : $solution,
                    'tolerance' : $tolerance,
                    'autocorrect' : $autocorrect,
                    'folder' : $folder,
                    'typetool': $typeTool ? $typeTool : "applications"
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

    // update an activity
    updateActivity($id, $title, $type, $content, $solution, $tolerance, $autocorrect, $typeTool) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=update_activity",
                data: {
                    'id' : $id,
                    'title' : $title,
                    'type' : $type,
                    'content' : $content,
                    'solution' : $solution,
                    'tolerance' : $tolerance,
                    'autocorrect' : $autocorrect,
                    'typetool': $typeTool ? $typeTool : "applications",
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


    // delete an activity

    deleteActivity($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=delete_activity",
                data: {
                    'id' : $id
                },
                success: function (response) {
                    resolve(response);
                },
                error: function () {
                    reject('error')
                }
            });
        })
    }


    /**
     * Return if the activity is limited or not
     * @param {*} type 
     * @param {*} id
     */
    isActivitiesRestricted(id = null, type = null) {
        // Only one check can be done at the same time
        if (id != null && type != null) {
            return false;
        }
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=activity&action=isActivitiesLimited",
                data: {
                    activityId: id,
                    activityType: type
                },
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        });
    }


    saveNewStudentActivity(activity, correction = 1, note = 0, response, activityLinkUserId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=save_new_activity",
                data: {
                    'id': activity,
                    'activityLinkUserId': activityLinkUserId,
                    'correction': correction,
                    'classroomLink': ClassroomSettings.classroom,
                    'note': note,
                    'response': response
                },
                success: function (r) {
                    resolve(JSON.parse(r))
                }
            });
        });
    }


    getActivityAutocorrectionResult(activity, activityLinkUserId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=get_autocorrect_result",
                data: {
                    'activityId': activity,
                    'activityLinkId': activityLinkUserId,
                },
                success: function (r) {
                    resolve(JSON.parse(r))
                }
            });
        });
    }

    getStudentLinkActivity(studentId, activityId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=get_student_link_activity",
                data: {
                    'studentId': studentId,
                    'activityId': activityId
                },
                success: function (r) {
                    resolve(JSON.parse(r))
                }
            });
        });
    }

    duplicateActivity(activityId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=newActivities&action=duplicate_activity",
                data: {
                    'activityId': activityId
                },
                success: function (r) {
                    resolve(JSON.parse(r))
                }
            });
        });
    }

    setDefaultActivityData() {
        this._createActivity = {
            function: 'create',
            id: '',
            title: '', 
            content: {
                states: '',
                description: '',
                hint: '',
                fillInFields: {
                    contentForTeacher: [],
                    contentForStudent: [],
                },
                quiz: {
                    contentForStudent: []
                },
                dragAndDropFields: {
                    contentForTeacher: [],
                    contentForStudent: []
                }
            }, 
            type: '', 
            solution: [],
            tolerance: ''
        }
        const globalTitle = document.querySelector('#global_title');
        if (globalTitle != null) {
            document.querySelector('#global_title').value = '';
        }
    }

    /**
     * Retrieve locally a classroom by its link
     * @param {string} link - A classroom link
     * @returns The classroom if found, otherwise false
     */
    getLocalClassroomByLink(link) {
        if(typeof link !== 'string') {
            console.error('The provided link must be a string!');
        }
        for (let classroom of this._myClasses) {
            if (classroom.classroom.link === link) {
                return classroom;
            }
        }
        return false;
    }

    /**
     * Retrieve locally a student by its id
     * @param {number} id - A student id
     * @returns The student if found, otherwise false
     */
    getLocalCurrentClassroomStudentById(id) {
        if(typeof id !== 'number') {
            console.error('The provided id must be a number!');
            return false;
        }
        const currentClassroom = this.getLocalClassroomByLink(ClassroomSettings.classroom);
        for (let student of currentClassroom.students) {
            if (student.user.id === id) {
                return student;
            }
        }
        return false;
    }

    /**
     * Get session IDs for all users in a specific classroom by classroom ID
     * @param {number} classroomId - ID of the classroom
     * @returns {Promise<Array>} - A promise that resolves to an array of objects, each containing a user and their associated session IDs
     */
    getUserSessionIds(classroomId, userId) {
        return new Promise((resolve, reject) => {
            let data = {};
    
            if (classroomId) {
                data["classroomId"] = classroomId;
            } else if (userId) {
                data["userId"] = userId;
            } else {
                reject("Invalid parameters. Provide either classroomId or userId.");
                return;
            }
    
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=classroom&action=get_user_sessions",
                data: data,
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject("Failed to retrieve user session IDs");
                }
            });
        });
    }    
}

