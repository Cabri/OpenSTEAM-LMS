/**
 * managerManager
 * Copyright 2021 Vittascience.
 * https://vittascience.com
 *
 *
 */

/**
 * @class GroupAdminManager
 * @author: COINTE Rémi
 */
class GroupAdminManager {
    /**
     * Creates an instance of GroupAdminManager.
     * @public
     */
    constructor() {
        this._allGroups = []
        this._actualGroup = 0
        this._addedCreateUserGroup = 0
        this._updatedUserGroup = 0
        this._comboGroups = []
        this._paginationUsersInfo = []
        this._paginationGroupsInfo = []
        this._acutalGroupDetails = []
        this._actualUser = []
        this._tasksQueue = [];
        this._isExecutingTaskInQueue = false;
    }

    /**
     * GROUPS FUNCTION
     */

    isGroupAdmin() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=is_user_groupadmin",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }


    getGroupLink(group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=get_group_link",
                data: {
                    group_id: group_id
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

    getGroupUserAdminId() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=get_group_id",
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
    getGroupsUserAdmin() {
        const process = (data) => {
            let data_table = "";
            this._comboGroups = data;
            data.forEach(element => {
                // there is only one group possible
                this._actualGroup = element.id;
                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        if (element_2.image != null) {
                            div_img += `<img src="assets/media/${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        } else {
                            div_img += `<img src="assets/media/nologo.jpg" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                        }
                    });
                }
                data_table +=
                    `<tr>
                        <th scope="row">${element.name}</i></th>
                        <td>${element.description}</td>
                        <td>
                            ${div_img}
                        </td>
                        <td>
                            <a class="c-link-tertiary" href="javascript:void(0)" onclick="getGroupLinkGA(${element.id})" alt="${i18next.t('manager.buttons.show')}">
                                <i class="fas fa-link fa-2x"></i>
                            </a>
                        </td>
                    </tr>`;
                $('#groups_table_groupadmin').html(data_table);
            });
            this.getUsersFromGroup(this._actualGroup, 1);
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=get_all_groups_where_user_is_admin",
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                console.log('error');
            }
        });
    }

    getUsersFromGroup(group_id, page) {
        mainGroupAdmin.getGroupAdminManager()._actualGroup = group_id;

        let sort = $('#sort_users_filter_groupadmin').val(),
            usersPerPage = $('#users_per_page_groupadmin').val();
        const process = (data) => {
            let $data_table = "";
            data.forEach(element => {

                if (element.hasOwnProperty('currentPage')) {
                    let htmlButtons = "";
                    if (element.totalPagesCount > 1) {
                        if (element.previousPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(${group_id}, 1)">First Page</button>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.previousPage})">${element.previousPage}</button>`;
                        }
                        htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.nextPage})">${element.nextPage}</button>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().getUsersFromGroup(${group_id}, ${element.totalPagesCount})">Last Page - ${element.totalPagesCount}</button>`;
                        }
                    }
                    $('#paginationButtons_users_groupadmin').html(htmlButtons);
                } else {
                    let $droits = " <i class='fas fa-question fa-2x' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userNoRights') + "'></i>";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "<i class='fas fa-crown fa-2x c-text-gold' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userAdmin') + "' ></i>" :
                        "<i class='fas fa-user fa-2x c-text-primary' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userTeacher') + "'></i>";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applicationsFromGroups')) {
                        element.applicationsFromGroups.forEach(element_2 => {
                            if (element_2.image != null) {
                                div_img += `<img src="assets/media/${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/nologo.jpg" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
                        });
                    }
                    $data_table +=
                        `<tr>
                        <td>${element.surname}</td>
                        <td>${element.firstname}</td>
                        <td>${$droits}</td>
                        <td>${div_img}</td>
                        <td>
                            <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPasswordga(${element.id})">
                                <i class="fas fa-redo-alt fa-2x"></i>
                            </a>
                        </td>
                        <td>
                            <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal_groupadmin(${element.id})">
                                <i class="fas fa-pencil-alt fa-2x"></i>
                            </a>
                        </td>
                        <td>
                            <button class="btn c-btn-red btn-sm" data-i18n="manager.buttons.delete" onclick="disableUserGroupAdmin(${element.id}, '${element.firstname}')">${i18next.t('manager.buttons.delete')} <i class="fas fa-user-minus"></i></button>
                        </td>
                    </tr>`;
                }
            });
            $('#table_info_group_data_groupadmin').html($data_table);
            $('[data-toggle="tooltip"]').tooltip()
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=get_all_users_in_group",
            data: {
                group_id: group_id,
                sort: sort,
                userspp: usersPerPage,
                page: page
            },
            success: function (response) {
                process(JSON.parse(response));
            },
            error: function () {
                console.log('error');
            }
        });
    }

    globalSearchUser($name, $page, $usersperpage) {
        const process = (res) => {
            mainGroupAdmin.getGroupAdminManager()._allMembersAndTheirGroups = res;
            let $data_table = "";
            res.forEach(element => {
                if (element.hasOwnProperty('currentPage')) {
                    mainGroupAdmin.getGroupAdminManager()._paginationUsersInfo = element;
                    let name = $('#name_user_search_groupadmin').val(),
                        usersperpage = $('#users_per_page_groupadmin').val(),
                        htmlButtons = "";

                    if (element.totalPagesCount > 1) {
                        if (element.previousPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().globalSearchUser(${name}, 1, ${usersperpage})">First Page</button>`;
                        }
                        if (element.currentPage > 1) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().globalSearchUser(${name}, ${element.previousPage}, ${usersperpage})">${element.previousPage}</button>`;
                        }
                        htmlButtons += `<button class="btn btn-primary btn-sm active mx-2">${element.currentPage}</button>`;
                        if (element.currentPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().globalSearchUser(${name}, ${element.nextPage}, ${usersperpage})">${element.nextPage}</button>`;
                        }
                        if (element.nextPage < element.totalPagesCount) {
                            htmlButtons += `<button class="btn btn-primary btn-sm mx-2" onclick="mainGroupAdmin.getGroupAdminManager().globalSearchUser(${name}, ${element.totalPagesCount}, ${usersperpage})">Last Page - ${element.totalPagesCount}</button>`;
                        }
                    }

                    $('#paginationButtons_users_groupadmin').html(htmlButtons);
                } else {
                    let $droits = " <i class='fas fa-question fa-2x' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userNoRights') + "'></i>";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "<i class='fas fa-crown fa-2x c-text-gold' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userAdmin') + "' ></i>" :
                        "<i class='fas fa-user fa-2x c-text-primary' data-toggle='tooltip' data-placement='top' title='" + i18next.t('manager.table.userTeacher') + "'></i>";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applicationsFromGroups')) {
                        element.applicationsFromGroups.forEach(element_2 => {
                            if (element_2.image != null) {
                                div_img += `<img src="assets/media/${element_2.image}" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            } else {
                                div_img += `<img src="assets/media/nologo.jpg" data-toggle="tooltip" alt="${element_2.name}" title="${element_2.name}" style="max-height: 24px;" class="mx-1">`;
                            }
                        });
                    }

                    $data_table +=
                        `<tr>
                            <td>${element.surname}</td>
                            <td>${element.firstname}</td>
                            <td>${$droits}</td>
                            <td>${div_img}</td>
                            <td>
                                <a class="c-link-primary d-inline-block" href="javascript:void(0)" onclick="resetUserPasswordga(${element.id})">
                                <i class="fas fa-redo-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <a class="c-link-secondary" href="javascript:void(0)" onclick="showupdateUserModal_groupadmin(${element.id})">
                                <i class="fas fa-pencil-alt fa-2x"></i>
                                </a>
                            </td>
                            <td>
                                <button class="btn c-btn-red btn-sm" data-i18n="manager.buttons.delete" onclick="disableUserGroupAdmin(${element.id}, '${element.firstname}')">${i18next.t('manager.buttons.delete')} <i class="fas fa-user-minus"></i></button>
                            </td>
                        </tr>`;
                }
            });
            $('#table_info_group_data_groupadmin').html($data_table);
            $('[data-toggle="tooltip"]').tooltip()
        }
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=groupadmin&action=global_search_user_by_name",
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

    /**
     * 
     * @param {String} $firstname 
     * @param {String} $surname 
     * @param {String} $user_pseudo 
     * @param {String} $phone 
     * @param {String} $mail 
     * @param {String} $bio 
     * @param {Array} $groups 
     * @param {Int} $teacher_grade 
     * @param {Int} $teacher_suject 
     * @param {String} $school 
     * @returns {Json}
     */
    createUserAndLinkToGroup($firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $teacher_grade, $teacher_suject, $school) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=create_user",
                data: {
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    grade: parseInt($teacher_grade) + 1,
                    subject: parseInt($teacher_suject) + 1,
                    mail: $mail,
                    school: $school
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

    // Fetch all groups and store them in "_allGroups", then display them in the table
    getAllGroupsInfos($sort, $page, $groupspp) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=panel_groups_info",
                data: {
                    sort: $sort,
                    page: $page,
                    groupspp: $groupspp
                },
                success: function (response) {
                    Mainmanager.getmanagerManager()._allGroups = JSON.parse(response);
                    Mainmanager.getmanagerManager().showGroupsInTable((JSON.parse(response)));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getApplicationsFromGroup($id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=get_all_applications_from_group",
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

    updateGroup($group_id, $group_name, $group_description, $group_app) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=update_group",
                data: {
                    id: $group_id,
                    name: $group_name,
                    description: $group_description,
                    applications: $group_app
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

    disableUser($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=disable_user",
                data: {
                    user_id: $user_id
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
     * Send a password request to the user
     * @param {int} $user_id 
     * @returns 
     */
    sendResetPassword($user_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=send_request_reset_user_password",
                data: {
                    user_id: $user_id,
                },
                success: function (response) {
                    resolve((JSON.parse(response)));
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
                url: "/routing/Routing.php?controller=groupadmin&action=get_user_info_with_his_groups",
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

    updateUser($user_id, $firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $teacher_grade, $teacher_suject, $school, $application) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=update_user",
                data: {
                    user_id: $user_id,
                    groups: JSON.stringify($groups),
                    surname: $surname,
                    firstname: $firstname,
                    pseudo: $user_pseudo,
                    phone: $phone,
                    bio: $bio,
                    grade: parseInt($teacher_grade) + 1,
                    subject: parseInt($teacher_suject) + 1,
                    mail: $mail,
                    school: $school,
                    application:  $application
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

    isGroupFull($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=is_group_full",
                data: {
                    group_id: $group_id
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

    isGroupsApplicationsOutDated($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=is_groups_applications_outdated",
                data: {
                    group_id: $group_id
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

    isUserApplicationsOutDated() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=is_teachers_applications_outdated",
                success: function (response) {
                    resolve(JSON.parse(response));
                },
                error: function () {
                    reject();
                }
            });
        })
    }

    getMonitoringGroup($group_id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=groupadmin&action=group_monitoring",
                data: {
                    group_id: $group_id
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