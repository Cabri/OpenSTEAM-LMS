/**
 * managerManager
 * Copyright 2021 Vittascience.
 * https://vittascience.com
 *
 */

/**
 * @class managerManager
 * @author: COINTE Rémi
 */
class managerManager {
    /**
     * Creates an instance of managerManager.
     * @public
     */
    constructor() {
        this._allGroups = []
        this._comboGroups = []
        this._addedCreateUserGroup = 0
        this._updatedUserGroup = 0
        this._allActualUsers = []
        this._allMembersAndTheirGroups = []
        this._paginationUsersInfo = []
        this._paginationGroupsInfo = []
        this._allApplications = []
        this._actualGroup = 0
        this._actualUser = 0
        this._actualUserDetails = []
        this._tasksQueue = [];
        this._isExecutingTaskInQueue = false;
        this._defaultRestrictions = [];
    }

    /**
     * GROUPS FUNCTION
     */

    isAdmin() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=is_user_admin",
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
     * Get actual group informations
     * Access with Main.getmanagerManager()._actualGroupInfos
     * @public
     * @returns {Array}
     */
    getGroupInfos($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_group_info",
                data: {
                    id: $group_id
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

    // Fetch all the groups and store them in "_comboGroups"
    getAllGroups() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_groups",
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    // fetch all the groups in the page and store them in "_allGroups"
    getAllGroupsInfos($sort, $page, $groupspp) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=panel_groups_info",
                data: {
                    sort: $sort,
                    page: $page,
                    groupspp: $groupspp
                },
                success: function (response) {
                    mainManager.getmanagerManager()._allGroups = JSON.parse(response);
                    mainManager.getmanagerManager().showGroupsInTable((JSON.parse(response)));
                    mainManager.getmanagerManager().getAllGroups().then((data) => {
                        mainManager.getmanagerManager()._comboGroups = data;
                    });
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    // fetch all the applications linked to the group
    getApplicationsFromGroup($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_applications_from_group",
                data: {
                    id: $id
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

    getAllActivitiesRestrictions($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_activities_restrictions_applications",
                data: {
                    application_id: $application_id
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
     * @param {*} $restriction_id
     * @returns promise
     */
    getActivityRestrictionFromApp($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_restriction_activity_applications",
                data: {
                    application_id: $application_id
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
     * @param {*} $restriction_id
     * @returns promise
     */
     getDefaultRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_restrictions",
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
     * @returns promise
     */
     getDefaultActivitiesRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_activities_restrictions",
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
     * @returns promise
     */
     getDefaultGroupsRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_groups_restrictions",
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
     * @returns promise
     */
     getDefaultUsersRestrictions() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_default_users_restrictions",
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
     * @returns promise
     */
    updateDefaultUsersRestrictions($maxStudents, $maxClassrooms) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_default_users_restrictions",
                data: {
                    maxStudents: $maxStudents,
                    maxClassrooms: $maxClassrooms
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
     * @returns promise
     */
    updateDefaultGroupsRestrictions($maxStudents, $maxTeachers, $maxPerTeachers, $maxClassrooms) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_default_groups_restrictions",
                data: {
                    maxStudents: $maxStudents,
                    maxTeachers: $maxTeachers,
                    maxPerTeachers: $maxPerTeachers,
                    maxClassrooms: $maxClassrooms,
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

    getAllApplications() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_applications",
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getApplicationById($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_application_by_id",
                data: {
                    application_id: $application_id
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

    updateApplication($application_id, $application_name, $application_description, $application_image, $lti_data, $application_color, $restriction_max, $application_sort_index) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_application",
                data: {
                    application_id: $application_id,
                    application_name: $application_name,
                    application_description: $application_description,
                    application_color: $application_color,
                    application_image: $application_image,
                    restriction_max: $restriction_max,
                    lti_data: JSON.stringify($lti_data),
                    application_sort_index: $application_sort_index
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

    deleteApplication($application_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_application",
                data: {
                    application_id: $application_id
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


    createApplication($application_name, $application_description, $application_image, $lti_data, $application_color, $restriction_max, $application_sort_index) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_application",
                data: {
                    application_name: $application_name,
                    application_description: $application_description,
                    application_image: $application_image,
                    application_color: $application_color,
                    restriction_max: $restriction_max,
                    lti_data: JSON.stringify($lti_data),
                    application_sort_index: $application_sort_index
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

    // Add a group
    createGroup($group_description, $group_name, $group_app, $global_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_group",
                data: {
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app,
                    global_restriction: $global_restriction
                },
                success: function (response) {
                    resolve(JSON.parse(response))
                },
                error: function () {
                    reject();
                }
            });
        })
    };

    /**
     * @param {int} $group_id
     * @param {string} $group_name
     * @param {string} $group_description
     * @param {array} $group_app
     * @returns {object} response
     */
    updateGroup($group_id, $group_name, $group_description, $group_app, $global_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_group",
                data: {
                    id: $group_id,
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app,
                    global_restriction: $global_restriction
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
     * @param {int} $group_id
     * @returns {object} response
     */
    deleteGroup($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_group",
                data: {
                    id: $group_id
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
     * Update the user's applications
     * @param {int} $user_id
     * @param {array} $user_app
     * @returns
     */
    updateUserApps($user_id, $user_app, $global_user_restriction) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_user_app",
                data: {
                    user_id: $user_id,
                    user_app: $user_app,
                    global_user_restriction: $global_user_restriction
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
     * @param {int} $id
     * @returns
     */
    getAdminFromGroup($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_admin_from_group",
                data: {
                    id: $id
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

    getAllAdmins() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_all_admins",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    createUserAndLinkToGroup($firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $apps) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=create_user",
                data: {
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    admin: $is_admin,
                    teacher: $is_teacher,
                    grade: $teacher_grade,
                    subject: $teacher_suject,
                    mail: $mail,
                    school: $school,
                    apps: JSON.stringify($apps)
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

    updateUser($user_id, $firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $is_admin, $is_teacher, $teacher_grade, $teacher_suject, $school, $is_active, $application) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=update_user",
                data: {
                    user_id: $user_id,
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    admin: $is_admin,
                    teacher: $is_teacher,
                    grade: $teacher_grade,
                    subject: $teacher_suject,
                    mail: $mail,
                    school: $school,
                    isactive: $is_active,
                    application: $application
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

    disableUser($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=disable_user",
                data: {
                    user_id: $user_id,
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    deleteUser($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=delete_user",
                data: {
                    user_id: $user_id,
                },
                success: function (res) {
                    resolve(JSON.parse(res));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getUserInfo($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_user_info",
                data: {
                    id: $user_id
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

    getUserInfoWithHisGroups($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=get_user_info_with_his_groups",
                data: {
                    id: $user_id
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

    showGroupMembers($group_id, $page, $userspp, $sort) {
        mainManager.getmanagerManager()._actualGroup = $group_id;
        const process = (data) => {
            let $data_table = "",
                $data_table_inactive ="",
                group = "",
                activeUsers = 0,
                inactiveUsers = 0;

            mainManager.getmanagerManager()._allActualUsers = [];

            mainManager.getmanagerManager()._allGroups.forEach(element => {
                if (element.id == $group_id)
                    group = element;
            });

            if ($group_id == -1)
                $('#group_name_from_table').text(i18next.t('manager.group.usersWithoutGroups'));
            else if ($group_id == -2)
                $('#group_name_from_table').text(i18next.t('manager.group.usersInactiveOrNoRegular'));
            else
                $('#group_name_from_table').text(group.name);

            if (data == false) {
                return;
            }
            data.forEach(element => {
                if (element.hasOwnProperty('currentPage')) {
                    mainManager.getmanagerManager()._paginationUsersInfo = element;
                    let usersperpage = $('#users_per_page').val(),
                        htmlButtons = "",
                        sort = $('#sort_users_filter').val();

                    if (element.totalPagesCount > 1) {
                        htmlButtons += `<ul class="pagination justify-content-center">`;
                        if (element.previousPage > 1) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().showGroupMembers(${$group_id}, 1, ${usersperpage}, ${sort})"><a class="page-link" href="javascript:void(0)">First Page</a></li>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().showGroupMembers(${$group_id}, ${element.previousPage}, ${usersperpage}, ${sort})"><a class="page-link" href="javascript:void(0)">${element.previousPage}</a></li>`;
                        }
                        htmlButtons += `<li class="page-item active"><a class="page-link" href="javascript:void(0)">${element.currentPage}<a/></li>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().showGroupMembers(${$group_id}, ${element.nextPage}, ${usersperpage}, ${sort})"><a class="page-link" href="javascript:void(0)">${element.nextPage}</a></li>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().showGroupMembers(${$group_id}, ${element.totalPagesCount}, ${usersperpage}, ${sort})"><a class="page-link" href="javascript:void(0)">Last Page - ${element.totalPagesCount}</a></li>`;
                        }
                        htmlButtons += `</ul>`;
                    }
                    $('#paginationButtons_users').html(htmlButtons);
                } else {

                    mainManager.getmanagerManager()._allActualUsers.push(element);

                    let $droits = " <i class='fas fa-question fa-2x' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userNoRights') + "'></i>";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ?
                            "<i class='fas fa-crown fa-2x c-text-gold' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userAdmin') + "' ></i>" :
                            "<i class='fas fa-user fa-2x c-text-primary' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userTeacher') + "'></i>";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null && element_2.image != "") {
                                div_img += `<img src="${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/no-app-icon.svg?version=VERSIONNUM" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
                        });
                    }

                    let rowDelete = "";
                    if (element.hasOwnProperty('active')) {
                        if (element.active == "1" ) {
                            rowDelete = `<button class = "btn c-btn-red btn-sm" data-i18n="manager.buttons.disable" onclick="disableUser(${element.id})">${i18next.t('manager.buttons.disable')} <i class="fas fa-user-lock"></i></button>`;
                        } else {
                            rowDelete = `<button class = "btn c-btn-red btn-sm" data-i18n="manager.buttons.delete" onclick="deleteUser(${element.id})">${i18next.t('manager.buttons.delete')} <i class="fas fa-user-minus"></i></button>`;
                        }
                    } else {
                        rowDelete = `<button class = "btn c-btn-red btn-sm" data-i18n="manager.buttons.delete" onclick="deleteUser(${element.id})">${i18next.t('manager.buttons.delete')} <i class="fas fa-user-minus"></i></button>`;
                    }

                    let activeFlag = true;
                    if (element.hasOwnProperty('active')) {
                        if (element.active != "1" && $group_id != -2) {
                            activeFlag = false;
                        }
                    }
                    if (activeFlag) {
                        activeUsers++;
                        $data_table +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPassword(${element.id})">
                                    <i class="fas fa-redo-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal(${element.id})">
                                    <i class="fas fa-pencil-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                ${rowDelete}
                            </td>
                        </tr>`;
                    } else {
                        inactiveUsers++;
                        $data_table_inactive +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPassword(${element.id})">
                                    <i class="fas fa-redo-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal(${element.id})">
                                    <i class="fas fa-pencil-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                ${rowDelete}
                            </td>
                        </tr>`;
                    }
                }
            });

            $('#active-users-manager').html(i18next.t('manager.title.activeUsers') + " : " + activeUsers);
            $('#inactive-users-manager').html(i18next.t('manager.title.inactiveUsers') + " : " + inactiveUsers);

            $('#table_info_group_data').html($data_table);
            $('#table_info_group_data_inactive').html($data_table_inactive);
            $('[data-toggle="tooltip"]').tooltip()

        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=get_all_members_from_group",
            data: {
                id: $group_id,
                page: $page,
                userspp: $userspp,
                sort: $sort
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    globalSearchUser($name, $page, $usersperpage) {
        const process = (res) => {
            mainManager.getmanagerManager()._allActualUsers = [];
            let $data_table = "",
                $data_table_inactive = "";

            $('#group_name_from_table').text(i18next.t('manager.group.searchResult'));
            res.forEach(element => {
                if (element.hasOwnProperty('currentPage')) {
                    mainManager.getmanagerManager()._paginationUsersInfo = element;
                    let name = $('#name_user_search').val(),
                        usersperpage = $('#users_per_page').val(),
                        htmlButtons = "";

                    if (element.totalPagesCount > 1) {
                        htmlButtons += `<ul class="pagination justify-content-center">`;
                        if (element.previousPage > 1) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().globalSearchUser(${name}, 1, ${usersperpage})"><a class="page-link" href="javascript:void(0)">First Page</a></li>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().globalSearchUser(${name}, ${element.previousPage}, ${usersperpage})"><a class="page-link" href="javascript:void(0)">${element.previousPage}</a></li>`;
                        }
                        htmlButtons += `<li class="page-item active"><a class="page-link" href="javascript:void(0)">${element.currentPage}</a></li>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().globalSearchUser(${name}, ${element.nextPage}, ${usersperpage})"><a class="page-link" href="javascript:void(0)">${element.nextPage}</a></li>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<li class="page-item" onclick="mainManager.getmanagerManager().globalSearchUser(${name}, ${element.totalPagesCount}, ${usersperpage})"><a class="page-link" href="javascript:void(0)">Last Page - ${element.totalPagesCount}</a></li>`;
                        }
                        htmlButtons += `</ul>`;
                    }

                    $('#paginationButtons_users').html(htmlButtons);
                } else {
                    mainManager.getmanagerManager()._allActualUsers.push(element);
                    let $droits = " <i class='fas fa-question fa-2x' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userNoRights') + "' ></i> ";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "<i class='fas fa-crown fa-2x c-text-gold' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userAdmin') + "' ></i>" :
                        "<i class='fas fa-user fa-2x c-text-primary' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userTeacher') + "'></i>";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null && element_2.image != "") {
                                div_img += `<img src="${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/no-app-icon.svg?version=VERSIONNUM" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
                        });
                    }

                    let rowDelete = "";
                    if (element.active != "1") {
                        rowDelete = `<button class = "btn c-btn-red btn-sm" data-i18n="manager.buttons.delete" onclick="deleteUser(${element.id})">${i18next.t('manager.buttons.delete')} <i class="fas fa-user-minus"></i></button>`;
                    } else {
                        rowDelete = `<button class = "btn c-btn-red btn-sm" data-i18n="manager.buttons.disable" onclick="disableUser(${element.id})">${i18next.t('manager.buttons.disable')} <i class="fas fa-user-lock"></i></button>`;
                    }

                    let activeFlag = true;
                    if (element.hasOwnProperty('active')) {
                        if (element.active != "1") {
                            activeFlag = false;
                        }
                    }
                    if (activeFlag) {
                        $data_table +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPassword(${element.id})">
                                    <i class="fas fa-redo-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal(${element.id})">
                                    <i class="fas fa-pencil-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                ${rowDelete}
                            </td>
                        </tr>`;
                    } else {
                        $data_table_inactive +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPassword(${element.id})">
                                    <i class="fas fa-redo-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal(${element.id})">
                                    <i class="fas fa-pencil-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                ${rowDelete}
                            </td>
                        </tr>`;
                    }
                }
            });
            $('#table_info_group_data').html($data_table);
            $('#table_info_group_data_inactive').html($data_table_inactive);
            $('[data-toggle="tooltip"]').tooltip()

        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=global_search_user_by_name",
            data: {
                name: $name,
                page: $page,
                userspp: $usersperpage,
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    showGroupsInTable(table) {
        let data_table = "",
            users_sort = $('#sort_users_filter').val(),
            users_per_page = $('#users_per_page').val();

        data_table +=
            `<tr>
                <th scope="row" onclick="showGroupMembers(-1, 1 ,${users_per_page}, ${users_sort})">${i18next.t('manager.group.usersWithoutGroups')}</th>
                <td>${i18next.t('manager.group.usersWithoutGroupsDescription')}</td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
                <td>
                    --
                </td>
            </tr>`;

        table.forEach(element => {
            if (element.hasOwnProperty('currentPage')) {
                mainManager.getmanagerManager()._paginationGroupsInfo = element;
                let sort = $('#sort_groups_filter').val(),
                    groupsperpage = $('#groups_per_page').val(),
                    htmlButtons = "";

                if (element.totalPagesCount > 1) {
                    if (element.previousPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, 1, ${groupsperpage})">First Page</button>`;
                    }
                    if (element.currentPage > 1) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.previousPage}, ${groupsperpage})">${element.previousPage}</button>`;
                    }
                    htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                    if (element.currentPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.nextPage}, ${groupsperpage})">${element.nextPage}</button>`;
                    }
                    if (element.nextPage < element.totalPagesCount) {
                        htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().getAllGroupsInfos(${sort}, ${element.totalPagesCount}, ${groupsperpage})">Last Page - ${element.totalPagesCount}</button>`;
                    }
                }

                $('#paginationButtons_groups').html(htmlButtons);
            } else {
                // Affiche simplement l'id des applcatations pour le moment

                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        if (element_2.image != null && element_2.image != "") {
                            div_img += `<img src="${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        } else {
                            div_img += `<img src="assets/media/no-app-icon.svg?version=VERSIONNUM" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        }
                    });
                }
                data_table +=
                    `<tr>
                <th scope="row" onclick="showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort})">${element.name}</i></th>
                <td>${element.description}</td>
                <td>
                    ${div_img}
                </td>
                <td>
                    ${element.nbUsers}
                </td>
                <td>
                    <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateGroupModal(${element.id})"><i class="fas fa-pencil-alt fa-2x"></i></a>
                </td>
                <td>
                    <a class="c-link-red" href="javascript:void(0)" onclick="deleteGroup(${element.id})"><i class="fas fa-trash-alt fa-2x"></i></a>
                </td>
                </tr>`;
            }
        });
        $('#groups_table_manager').html(data_table);
        $('[data-toggle="tooltip"]').tooltip()
    }

    searchGroup($name, $page, $groupspp) {
        const process = (res) => {
            let data_table = "",
                users_sort = $('#sort_users_filter').val(),
                users_per_page = $('#users_per_page').val();
            res.forEach(element => {
                let App = "";

                if (element.hasOwnProperty('currentPage')) {
                    mainManager.getmanagerManager()._paginationGroupsInfo = element;
                    let sort = $('#sort_groups_filter').val(),
                        groupperpage = $('#groups_per_page').val(),
                        htmlButtons = "";

                    if (element.totalPagesCount > 1) {
                        if (element.previousPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, 1, ${groupperpage})">First Page</button>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.previousPage}, ${groupperpage})">${element.previousPage}</button>`;
                        }
                        htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.nextPage}, ${groupperpage})">${element.nextPage}</button>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainManager.getmanagerManager().searchGroup(${sort}, ${element.totalPagesCount}, ${groupperpage})">Last Page - ${element.totalPagesCount}</button>`;
                        }
                    }
                    $('#paginationButtons_groups').html(htmlButtons);
                } else {
                    // Affiche simplement l'id des applcatations pour le moment
                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null && element_2.image != "") {
                                div_img += `<img src="${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/no-app-icon.svg?version=VERSIONNUM" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
                        });
                    }
                    data_table +=
                        `<tr>
                            <th scope="row" onclick="showGroupMembers(${element.id}, 1 ,${users_per_page}, ${users_sort})">${element.name}</i></th>
                            <td>${element.description}</td>
                            <td>
                                ${div_img}
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateGroupModal(${element.id})"><i class="fas fa-pencil-alt fa-2x"></i></a>
                            </td>
                            <td>
                                <a class="c-link-red" href="javascript:void(0)" onclick="deleteGroup(${element.id})"><i class="fas fa-trash-alt fa-2x"></i></a>
                            </td>
                        </tr>`;
                }
            });
            $('#groups_table_manager').html(data_table);
            $('[data-toggle="tooltip"]').tooltip()

        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=search_group_by_name",
            data: {
                name: $name,
                page: $page,
                groupspp: $groupspp
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    }

    // Send a reset password request by mail to the user
    sendResetPassword($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=superadmin&action=send_request_reset_user_password",
                data: {
                    user_id: $user_id,
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
}

/*     deleteUserFromGroup($group_id, $user_id) {
        const process = (data) => {
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=superadmin&action=delete_user_from_froup",
            data: {
                user_id: $user_id,
                group_id: $group_id
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    } */
