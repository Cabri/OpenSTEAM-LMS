const BASE_STUDENT_FORM = `<div class="c-primary-form row col-12">
        
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
            <img class="flags-item mr-2" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
            <img class="flags-item mr-2" alt="flag" src="assets/media/flags/es.png" onclick="changeLang('es')">
            <img class="flags-item mr-2" alt="flag" src="assets/media/flags/it.png" onclick="changeLang('it')">
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
                    <img class="flags-item mr-2" alt="flag" src="assets/media/flags/fr.png" onclick="changeLang('fr')">
                    <img class="flags-item mr-2" alt="flag" src="assets/media/flags/en.png" onclick="changeLang('en')">
                    <img class="flags-item mr-2" alt="flag" src="assets/media/flags/es.png" onclick="changeLang('es')">
                    <img class="flags-item mr-2" alt="flag" src="assets/media/flags/it.png" onclick="changeLang('it')">
                    </div>
                    <h4 data-i18n="classroom.modals.settingsTeacher.description">Pour modifier votre mot de passe ou d'autres paramètres de votre compte</h4>
                    <div class="d-flex flex-column align-items-center" style="gap: 0.5rem;">
                        <button class="btn c-btn-primary" id="teacher-account-button" onclick="openTeacherAccountPanel()" data-i18n="classroom.modals.settingsTeacher.accessButton">
                            Accéder à votre profil
                        </button>

                        <div class="border-1" id="groupAdmin_options" style="display: none;">
                        <fieldset class="switch-to-admin">
                            <legend>
                                <i class="fas fa-eye"></i>
                                <span data-i18n="manager.profil.onlyVisibleGroupAdmin">Uniquement visible par vous en tant qu'administrateur de groupe :</span>
                            </legend>
                            <button class="theme-group-admin btn mb-2 c-btn-outline-primary c-btn-dashboard" onclick="switchToGroupAdmin()" id="groupadmin-switch-button" style="display:none;"><span
                                    data-i18n="manager.profil.groupAdmin" class="text-span-initial mr-1"></span>
                                    <i class="fas fa-chevron-right"></i>
                            </button>
                            </fieldset>

                        </div>

                        <div class="border-1" id="manager_options" style="display: none;">
                            <fieldset class="switch-to-admin ">
                                    <legend>
                                        <i class="fas fa-eye"></i>
                                        <span data-i18n="manager.profil.onlyVisiblemanager">Uniquement visible par vous en tant que super admin :</span>
                                    </legend>
                                    <button class="theme-super-admin btn mb-2 c-btn-outline-primary c-btn-dashboard" onclick="switchTomanager()" id="manager-switch-button" style="display:none;">
                                        <span data-i18n="manager.profil.manager" class="text-span-initial mr-1"></span>
                                        <i class="fas fa-chevron-right"></i>
                                </button>
                            </fieldset>
                        </div>
                    </div>
                </div>`,
        footer: ``
    },
    'attribute-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.attributeActivity.title'
        },
        content: `
    <h4 class="c-text-primary font-weight-bold text-uppercase">Sélectionner des apprenants</h4>
    <p class='text-center'><span class="student-number">0</span> apprenants sélectionnés</p>
    <div id="list-student-attribute-modal" class="row justify-content-center c-primary-form"></div>
    <button id="attribute-activity-to-students-close" class="btn btn-lg c-btn-primary">Valider</button>
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
        <div id="add-student-div">
            <div class="c-primary-form row col-12">
                <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
                <input class="col-5 student-form-name" type="text">
            </div>
        </div>
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
    'manager-create-group': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.group.createA'
        },
        content: ` <div class="form-group c-secondary-form">
                        <label for="group_name" data-i18n="[html]manager.group.name">Group name</label>
                        <input type="text" class="form-control m-0" id="group_name" data-i18n="[placeholder]manager.group.academy">
                    </div>
                    <div class="form-group c-secondary-form">
                        <label for="group_desc" data-i18n="[html]manager.group.description">Group description</label>
                        <textarea rows="2" class="form-control m-0" id="group_desc"></textarea>
                    </div>
                    <label for="group_apps_options" data-i18n="manager.group.applications">Application(s) du groupe</label>
                    <div class="form-group" id="group_apps_options">
                    </div>
                    <button class="btn c-btn-secondary" data-i18n="manager.buttons.group.create" onclick="createGroupWithModal()">Create</button>`,
        footer: ``
    },
    'manager-update-group': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.group.updateA'
        },
        content: `  <div class="form-group c-secondary-form">
                        <label for="group_name" data-i18n="[html]manager.group.name">Group name</label>
                        <input type="text" class="form-control" id="upd_group_name" data-i18n="[placeholder]manager.group.academy">
                    </div>
                    <div class="form-group c-secondary-form">
                        <label for="upd_group_desc" data-i18n="[html]manager.group.description">Group description<span class="c-text-red">*</span></label>
                        <textarea rows="2" class="form-control" id="upd_group_desc"></textarea>
                    </div>
                    <div class="form-group c-secondary-form">
                        <label for="upd_group_link" data-i18n="manager.group.link">Group link</label>
                        <input type="text" class="form-control" id="upd_group_link">
                     </div>
                    <label for="group_upd_apps_options" data-i18n="manager.group.applications">Application(s) du groupe</label>
                    <div class="form-group" id="group_upd_apps_options">
                    </div>
                    <input type="hidden" class="form-control" id="upd_group_id">
                    <button class="btn c-btn-secondary" onclick="updateGroupWithModal()" data-i18n="manager.buttons.group.update">Update</button>`,
        footer: ``
    },
    'manager-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.user.createA'
        },
        content: `<div class="container-fluid">

        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="u_firstname" data-i18n="[html]manager.profil.firstname">Prénom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="u_firstname">
            </div>
            <div class="form-group col-md">
                <label for="u_surname" data-i18n="[html]manager.profil.lastname">Nom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="u_surname">
            </div>
            <div class="form-group col-md" id="manager_username">
                <label for="u_pseudo" data-i18n="[html]manager.profil.nickname">Pseudonyme</label>
                <input type="text" class="form-control" id="u_pseudo">
            </div>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="u_mail" data-i18n="[html]manager.profil.email">Adresse E-mail <span class="c-text-red">*</span></label>
                <input type="email" class="form-control" id="u_mail">
            </div>
            <div class="form-group col-md" id="manager_phone">
                <label for="u_phone" data-i18n="manager.profil.phone">Numéro de telephone</label>
                <input type="text" class="form-control" id="u_phone">
            </div>
        </div>
    
        <div class="form-row c-secondary-form mb-2" id="manager_bio">
            <label for="u_bio" data-i18n="[html]manager.profil.bio">Bio <span class="c-text-red">*</span></label>
            <textarea class="form-control" id="u_bio" rows="3"></textarea>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="u_is_admin">
                <label class="form-check-label" for="u_is_admin" data-i18n="manager.users.admin">
                    Administrateur
                </label>
            </div>
        </div>

        <div class="form-row form-group c-secondary-form">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="u_is_teacher">
                <label class="form-check-label" for="u_is_teacher" data-i18n="manager.users.teacher">
                    Enseignant
                </label>
            </div>
        </div>
    
        <div class="form-row c-secondary-form" id="user_teacher_infos" style="display: none;" >
            <div class="form-group col-md" id="section_teacher_grade">
                <select class="form-control" id="user_teacher_grade">
                    <option selected value="0" data-i18n="manager.users.teacherGrades.0">Primaire</option>
                    <option value="1" data-i18n="manager.users.teacherGrades.1">Collège</option>
                    <option value="2" data-i18n="manager.users.teacherGrades.2">Lycée</option>
                    <option value="3" data-i18n="manager.users.teacherGrades.3">Lycée professionel</option>
                    <option value="4" data-i18n="manager.users.teacherGrades.4">POST-BAC</option>
                </select>
            </div>
            <div class="form-group col-md" id="section_teacher_subjects">
                <select class="form-control" id="user_teacher_subjects">
                </select>
            </div>
            <div class="form-group col-md-12" id="section_teacher_school">
                <label for="u_school" data-i18n="[html]manager.profil.school">School</label>
                <input type="text" class="form-control" id="u_school">
            </div>
        </div>
    
    </div>

    <hr>

    <div class="form-group c-secondary-form">
        <label for="u_group" data-i18n="manager.profil.group">Groupe</label>
        <div class="input-group mb-3">
            <select class="form-control" id="u_group">
            </select>
            <div class="input-group-append">
                <div class="input-group-text pl-5">
                    <input class="form-check-input" type="checkbox" id="u_is_group_admin">
                    <label class="form-check-label" for="u_is_group_admin" data-i18n="manager.users.groupAdmin">
                        Administrateur du groupe
                    </label>
                </div>
            </div>

        </div>

    </div>

    <div id="group_add_sa">
    </div>
    
    <div id="create_update_personal_apps_sa">

    </div>

    <button class="btn c-btn-secondary" onclick="createUserAndLinkToGroup()" data-i18n="manager.buttons.user.create">Create user</button>
    </div>`,
        footer: ``
    },
    'manager-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.user.updateA'
        },
        content: `<div class="container-fluid">
        <input type="hidden" class="form-control" id="update_u_id">
        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="update_u_firstname" data-i18n="[html]manager.profil.firstname">Prénom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="update_u_firstname">
            </div>
            <div class="form-group col-md">
                <label for="update_u_surname" data-i18n="[html]manager.profil.lastname">Nom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="update_u_surname">
            </div>
            <div class="form-group col-md" id="manager_update_username">
                <label for="update_u_pseudo" data-i18n="[html]manager.profil.nickname">Pseudonyme</label>
                <input type="text" class="form-control" id="update_u_pseudo">
            </div>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="update_u_mail" data-i18n="[html]manager.profil.email">Adresse E-mail <span class="c-text-red">*</span></label>
                <input type="email" class="form-control" id="update_u_mail">
            </div>
            <div class="form-group col-md" id="manager_update_phone">
                <label for="update_u_phone" data-i18n="manager.profil.phone">Numéro de telephone</label>
                <input type="text" class="form-control" id="update_u_phone">
            </div>
        </div>
    
        <div class="form-row c-secondary-form mb-2" id="manager_update_bio">
            <label for="update_u_bio" data-i18n="[html]manager.profil.bio">Bio <span class="c-text-red">*</span></label>
            <textarea class="form-control" id="update_u_bio" rows="3"></textarea>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-check form-check-inline">
                <input type="checkbox" id="update_u_is_active">
                <label class="form-check-label" for="update_u_is_active" data-i18n="manager.account.active">
                    Compte actif
                </label>
            </div>

            <div class="form-check form-check-inline ml-3">
                <input type="checkbox" id="update_u_is_admin">
                <label class="form-check-label" for="update_u_is_admin" data-i18n="manager.users.admin">
                    Administrateur
                </label>
            </div>
        </div>

        <div class="form-row form-group c-secondary-form">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="update_u_is_teacher">
                <label class="form-check-label" for="update_u_is_teacher" data-i18n="manager.users.teacher">
                    Enseignant
                </label>
            </div>
        </div>

        <div class="form-row c-secondary-form" id="update_user_teacher_infos" style="display: none;">
            <div class="form-group col-md" id="section_teacher_update_grade">
                <select class="form-control" id="update_user_teacher_grade">
                    <option selected value="0" data-i18n="manager.users.teacherGrades.0">Primaire</option>
                    <option value="1" data-i18n="manager.users.teacherGrades.1">Collège</option>
                    <option value="2" data-i18n="manager.users.teacherGrades.2">Lycée</option>
                    <option value="3" data-i18n="manager.users.teacherGrades.3">Lycée professionel</option>
                    <option value="4" data-i18n="manager.users.teacherGrades.4">POST-BAC</option>
                </select>
            </div>
            <div class="form-group col-md" id="section_teacher_update_subjects">
                <select class="form-control" id="update_user_teacher_subjects">
                </select>
            </div>
            <div class="form-group col-md-12" id="section_teacher_update_school">
                <label for="update_u_school" data-i18n="[html]manager.profil.school">School</label>
                <input type="text" class="form-control" id="update_u_school">
            </div>
        </div>


        <hr>

        <div id="update_actualgroup_sa">
        </div>

        <hr>

        <div id="update_applications_sa">
        </div>

        <hr>

        <div id="update_personal_apps_sa">

        </div>
    </div>

    <button class="btn c-btn-secondary" onclick="updateUserModal()" data-i18n="manager.buttons.user.update">Update user</button>`,
        footer: ``
    },
    'groupeadmin-create-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.user.createA'
        },
        content: `<div class="container-fluid">
        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="u_firstname_ga" data-i18n="[html]manager.profil.firstname">Prénom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="u_firstname_ga">
            </div>
            <div class="form-group col-md">
                <label for="u_surname_ga" data-i18n="[html]manager.profil.lastname">Nom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="u_surname_ga">
            </div>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="u_mail_ga" data-i18n="[html]manager.profil.email">Adresse E-mail <span class="c-text-red">*</span></label>
                <input type="email" class="form-control" id="u_mail_ga">
            </div>
            <div class="form-group col-md" id="group_admin_phone">
                <label for="u_phone_ga" data-i18n="manager.profil.phone">Numéro de telephone</label>
                <input type="text" class="form-control" id="u_phone_ga">
            </div>
            <div class="form-group col-md" id="group_admin_username">
                <label for="u_pseudo_ga" data-i18n="[html]manager.profil.nickname">Pseudonyme</label>
                <input type="text" class="form-control" id="u_pseudo_ga">
            </div>
        </div>
    
        <div class="form-group c-secondary-form" id="group_admin_bio">
            <label for="u_bio_ga" data-i18n="[html]manager.profil.bio">Bio <span class="c-text-red">*</span></label>
            <textarea class="form-control" id="u_bio_ga" rows="3"></textarea>
        </div>

        <div class="form-row c-secondary-form" id="user_teacher_infos_ga">
            <div class="form-group col-md" id="section_teacher_grade_ga">
                <label for="user_teacher_grade_ga" data-i18n="[html]manager.profil.grade">Grade <span class="c-text-red">*</span></label>
                <select class="form-control" id="user_teacher_grade_ga">
                    <option selected value="0" data-i18n="manager.users.teacherGrades.0">Primaire</option>
                    <option value="1" data-i18n="manager.users.teacherGrades.1">Collège</option>
                    <option value="2" data-i18n="manager.users.teacherGrades.2">Lycée</option>
                    <option value="3" data-i18n="manager.users.teacherGrades.3">Lycée professionel</option>
                    <option value="4" data-i18n="manager.users.teacherGrades.4">POST-BAC</option>
                </select>
            </div>
            <div class="form-group col-md" id="section_teacher_subjects_ga">
                <label for="user_teacher_subjects_ga" data-i18n="[html]manager.profil.subject">Subject <span class="c-text-red">*</span></label>
                <select class="form-control" id="user_teacher_subjects_ga">
                </select>
            </div>
            <div class="form-group col-md-12" id="section_teacher_school_ga">
                <label for="u_school" data-i18n="[html]manager.profil.school">School</label>
                <input type="text" class="form-control" id="u_school_ga">
            </div>
    
        </div>
        <div class="form-group col-md-12" id="allGroupsGA">
        </div>
    </div>

    <button class="btn c-btn-secondary" onclick="createUserAndLinkToGroup_groupAdmin()" data-i18n="manager.buttons.user.create">Create user</button>`,
        footer: ``
    },
    'groupadmin-update-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.buttons.user.updateA'
        },
        content: `<div class="container-fluid">
        <input type="hidden" class="form-control" id="update_u_id_ga">
        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="update_u_firstname_ga" data-i18n="[html]manager.profil.firstname">Prénom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="update_u_firstname_ga">
            </div>
            <div class="form-group col-md">
                <label for="update_u_surname_ga" data-i18n="[html]manager.profil.lastname">Nom <span class="c-text-red">*</span></label>
                <input type="text" class="form-control" id="update_u_surname_ga">
            </div>
            <div class="form-group col-md" id="group_admin_username_update">
                <label for="update_u_pseudo_ga" data-i18n="[html]manager.profil.nickname" >Pseudonyme</label>
                <input type="text" class="form-control" id="update_u_pseudo_ga">
            </div>
        </div>

        <div class="form-row c-secondary-form">
            <div class="form-group col-md">
                <label for="update_u_mail_ga" data-i18n="[html]manager.profil.email">Adresse E-mail <span class="c-text-red">*</span></label>
                <input type="email" class="form-control" id="update_u_mail_ga">
            </div>
            <div class="form-group col-md" id="group_admin_phone_update">
                <label for="update_u_phone_ga" data-i18n="manager.profil.phone">Numéro de telephone</label>
                <input type="text" class="form-control" id="update_u_phone_ga">
            </div>
        </div>
    
        <div class="form-group c-secondary-form mb-2" id="group_admin_bio_update">
            <label for="update_u_bio_ga" data-i18n="[html]manager.profil.bio">Bio <span class="c-text-red">*</span></label>
            <textarea class="form-control" id="update_u_bio_ga" rows="3"></textarea>
        </div>

        <div class="form-row c-secondary-form" id="update_user_teacher_infos_ga">
            <div class="form-group col-md" id="section_teacher_grade_update_ga">
                <select class="form-control" id="update_user_teacher_grade_ga">
                    <option selected value="0" data-i18n="manager.users.teacherGrades.0">Primaire</option>
                    <option value="1" data-i18n="manager.users.teacherGrades.1">Collège</option>
                    <option value="2" data-i18n="manager.users.teacherGrades.2">Lycée</option>
                    <option value="3" data-i18n="manager.users.teacherGrades.3">Lycée professionel</option>
                    <option value="4" data-i18n="manager.users.teacherGrades.4">POST-BAC</option>
                </select>
            </div>
            <div class="form-group col-md" id="section_teacher_subjects_update_ga">
                <select class="form-control" id="update_user_teacher_subjects_ga">
                </select>
            </div>
            <div class="form-group col-md-12" id="section_teacher_school_update_ga">
                <label for="update_u_school" data-i18n="[html]manager.profil.school">School</label>
                <input type="text" class="form-control" id="update_u_school_ga">
            </div>
        </div>

        <hr>

        <div id="update_actualgroup_ga">
        </div>

        <hr>
    
        <div id="update_applications_ga">
        </div>
    </div>

    <button class="btn c-btn-secondary" onclick="updateUserModalGroupAdmin()" data-i18n="manager.buttons.user.update">Update user</button>`,
        footer: ``
    },
    'groupadmin-disable-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUserGA" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="manager.users.disableConfirmationTitle">Confirmer la désactivation</h3>
                            <p class="text-center" data-i18n="[html]manager.users.disableIntention">Vous vous apprêtez à désactiver l'utilisateur : <span id="mde_firstnameSA"></span></p>
                            <div class="text-center c-secondary-form">
                                <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                                <input type="text" name="validation_disableGroupAdmin" id="validation_disableGroupAdmin" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDisableGroupAdmin()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDisableGroupAdmin()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'groupadmin-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUserGA" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="manager.users.deleteConfirmationTitle"></h3>
                            <p data-i18n="[html]manager.users.disable.intention" class="text-center"></p>
                            <div class="text-center c-secondary-form">

                                <p data-i18n="manager.users.disable.message" class="text-center"></p>
                                <input type="text" name="validation_deleteGroupAdmin" id="validation_deleteGroupAdmin" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDeleteGroupAdmin()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDeleteGroupAdmin()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'manager-delete-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="manager.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="[html]manager.users.deleteIntentionSA">Vous vous apprêtez à supprimer l'utilisateur : <span id="mdi_firstnameSA"></span></p>
                            <div class="text-center c-secondary-form">
                                <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                                <input type="text" name="validation_delete" id="validation_delete" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDelete()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDelete()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'manager-disable-user': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUser" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="manager.users.disableConfirmationTitle">Confirmer la désactivation</h3>
                            <p class="text-center" data-i18n="[html]manager.users.disableIntention">Vous vous apprêtez à désactiver l'utilisateur : <span id="mde_firstnameSA"></span></p>
                            <div class="text-center c-secondary-form">
                                <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                                <input type="text" name="validation_disable" id="validation_disable" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDisable()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDisable()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'manager-delete-group': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.group.delete'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDeleteGroup" role="alert" style="display:none;"></div>
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="manager.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="[html]manager.group.deleteIntention">Vous vous apprêtez à suppression le groupe : <span id="md_group"></span></p>
                            <div class="text-center c-secondary-form">
                                <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                                <input type="text" name="validation_delete_group" id="validation_delete_group" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDeleteGroup()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDeleteGroup()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'manager-show-resetlink': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.showResetLinkTitle'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <h3 class="font-weight-bold text-info m-auto text-center my-3" data-i18n="manager.users.showResetLink">Lien de réinitialisation de mot de passe</h3>
                            <div class="row">
                                    <input type="text" class="form-control col-10" id="passwordLink">
                                    <button class="btn btn-primary mx-1 btn-lg col" onclick="copyLink('#passwordLink')" data-i18n="manager.buttons.copyLink">Copy the link</button>
                            </div>
                            <div class="row">
                                <button class="btn btn-info mx-auto mt-3 btn" onclick="dismissModal()" data-i18n="manager.buttons.close">Fermer</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'groupadmin-show-grouplink': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.group.showLinkTitle'
        },
        content: `  <div id="delete-user-modal">
                        <div class="col-12">
                            <h3 class="font-weight-bold text-info m-auto text-center my-3" data-i18n="manager.group.showLinkTitle">Lien du groupe</h3>
                            <div class="input-group c-secondary-form">
                                <input type="text" class="form-control" id="groupLink">
                                <div class="input-group-append">
                                    <button class="btn c-btn-secondary" onclick="copyLink('#groupLink')" data-i18n="manager.buttons.copyLink">Copy the link</button>
                                </div>
                            </div>

                            <div class="row">
                                <button class="btn c-btn-light mx-auto mt-3 btn" onclick="dismissModal()" data-i18n="manager.buttons.close">Fermer</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'update-applications-manager': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.users.updateAppModalTitle'
        },
        content: `  <div id="update-applications-modal">
                        <div class="container-fluid" id="update-app-manager" style="display:none;">
                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.group.generalInfo"> Restriction d'activité </p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_update_name" data-i18n="[html]manager.table.nameMandatory">Name</label>
                                    <input type="text" class="form-control" id="app_update_name">
                                </div>
                                <div class="col-md">
                                    <label for="app_update_description" data-i18n="[html]manager.table.descriptionMandatory">Description</label>
                                    <input type="text" class="form-control" id="app_update_description">
                                </div>
                                <div class="col-md">
                                    <label for="app_update_image" data-i18n="manager.table.image">Image</label>
                                    <input type="text" class="form-control" id="app_update_image">
                                </div>
                                <input type="hidden" class="form-control" id="app_update_id">
                            </div>
                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.activitiesRestrictions.restrictions"> Restriction d'activité </p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_update_activity_restriction_type" data-i18n="manager.activitiesRestrictions.type">Type</label>
                                    <input type="text" class="form-control" id="app_update_activity_restriction_type">
                                </div>
                                <div class="col-md">
                                    <label for="app_update_activity_restriction_value" data-i18n="manager.activitiesRestrictions.max">Nombre</label>
                                    <input type="number" class="form-control" id="app_update_activity_restriction_value">
                                </div>
                            </div>
                            <button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateApp()" data-i18n="manager.buttons.update">Modifier</button>
                            <button class="btn c-btn-light my-3 btn" onclick="closeModalAndCleanInput()" data-i18n="manager.buttons.cancel">Annuler</button>
                        </div>
                        <div class="col-12" id="delete-app-manager" style="display:none;">
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="manager.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="[html]manager.apps.deleteIntention"></p>
                            <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                            <div class="text-center c-secondary-form">
                                <input type="hidden" name="validation_delete_application_id" id="validation_delete_application_id">
                                <input type="text" name="validation_delete_application" id="validation_delete_application" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="closeModalAndCleanInput()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-red mx-auto mt-3 btn-lg" onclick="persistDeleteApp()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                        <div class="container-fluid" id="create-app-manager" style="display:none;">
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_create_name" data-i18n="[html]manager.table.nameMandatory">Name</label>
                                    <input type="text" class="form-control" id="app_create_name">
                                </div>
                                <div class="col-md">
                                    <label for="app_create_description" data-i18n="[html]manager.table.descriptionMandatory">Description</label>
                                    <input type="text" class="form-control" id="app_create_description">
                                </div>
                                <div class="col-md">
                                    <label for="app_create_image" data-i18n="manager.table.image">Image</label>
                                    <input type="text" class="form-control" id="app_create_image">
                                </div>
                                <input type="hidden" class="form-control" id="app_create_id">
                            </div>

                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.activitiesRestrictions.restrictions"> Restriction d'activité </p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_create_activity_restriction_type" data-i18n="manager.activitiesRestrictions.type">Type</label>
                                    <input type="text" class="form-control" id="app_create_activity_restriction_type">
                                </div>
                                <div class="col-md">
                                    <label for="app_create_activity_restriction_value" data-i18n="manager.activitiesRestrictions.max">Nombre</label>
                                    <input type="number" class="form-control" id="app_create_activity_restriction_value">
                                </div>
                            </div>

                            <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistCreateApp()" data-i18n="manager.buttons.validate">Valider</button>
                            <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="closeModalAndCleanInput()" data-i18n="manager.buttons.cancel">Annuler</button>
                        </div>
                    </div>`,
        footer: ``
    },
    'update-default-restrictions-manager': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.defaultRestrictions.update'
        },
        content: `  <div id="update-activities-restrictions-modal">
                        <div class="container-fluid" id="update-default-restrictions">

                        </div>
                    </div>`,
        footer: ``
    },
    'add-lti-activity-name': {
      selector: '',
      header: {
        icon: '',
        title: 'classroom.modals.addLtiActivityName'
      },
      content: `
          <div class="col-12">
            <div class="row">
               <input data-i18n="[placeholder]classroom.activities.form.title.label" type="text" id="activity-lti-form-title"
               class="form-control part-title-input">
            </div>

            <div class="row  justify-content-md-center"">
                  <button class="c-btn-primary m-3" onclick="startActivityCreation()"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addActivity.next"></span></button>
            </div>
          </div>
      `,
      footer: ``
    },
  'add-activity-limitation': {
    selector: '',
    header: {
      icon: '',
      title: 'classroom.modals.addActivity.limitTitle'
    },
    content: `
          <div class="col-12">
              <div class="row">
                  <p class="text-center" data-i18n="classroom.modals.addActivity.limitDescription"></p>
              </div>

              <div class="row  justify-content-md-center"">
                    <button class="c-btn-primary m-3" onclick="window.pseudoModal.closeModal('add-activity-limitation')"> <i class="fas fa-angle-left"></i> <span data-i18n="words.return" class="ml-1 mr-1"  style="text-transform:capitalize;"></span></button>
                    <button class="c-btn-primary m-3" onclick="window.open('https://cabri.com/fr/la-plateforme/','_blank')"> <span data-i18n="classroom.modals.addActivity.upgradePlan"></span></button>
              </div>
          </div>
      `,
    footer: ``
  },
  'activity-delete-confirm': {
    selector: '',
    header: {
      icon: '',
      title: 'classroom.modals.deleteActivity.title'
    },
    content: `
          <div class="col-12">
            <div class="row justify-content-md-center">
                <p class="text-center" data-i18n="classroom.modals.deleteActivity.description"></p>
            </div>

            <div class="row justify-content-md-center"">
                  <button class="c-btn-primary m-3" onclick="deleteActivity()">
                      <i class="fas fa-check"></i> <span class="ml-1" data-i18n="classroom.modals.deleteActivity.confirm"></span>
                  </button>
                  <button class="c-btn-primary m-3" onclick="window.pseudoModal.closeModal('activity-delete-confirm')">
                      <i class="fa fa-times"></i> <span class="ml-1" data-i18n="classroom.modals.deleteActivity.cancel"></span>
                  </button>
            </div>
          </div>
      `,
    footer: ``
  },
}

