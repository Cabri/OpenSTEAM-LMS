const BASE_STUDENT_FORM = `<div class="green-form row col-12">
        
<label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
<input class="col-5 student-form-name" type="text">
</div>`;
const LINK_REGEX = /(\[iframe\].*link=)([a-f0-9]{13})/
const NO_CLASS = "<p class='no-classes'> Vous devez d'abord créer une classe pour pouvoir utiliser cette fonctionalité"
const capitalizedDemoStudentName = `${demoStudentName.charAt().toUpperCase()}${demoStudentName.slice(1)}`
const classroomModals = {
    'import-csv': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `<div class="text-center mx-auto w-100 mh-100 mb-2">
                    <p><span data-i18n="classroom.modals.addStudentByCsv.description"></span><a data-i18n="classroom.modals.addStudentByCsv.csvTemplate" href="${_PATH}assets/media/csv_template.csv"></a> - <a data-i18n="classroom.modals.addStudentByCsv.csvTemplateNoPassword" href="${_PATH}assets/media/csv_template_nopw.csv"></a>.</p>
                    <input type="file" id="importcsv-fileinput" name="importcsvfileinput"/><br>
                    <button class="btn c-btn-secondary mt-2" onclick="importLearnerCsv()">
                        <i class="fas fa-file-csv"></i> 
                        <span data-i18n="classroom.modals.addStudentByCsv.importStudentByCsvButton">Importer les apprenants</span>
                    </button>
                </div>`,
        footer: ``
    },
    'export-csv': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.exportCsv.title'
        },
        content: `
            <div class="text-center mx-auto w-100 mh-100 mb-2">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <p data-i18n="classroom.modals.exportCsv.exportLearnersDescription"></p>
                    <button class="btn c-btn-secondary mt-2" onclick="exportLearnerCsv()">
                        <i class="fa fa-download" aria-hidden="true"></i> 
                        <span data-i18n="classroom.modals.exportCsv.exportLearners">Exporter la liste des apprenants</span>
                    </button>
                    <div class="d-flex justify-content-center modal-separator mt-4 mb-4">
                        <span data-i18n="classroom.modals.addActivity.orSeparator">OU</span>
                    </div>
                    <p data-i18n="classroom.modals.exportCsv.exportDashboardDescription"></p>
                    <button class="btn c-btn-secondary mt-2" onclick="exportDashboardCsv()">
                        <i class="fa fa-download" aria-hidden="true"></i> 
                        <span data-i18n="classroom.modals.exportCsv.exportDashboard">Exporter le tableau de bord</span>
                    </button>
                </div>
            </div>`,
        footer: ``
    },
    'settings-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.settingsTeacher.title'
        },
        content: `<h4 data-i18n="classroom.modals.settingsTeacher.lang">Langue</h4>
        <div id="switch-lang-list" class="d-flex justify-content-center">
            <img class="flags-item mr-2" alt="flag" src="assets/media/flags/fr.png" onclick="changeLang('fr')">
            <img class="flags-item" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
        </div>
        <h4 data-i18n="classroom.modals.settingsTeacher.password">Mot de passe</h4>
        <p class="text-center" data-i18n="classroom.modals.settingsTeacher.passwordDescription"></p>
        <div class="d-flex justify-content-center">
            <div class="pwd-display-stud pwd-display-stud-modal" href="#">
                <input type="password" readonly class="modal-pwd" id="password-display-area"><i class="classroom-clickable fas fa-low-vision ml-2 password-display-toggler"></i>
            </div>
            
            <button class="btn c-btn-secondary" id="pwd-change-modal">Réinitialiser <i class="fas fa-chevron-right"></i></button>`,
        footer: ``
    },
    'settings-teacher-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.settingsTeacher.title'
        },
        /*  <h4>Choisir une image de profil</h4>
                    <input type="checkbox" id="firstletter-teach-setting"><label>Première lettre de mon nom</label></br>
                    <input type="file" id="avatar" name="avatar"accept="image/png, image/jpeg"><label style="margin-left: 1em;font-size: 1em;">Importer une image de profil</label></br>
                          
                    <h4>Notifications mail</h4>
                    <input type="checkbox" id="action-teach-setting" ><label>Je souhaite être informé de toute action dans mes classes</label></br>
                    <input type="checkbox" id="abstract-teach-setting" ><label>Je souhaite recevoir un résumé quotidien</label></br>
                    <input type="checkbox" id="nonotif-teach-setting" ><label>Je ne souhaite pas recevoir de notification par mail</label></br>
                    */
        content: `<div>
                    <h4 data-i18n="classroom.modals.settingsTeacher.lang">Langue</h4>
                    <div id="switch-lang-list" class="d-flex justify-content-center">
                    <img class="flags-item  mr-2" alt="flag" src="assets/media/flags/fr.png" onclick="changeLang('fr')">
                    <img class="flags-item" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
                    </div>
                    <h4 data-i18n="classroom.modals.settingsTeacher.description">Pour modifier votre mot de passe ou d'autres paramètres de votre compte</h4>
                    <div class="d-flex flex-column align-items-center">
                        <button class="btn c-btn-primary" id="teacher-account-button" onclick="openTeacherAccountPanel()">
                            <span data-i18n="classroom.modals.settingsTeacher.accessButton">Accéder à votre profil</span>
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                        <div class="border-1" id="groupAdmin_options" style="display: none;">
                            <p data-i18n="superadmin.profil.onlyVisibleGroupAdmin">Uniquement visible par vous en tant qu'administrateur de groupe :</p>
                            <button class="btn mb-2 c-btn-outline-primary" onclick="switchToGroupAdmin()" id="groupadmin-switch-button" style="display:none;"><span
                                    data-i18n="superadmin.profil.groupAdmin" class="text-span-initial mr-1"></span><i
                                    class="fas fa-cog"></i>
                            </button>
                        </div>
                        <div class="border-1" id="superAdmin_options" style="display: none;">
                            <p data-i18n="superadmin.profil.onlyVisibleSuperAdmin">Uniquement visible par vous en tant que super admin :</p>
                            <button class="btn mb-2 c-btn-outline-primary" onclick="switchToSuperAdmin()" id="superadmin-switch-button" style="display:none;"><span
                                    data-i18n="superadmin.profil.superAdmin" class="text-span-initial mr-1"></span><i
                                    class="fas fa-cog"></i>
                            </button>
                        </div>
                    </div>
                </div>`,
        footer: ``
    },
    'attribute-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'modals.classroom.attributeActivity.title'
        },
        content: `
    <h4>Sélectionner des apprenants</h4>
    <p><span class="student-number">0</span> apprenants sélectionnés</p>
    <div id="list-student-attribute-modal" class="row"></div>
    <button id="attribute-activity-to-students-close" class="btn btn-lg c-btn-secondary">Valider</button>
                `,
        footer: ``
    },
    'list-classes-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.listClass.title'
        },
        content: `
        <p data-i18n="classroom.modals.listClass.description" data-i18n-options={"demoStudent":"${capitalizedDemoStudentName}"}>Vous pouvez tester en toute simplicité l'interface en tant qu'apprenant, et revenir à tout moment à votre profil d'enseignant. La progression en tant qu'apprenant sera sauvegardée sur le compte {{demoStudent}}.</p>
        <div id="list-classes" class=""></div>
        <button class="btn  mb-2 c-btn-primary" id="mode-student-check" onclick="modeApprenant()" > <span class="mr-1" data-i18n="classroom.modals.listClass.switchButton">Passer en mode apprenant</span> <i class="fas fa-cog"></i></button>
                `,
        footer: ``
    },
    'share-project-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'modals.classroom.shareProject.title'
        },
        content: `
    <h4>Sélectionner des apprenants</h4>
    <p><span class="student-number">0</span> apprenants sélectionnés</p>
    <div id="list-student-share-modal" class="row"></div>
    <button id="share-project-to-students-close" class="btn btn-lg c-btn-primary">Valider</button>
                `,
        footer: ``
    },
    'add-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addActivity.title'
        },
        content: `<div class="d-flex flex-column justify-content-center align-items-center">
    <div class="d-flex"><h4 data-i18n="classroom.modals.addActivity.attributeActivity.title">Attribuer une activité en cliquant sur l'icône</h4></div>
    <button class="btn btn-lg c-btn-primary" onclick="goToActivityPanel()"><span data-i18n="classroom.modals.addActivity.attributeActivity.button">Attribuer </span><i class="fas fa-chevron-right"></i></button>
    <div class="d-flex justify-content-center modal-separator mt-4 mb-4"><span data-i18n="classroom.modals.addActivity.orSeparator"></span></div>
    <h4 data-i18n="classroom.modals.addActivity.createActivity.title">Créer une activité puis l'attribuer</h4>
    <button class="btn btn-lg c-btn-secondary" onclick="goToCreateActivityPanel()"><span data-i18n="classroom.modals.addActivity.createActivity.button">Créer une activité </span><i class="fas fa-chevron-right"></i></button>
    </div>
                `,
        footer: ``
    },
    'update-pseudo-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.changePseudo.title'
        },
        content: `
    <h4 data-i18n="classroom.modals.changePseudo.description">Modifier le pseudo</h4>
    <input class="change-pseudo-modal" type="text">
    <button id="update-pseudo-close" class="btn btn-lg c-btn-primary" data-i18n="classroom.modals.changePseudo.validateButton">Valider</button>
                `,
        footer: ``
    },
    'add-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudent.title'
        },
        content: `
        <div id="add-student-div" class=">
        <div class="c-primary-form row col-12">
        
        <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
        <input class="col-5 student-form-name" type="text">
    </div></div>
    <button class="save-student-in-classroom c-btn-primary m-3"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addStudent.addStudentButton">Ajouter l'apprenant</span></button>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="d-flex justify-content-center modal-separator mt-4 mb-4">
            <span data-i18n="classroom.modals.addActivity.orSeparator">OU</span>
        </div>
        <button class="btn c-btn-secondary" onclick="openCsvModal();">
            <span data-i18n="classroom.modals.addStudent.addStudentByCsvButton">Ajouter un fichier d'apprenants (.csv)</span><i class="fas fa-chevron-right ml-1"></i>
        </button>
    </div>`,
        footer: ``
    },
    'superadmin-create-group': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.group.createA'
        },
        content: `  <div class="form-group">
                        <label for="group_name" data-i18n="superadmin.group.name">Group name</label>
                        <input type="text" class="form-control" id="group_name">
                    </div>
                    <div class="form-group">
                        <label for="group_desc" data-i18n="superadmin.group.description">Group description</label>
                        <input type="text" class="form-control" id="group_desc">
                    </div>
                    <label for="group_apps_options" data-i18n="superadmin.group.applications">Application(s) du groupe</label>
                    <div class="form-group" id="group_apps_options">
                    </div>
                    <button class="btn btn-primary" onclick="createGroupWithModal()">Create</button>`,
        footer: ``
    },
    'superadmin-update-group': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.group.updateA'
        },
        content: `  <div class="form-group">
                        <label for="group_name" data-i18n="superadmin.group.name">Group name</label>
                        <input type="text" class="form-control" id="upd_group_name">
                    </div>
                    <div class="form-group">
                        <label for="upd_group_desc" data-i18n="superadmin.group.description">Group description</label>
                        <input type="text" class="form-control" id="upd_group_desc">
                    </div>
                    <div class="form-group">
                        <label for="upd_group_link" data-i18n="superadmin.group.link">Group link</label>
                        <input type="text" class="form-control" id="upd_group_link">
                     </div>
                    <label for="group_upd_apps_options" data-i18n="superadmin.group.applications">Application(s) du groupe</label>
                    <div class="form-group" id="group_upd_apps_options">
                    </div>
                    <input type="hidden" class="form-control" id="upd_group_id">
                    <button class="btn btn-primary" onclick="updateGroupWithModal()" data-i18n="superadmin.buttons.group.update">Update</button>`,
        footer: ``
    },
    'superadmin-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.user.createA'
        },
        content: `<div class="row mt-1">
                <div class="col">
                    <label for="u_firstname" data-i18n="[html]superadmin.profil.firstname">Prénom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="u_firstname">
                </div>
                <div class="col">
                    <label for="u_surname" data-i18n="[html]superadmin.profil.lastname">Nom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="u_surname">
                </div>
                <div class="col">
                    <label for="u_pseudo" data-i18n="[html]superadmin.profil.nickname">Pseudonyme</label>
                    <input type="text" class="form-control" id="u_pseudo">
                </div>
            </div>
            <div class="form-group">
                <div id="regular_options">
                    <div class="row mt-2">
                        <div class="col">
                            <label for="u_mail" data-i18n="[html]superadmin.profil.email">Adresse E-mail <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="u_mail">
                        </div>
                        <div class="col">
                            <label for="u_phone" data-i18n="superadmin.profil.phone">Numéro de telephone</label>
                            <input type="text" class="form-control" id="u_phone">
                        </div>
                    </div>
                    <div class="form-group mt-2">
                        <label for="u_bio" data-i18n="[html]superadmin.profil.bio">Bio <span class="text-danger">*</span></label>
                        <textarea class="form-control" id="u_bio" rows="3"></textarea>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="checkbox" id="u_is_active">
                        <label class="form-check-label" for="u_is_active" data-i18n="superadmin.account.active">
                            Compte actif
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="checkbox" id="u_is_admin">
                        <label class="form-check-label" for="u_is_admin" data-i18n="superadmin.users.admin">
                            Administrateur
                        </label>
                    </div>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <div class="form-check">
                    <input type="checkbox" id="u_is_teacher">
                    <label class="form-check-label" for="u_is_teacher" data-i18n="superadmin.users.teacher">
                        Enseignant
                    </label>
                    <div class="row" id="user_teacher_infos" style="display: none;">
                        <select class="form-control col-5" id="user_teacher_grade">
                            <option selected value="0" data-i18n="superadmin.users.teacherGrades.0">Primaire</option>
                            <option value="1" data-i18n="superadmin.users.teacherGrades.1">Collège</option>
                            <option value="2" data-i18n="superadmin.users.teacherGrades.2">Lycée</option>
                            <option value="3" data-i18n="superadmin.users.teacherGrades.3">Lycée professionel</option>
                            <option value="4" data-i18n="superadmin.users.teacherGrades.4">POST-BAC</option>
                        </select>
                        <select class="form-control col-5" id="user_teacher_subjects">
                        </select>
                        <div class="col-12 my-3">
                            <label for="u_school" data-i18n="[html]superadmin.profil.school">School</label>
                            <input type="text" class="form-control" id="u_school">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <input type="checkbox" id="u_is_group_admin">
                        <label class="form-check-label mx-1" for="u_is_group_admin" data-i18n="superadmin.users.groupAdmin">
                            Administrateur du groupe
                        </label>
                    </div>
                </div>
                <select class="form-control" id="u_group">
                </select>
                <button class="btn btn-sm btn-info ml-1" onclick="addGroupSuperAdmin()" id="add_group_superadmin" data-i18n="superadmin.buttons.user.addGroup">Ajouter un
                    groupe</button>
            </div>
            <div id="group_add_sa">
            </div>
            
            <button class="btn btn-primary" onclick="createUserAndLinkToGroup()" data-i18n="superadmin.buttons.user.create">Create user</button>`,
        footer: ``
    },
    'superadmin-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.user.updateA'
        },
        content: `<div class="row mt-1">
        <input type="hidden" class="form-control" id="update_u_id">
        <div class="col">
            <label for="update_u_firstname" data-i18n="[html]superadmin.profil.firstname">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_firstname">
        </div>
        <div class="col">
            <label for="update_u_surname" data-i18n="[html]superadmin.profil.lastname">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="update_u_surname">
        </div>
        <div class="col">
            <label for="update_u_pseudo" data-i18n="[html]superadmin.profil.nickname">Pseudonyme</label>
            <input type="text" class="form-control" id="update_u_pseudo">
        </div>
    </div>
    <div class="form-group">
        <div id="update_regular_options">
            <div class="row mt-2">
                <div class="col">
                    <label for="update_u_mail" data-i18n="[html]superadmin.profil.email">Adresse E-mail <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="update_u_mail">
                </div>
                <div class="col">
                    <label for="update_u_phone" data-i18n="superadmin.profil.phone">Numéro de telephone</label>
                    <input type="text" class="form-control" id="update_u_phone">
                </div>
            </div>
            <div class="form-group mt-2">
                <label for="update_u_bio" data-i18n="[html]superadmin.profil.bio">Bio <span class="text-danger">*</span></label>
                <textarea class="form-control" id="update_u_bio" rows="3"></textarea>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="update_u_is_active">
                <label class="form-check-label" for="update_u_is_active" data-i18n="superadmin.account.active">
                    Compte actif
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input type="checkbox" id="update_u_is_admin">
                <label class="form-check-label" for="update_u_is_admin" data-i18n="superadmin.users.admin">
                    Administrateur
                </label>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="form-check">
            <input type="checkbox" id="update_u_is_teacher">
            <label class="form-check-label" for="update_u_is_teacher">
                Enseignant
            </label>
            <div class="row" id="update_user_teacher_infos" style="display: none;">
                <select class="form-control col-5" id="update_user_teacher_grade">
                    <option selected value="0" data-i18n="superadmin.users.teacherGrades.0">Primaire</option>
                    <option value="1" data-i18n="superadmin.users.teacherGrades.1">Collège</option>
                    <option value="2" data-i18n="superadmin.users.teacherGrades.2">Lycée</option>
                    <option value="3" data-i18n="superadmin.users.teacherGrades.3">Lycée professionel</option>
                    <option value="4" data-i18n="superadmin.users.teacherGrades.4">POST-BAC</option>
                </select>
                <select class="form-control col-5" id="update_user_teacher_subjects">
                </select>
                <div class="col-12 my-3">
                    <label for="update_u_school" data-i18n="[html]superadmin.profil.school">School</label>
                    <input type="text" class="form-control" id="update_u_school">
                </div>
            </div>
        </div>
    </div>
    <hr>
    <div id="update_actualgroup_sa">
    </div>
    
    <button class="btn btn-sm btn-info" onclick="updateAddGroupSuperAdmin()" id="update_add_group_superadmin" data-i18n="superadmin.buttons.user.addGroup">Ajouter un
        groupe</button>
        
    <button class="btn btn-sm btn-info" onclick="updateAppForUser()" id="update_app_user" data-i18n="superadmin.buttons.user.updateApp">Modifier les applications</button>
    
    <button class="btn btn-info" onclick="updateUserModal()" data-i18n="superadmin.buttons.user.update">Update user</button>`,
        footer: ``
    },
    'groupeadmin-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.user.createA'
        },
        content: `<div class="row mt-1">
                <div class="col">
                    <label for="u_firstname_ga" data-i18n="[html]superadmin.profil.firstname">Prénom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="u_firstname_ga">
                </div>
                <div class="col">
                    <label for="u_surname_ga" data-i18n="[html]superadmin.profil.lastname">Nom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="u_surname_ga">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <label for="u_mail_ga" data-i18n="[html]superadmin.profil.email">Adresse E-mail <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="u_mail_ga">
                </div>
                <div class="col">
                    <label for="u_phone_ga" data-i18n="superadmin.profil.phone">Numéro de telephone</label>
                    <input type="text" class="form-control" id="u_phone_ga">
                </div>
                <div class="col">
                    <label for="u_pseudo_ga" data-i18n="[html]superadmin.profil.nickname">Pseudonyme</label>
                    <input type="text" class="form-control" id="u_pseudo_ga">
                </div>
            </div>
            <div class="form-group mt-2">
                <label for="u_bio_ga" data-i18n="[html]superadmin.profil.bio">Bio <span class="text-danger">*</span></label>
                <textarea class="form-control" id="u_bio_ga" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <div class="form-check">
                    <div class="row" id="user_teacher_infos_ga">
                        <div class="col">
                            <label for="user_teacher_grade_ga" data-i18n="[html]superadmin.profil.grade">Grade <span class="text-danger">*</span></label>
                            <select class="form-control col-5" id="user_teacher_grade_ga">
                                <option selected value="0" data-i18n="superadmin.users.teacherGrades.0">Primaire</option>
                                <option value="1" data-i18n="superadmin.users.teacherGrades.1">Collège</option>
                                <option value="2" data-i18n="superadmin.users.teacherGrades.2">Lycée</option>
                                <option value="3" data-i18n="superadmin.users.teacherGrades.3">Lycée professionel</option>
                                <option value="4" data-i18n="superadmin.users.teacherGrades.4">POST-BAC</option>
                            </select>
                            </div>
                        <div class="col">
                            <label for="user_teacher_subjects_ga" data-i18n="[html]superadmin.profil.subject">Subject <span class="text-danger">*</span></label>
                            <select class="form-control col-5" id="user_teacher_subjects_ga">
                            </select>
                        </div>
                        <div class="col-12 my-3">
                            <label for="u_school" data-i18n="[html]superadmin.profil.school">School</label>
                            <input type="text" class="form-control" id="u_school_ga">
                        </div>
                    </div> 
                </div>
            </div>
            
            <div class="row">
                <legend class="col-form-label col-sm-2 pt-0">Groupes</legend>
                <div class="col-sm-10" id="allGroupsGA">
                    
                </div>
            </div>
            <label class="form-check-label mx-2" for="checkboxAdmin" data-i18n="superadmin.users.groupAdmin"> Administateur du groupe </label>
            <input type="checkbox" id="checkboxAdmin">
    
    <button class="btn btn-primary" onclick="createUserAndLinkToGroup_groupAdmin()" data-i18n="superadmin.buttons.user.create">Create user</button>`,
        footer: ``
    },
    'groupadmin-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.buttons.user.updateA'
        },
        content: `<div class="row mt-1">
                    <input type="hidden" class="form-control" id="update_u_id_ga">
                    <div class="col">
                        <label for="update_u_firstname_ga" data-i18n="[html]superadmin.profil.firstname">Prénom <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="update_u_firstname_ga">
                    </div>
                    <div class="col">
                        <label for="update_u_surname_ga" data-i18n="[html]superadmin.profil.lastname">Nom <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="update_u_surname_ga">
                    </div>
                    <div class="col">
                        <label for="update_u_pseudo_ga" data-i18n="[html]superadmin.profil.nickname">Pseudonyme</label>
                        <input type="text" class="form-control" id="update_u_pseudo_ga">
                    </div>
                </div>
                <div class="form-group">
                    <div id="update_regular_options_ga">
                        <div class="row mt-2">
                            <div class="col">
                                <label for="update_u_mail_ga" data-i18n="[html]superadmin.profil.email">Adresse E-mail <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="update_u_mail_ga">
                            </div>
                            <div class="col">
                                <label for="update_u_phone_ga" data-i18n="superadmin.profil.phone">Numéro de telephone</label>
                                <input type="text" class="form-control" id="update_u_phone_ga">
                            </div>
                        </div>
                        <div class="form-group mt-2">
                            <label for="update_u_bio_ga" data-i18n="[html]superadmin.profil.bio">Bio <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="update_u_bio_ga" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <div class="row" id="update_user_teacher_infos_ga">
                            <select class="form-control col-5" id="update_user_teacher_grade_ga">
                                <option selected value="0" data-i18n="superadmin.users.teacherGrades.0">Primaire</option>
                                <option value="1" data-i18n="superadmin.users.teacherGrades.1">Collège</option>
                                <option value="2" data-i18n="superadmin.users.teacherGrades.2">Lycée</option>
                                <option value="3" data-i18n="superadmin.users.teacherGrades.3">Lycée professionel</option>
                                <option value="4" data-i18n="superadmin.users.teacherGrades.4">POST-BAC</option>
                            </select>
                            <select class="form-control col-5" id="update_user_teacher_subjects_ga">
                            </select>
                            <div class="col-12 my-3">
                                <label for="update_u_school" data-i18n="[html]superadmin.profil.school">School</label>
                                <input type="text" class="form-control" id="update_u_school_ga">
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div id="update_actualgroup_ga">
                </div>
                
                <button class="btn btn-info" onclick="updateUserModalGroupAdmin()" data-i18n="superadmin.buttons.user.update">Update user</button>`,
        footer: ``
    },
    'groupadmin-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUserGA" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="superadmin.users.deleteConfirmationTitle"></h3>
                            <p data-i18n="[html]superadmin.users.disable.intention" class="text-center"></p>
                            <p data-i18n="superadmin.users.disable.message" class="text-center"></p>.
                            <input type="text" name="validation_deleteGA" id="validation_deleteGA" data-i18n="[placeholder]superadmin.input.placeholder.delete" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDeleteGroupAdmin()" data-i18n="superadmin.buttons.cancel">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDeleteGroupAdmin()" data-i18n="superadmin.buttons.validate">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="superadmin.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="[html]superadmin.users.deleteIntentionSA">Vous vous apprêtez à supprimer l'utilisateur : <span id="mdi_firstnameSA"></span></p>
                            <p class="text-center" data-i18n="superadmin.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_delete" id="validation_delete" data-i18n="[placeholder]superadmin.input.placeholder.delete" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDelete()" data-i18n="superadmin.buttons.cancel">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDelete()" data-i18n="superadmin.buttons.validate">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-disable-user': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="superadmin.users.disableConfirmationTitle">Confirmer la désactivation</h3>
                            <p class="text-center" data-i18n="[html]superadmin.users.disableIntention">Vous vous apprêtez à désactiver l'utilisateur : <span id="mde_firstnameSA"></span></p>
                            <p class="text-center" data-i18n="superadmin.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_disable" id="validation_disable" data-i18n="[placeholder]superadmin.input.placeholder.delete" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDisable()" data-i18n="superadmin.buttons.cancel">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDisable()" data-i18n="superadmin.buttons.validate">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-delete-group': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.group.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteGroup" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="superadmin.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="[html]superadmin.group.deleteIntention">Vous vous apprêtez à suppression le groupe : <span id="md_group"></span></p>
                            <p class="text-center" data-i18n="superadmin.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>.
                            <input type="text" name="validation_delete_group" id="validation_delete_group" data-i18n="[placeholder]superadmin.input.placeholder.delete" placeholder="supprimer">
                            <button class="btn btn-info mx-auto mt-3 btn-lg" onclick="cancelDeleteGroup()" data-i18n="superadmin.buttons.cancel">Annuler</button>
                            <button class="btn btn-danger mx-auto mt-3 btn-lg" onclick="persistDeleteGroup()" data-i18n="superadmin.buttons.validate">Valider</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-show-resetlink': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.showResetLinkTitle'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <h3 class="font-weight-bold text-info m-auto text-center my-3" data-i18n="superadmin.users.showResetLink">Lien de réinitialisation de mot de passe</h3>
                            <div class="row">
                                    <input type="text" class="form-control col-10" id="passwordLink">
                                    <button class="btn btn-primary mx-1 btn-lg col" onclick="copyLink('#passwordLink')" data-i18n="superadmin.buttons.copyLink">Copy the link</button>
                            </div>
                            <div class="row">
                                <button class="btn btn-info mx-auto mt-3 btn" onclick="dismissModal()" data-i18n="superadmin.buttons.close">Fermer</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'superadmin-user-updateApp': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.users.updateApp'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <h3 class="font-weight-bold text-info m-auto text-center my-3" data-i18n="superadmin.users.updateAppUser">Modifier les applications de l'utilisateur</h3>
                            <div class="row">
                                <div class="form-group" id="user_apps_update">
                                </div>
                            </div>
                            <div class="row">
                                <button class="btn btn-info mx-auto mt-3 btn" onclick="dismissModal()" data-i18n="superadmin.buttons.cancel">Annuler</button>
                                <button class="btn btn-info mx-auto mt-3 btn" onclick="persistUpdateUserApp()" data-i18n="superadmin.buttons.save">Enregistrer</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'groupadmin-show-grouplink': {
        selector: '',
        header: {
            icon: '',
            title: 'superadmin.group.showLinkTitle'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <h3 class="font-weight-bold text-info m-auto text-center my-3" data-i18n="superadmin.group.showLinkTitle">Lien du groupe</h3>
                            <div class="row">
                                    <input type="text" class="form-control col-10" id="groupLink">
                                    <button class="btn btn-primary mx-1 btn-lg col" onclick="copyLink('#groupLink')" data-i18n="superadmin.buttons.copyLink">Copy the link</button>
                            </div>
                            <div class="row">
                                <button class="btn btn-info mx-auto mt-3 btn" onclick="dismissModal()" data-i18n="superadmin.buttons.close">Fermer</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'add-activity-name': {
      selector: '',
      header: {
        icon: '',
        title: 'classroom.modals.addActivity.title'
      },
      content: `
          <div class="col-12">
            <div class="row">
                <label for="part-content-input" class="tutorial-label">
                    <span data-i18n="classroom.activities.form.title.label">Titre de l'activité</span>
                </label>


                 <input data-i18n="[placeholder]classroom.activities.form.title.placeholder" type="text" id="activity-lti-form-title"
                 class="form-control part-title-input">
            </div>

         <div class="row">
<!--              <label for="activity-form-content" class="tutorial-label">-->
<!--                  <span data-i18n='classroom.activities.form.content.label'></span>-->
<!--              </label>-->
<!--              <textarea id="activity-form-content" class="form-control" name="part-content-input" rows="3"></textarea>-->
          </div>

          <div class="row  justify-content-md-center"">
                <button class="save-student-in-classroom c-btn-primary m-3" onclick="startActivityCreation()"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addActivity.continue"></span></button>
          </div>
      `,
      footer: ``
    },
}
