/**
 * SuperAdminManager
 * Copyright 2021 Vittascience.
 * https://vittascience.com
 *
 *
 * This class purpose to manage the resources.
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
        this._addedCreateUserGroup = 0
        this._updatedUserGroup = 0
        this._comboGroups = []
        this._paginationUsersInfo = []
        this._paginationGroupsInfo = []
        this._actualGroup = []
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

    /**
     * Get actual group informations
     * Access with Main.getSuperAdminManager()._actualGroupInfos
     * @public
     * @returns {Array}
     */
    getGroupsUserAdmin() {
        const process = (data) => {
            let data_table = "";
            mainGroupAdmin.getGroupAdminManager()._comboGroups = data;
            data.forEach(element => {
                let div_img = ""
                if (element.hasOwnProperty('applications')) {
                    element.applications.forEach(element_2 => {
                        if (element_2.image != null) {
                            div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                        } else {
                            div_img += `<img src="assets/media/nologo.jpg" alt="Icône App">`;
                        }
                    });
                }
                data_table +=
                    `<tr>
                        <th scope="row" onclick="showGroupMembersGroupAdmin(${element.id})">${element.name}</i></th>
                        <td>${element.description}</td>
                        <td>
                            ${div_img}
                        </td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="getGroupLinkGA(${element.id})">${i18next.t('superadmin.buttons.show')}</button>
                        </td>
                    </tr>`;
                $('#groups_table_groupadmin').html(data_table);
            });
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
                    let $droits = " -- ";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "Admin" : "Prof";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null) {
                                div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                            } else {
                                div_img += `<img src="assets/media/nologo.jpg" alt="Icône App">`;
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
                            <button class="btn btn-info btn-sm" data-i18n="superadmin.buttons.reset" onclick="resetUserPasswordga(${element.id})">${i18next.t('superadmin.buttons.send')}</button>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateUserModal_groupadmin(${element.id})">${i18next.t('superadmin.buttons.update')}</button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="disableUserGA(${element.id}, '${element.firstname}')">${i18next.t('superadmin.buttons.delete')}</button>
                        </td>
                    </tr>`;
                }
            });
            $('#table_info_group_data_groupadmin').html($data_table);
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
                    let $droits = " -- ";
                    if (element.hasOwnProperty('rights')) {
                        $droits = element.rights === "1" ? "Admin" : "Prof";
                    }

                    let div_img = ""
                    if (element.hasOwnProperty('applications')) {
                        element.applications.forEach(element_2 => {
                            if (element_2.image != null) {
                                div_img += `<img src="assets/media/${element_2.image}" alt="Icône App">`;
                            } else {
                                div_img += `<img src="assets/media/nologo.jpg" alt="Icône App">`;
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
                                <button class="btn btn-info btn-sm" data-i18n="superadmin.buttons.reset" onclick="resetUserPassword(${element.id})">${i18next.t('superadmin.buttons.send')}</button>
                            </td>
                            <td>
                                <button class="btn btn-warning btn-sm" data-i18n="superadmin.buttons.update" onclick="showupdateUserModal_groupadmin(${element.id})">${i18next.t('superadmin.buttons.update')}</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm" data-i18n="superadmin.buttons.delete" onclick="disableUserGA(${element.id}, '${element.firstname}')">${i18next.t('superadmin.buttons.delete')}</button>
                            </td>
                        </tr>`;
                }
            });
            $('#table_info_group_data_groupadmin').html($data_table);
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
                    MainSuperAdmin.getSuperAdminManager()._allGroups = JSON.parse(response);
                    MainSuperAdmin.getSuperAdminManager().showGroupsInTable((JSON.parse(response)));
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

    updateUser($user_id, $firstname, $surname, $user_pseudo, $phone, $mail, $bio, $groups, $teacher_grade, $teacher_suject, $school) {
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
}