/* 
'update-activities-restrictions-manager': {
    selector: '',
    header: {
        icon: '',
        title: 'manager.activitiesRestrictions.updateAll'
    },
    content: `  <div id="update-activities-restrictions-modal">
                    <div class="container-fluid" id="update-activity-restrictions-manager" style="display:none;">
                        <div class="form-row mt-1 c-secondary-form">
                            <div class="col-md">
                                <label for="activity_restrictions_update_type">Type activity</label>
                                <input type="text" class="form-control" id="activity_restrictions_update_type">
                            </div>
                            <div class="col-md">
                                <label for="activity_restrictions_update_maximum">Maximum</label>
                                <input type="text" class="form-control" id="activity_restrictions_update_maximum">
                            </div>
                            <input type="hidden" class="form-control" id="activity_restrictions_id">
                        </div>
                        <button class="btn c-btn-secondary my-3 btn" onclick="persistUpdateRestriction()" data-i18n="manager.buttons.update">Modifier</button>
                        <button class="btn c-btn-light my-3 btn" onclick="closeModalAndCleanInputActivityRestrictions()" data-i18n="manager.buttons.cancel">Annuler</button>
                    </div>

                    <div class="col-12" id="delete-activity-restrictions-manager" style="display:none;">
                        <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="manager.users.deleteConfirmationTitle">Confirmer la suppression</h3>
                        <p class="text-center" data-i18n="[html]manager.activitiesRestrictions.deleteIntention"></p>
                        <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                        <div class="text-center c-secondary-form">
                            <input type="hidden" name="validation_delete_restriction_id" id="validation_delete_restriction_id">
                            <input type="text" name="validation_delete_restriction" id="validation_delete_restriction" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                        </div>
                        <div class="text-center">
                            <button class="btn c-btn-red mx-auto mt-3 btn-lg" onclick="persistDeleteRestriction()" data-i18n="manager.buttons.validate">Valider</button>
                            <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="closeModalAndCleanInputActivityRestrictions()" data-i18n="manager.buttons.cancel">Annuler</button>
                        </div>
                    </div>

                    <div class="container-fluid" id="create-activity-restrictions-manager" style="display:none;">
                        <div class="form-row mt-1 c-secondary-form">
                            <div class="col-md">
                                <label for="activity_restrictions_create_type">Type activity</label>
                                <input type="text" class="form-control" id="activity_restrictions_create_type">
                            </div>
                            <div class="col-md">
                                <label for="activity_restrictions_create_maximum">Maximum</label>
                                <input type="text" class="form-control" id="activity_restrictions_create_maximum">
                            </div>
                        </div>
                        <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistCreateRestriction()" data-i18n="manager.buttons.validate">Valider</button>
                        <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="closeModalAndCleanInputActivityRestrictions()" data-i18n="manager.buttons.cancel">Annuler</button>
                    </div>
                </div>`,
    footer: ``
}, */