const BASE_STUDENT_FORM = `<div class="c-primary-form row col-12">
        
<label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
<input class="col-5 student-form-name" type="text">
</div>`;
const LINK_REGEX = /(\[iframe\].*link=)([a-f0-9]{13})/
const NO_CLASS = "<p class='no-classes text-center' data-i18n='classroom.modals.listClass.noClass'> Vous devez d'abord créer une classe pour pouvoir utiliser cette fonctionalité"
const capitalizedDemoStudentName = `${demoStudentName.charAt().toUpperCase()}${demoStudentName.slice(1)}`
const cookies = document.cookie.split(';')
const lang = cookies.filter(entry => entry.trim().startsWith('lng'))
const langValue = lang[0] ? lang[0].split('=')[1] : 'fr'

const classroomModals = {
    'import-csv': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `<div class="text-center mx-auto w-100 mh-100 mb-2">
                    <p> <span data-i18n="classroom.modals.addStudentByCsv.description"></span>
                        <a data-i18n="classroom.modals.addStudentByCsv.csvTemplate;[download]classroom.modals.addStudentByCsv.csvTemplate" href="${_PATH}assets/media/lang/${langValue}/csv_template.csv"></a>
                         - 
                        <a data-i18n="classroom.modals.addStudentByCsv.csvTemplateNoPassword;[download]classroom.modals.addStudentByCsv.csvTemplateNoPassword" href="${_PATH}assets/media/lang/${langValue}/csv_template_nopw.csv"></a>.
                    </p>
                    <label for="importcsv-fileinput" class="btn btn-secondary" data-i18n="classroom.modals.addStudentByCsv.fileChooser">Choisir un fichier</label>
                    <span id="importcsv-fileinput-classroom-filename" data-i18n="classroom.modals.addStudentByCsv.fileName">Aucun fichier choisi</span>
                    <input type="file" id="importcsv-fileinput" name="importcsvfileinput" style="visibility:hidden;"/><br>
                    <button class="btn c-btn-secondary mt-2" onclick="importLearnerCsv()">
                        <i class="fas fa-file-csv"></i> 
                        <span data-i18n="classroom.modals.addStudentByCsv.importStudentByCsvButton">Importer les apprenants</span>
                    </button>
                </div>`,
        footer: ``
    },
    'import-csv-create-classroom': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `<div class="text-center mx-auto w-100 mh-100 mb-2">
                    <p><span data-i18n="[html]classroom.modals.addStudentByCsv.descriptionUpdate"></span><a data-i18n="classroom.modals.addStudentByCsv.csvTemplateNoPassword;[download]classroom.modals.addStudentByCsv.csvTemplateNoPassword" href="${_PATH}assets/media/lang/${langValue}/csv_template_nopw.csv"></a>.</p>
                    <label for="importcsv-fileinput-classroom-create" class="btn btn-secondary" data-i18n="classroom.modals.addStudentByCsv.fileChooser">Choisir un fichier</label>
                    <span id="importcsv-fileinput-classroom-create-filename" data-i18n="classroom.modals.addStudentByCsv.fileName">Aucun fichier choisi</span>
                    <input type="file" id="importcsv-fileinput-classroom-create" name="importcsvfileinput" style="visibility:hidden;"/><br>
                    <button class="btn c-btn-secondary mt-2" onclick="importLearnerCsv()">
                        <i class="fas fa-file-csv"></i> 
                        <span data-i18n="classroom.modals.addStudentByCsv.importStudentByCsvButton">Importer les apprenants</span>
                    </button>
                </div>`,
        footer: ``
    },
    'import-csv-update-classroom': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudentByCsv.title'
        },
        content: `<div class="text-center mx-auto w-100 mh-100 mb-2">
                    <p><span data-i18n="[html]classroom.modals.addStudentByCsv.descriptionUpdate"></span><a data-i18n="classroom.modals.addStudentByCsv.csvTemplateNoPassword;[download]classroom.modals.addStudentByCsv.csvTemplateNoPassword" href="${_PATH}assets/media/lang/${langValue}/csv_template_nopw.csv"></a>.</p>
                    <label for="importcsv-fileinput-classroom-update" class="btn btn-secondary" data-i18n="classroom.modals.addStudentByCsv.fileChooser">Choisir un fichier</label>
                    <span id="importcsv-fileinput-classroom-update-filename" data-i18n="classroom.modals.addStudentByCsv.fileName">Aucun fichier choisi</span>
                    <input type="file" id="importcsv-fileinput-classroom-update" name="importcsvfileinput" style="visibility:hidden;"/><br>
                    <button class="btn c-btn-secondary mt-2" onclick="importLearnerCsv(true)">
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
        <div id="switch-lang-list">
            <button class="btn c-btn-secondary" onclick="changeLang('fr')">
                Français
            </button>
            <button class="btn c-btn-secondary" onclick="changeLang('en')">
                English
            </button>
            <button class="btn c-btn-secondary" onclick="changeLang('it')">
                Italiano
            </button>
            <button class="btn c-btn-secondary" onclick="changeLang('es')">
                Español
            </button>
            <button class="btn c-btn-secondary" onclick="changeLang('nl')">
                Nederlands
            </button>  
            <button class="btn c-btn-secondary" onclick="changeLang('ar')">
                العربية
            </button>
        </div>
        <h4 data-i18n="classroom.modals.settingsTeacher.password">Mot de passe</h4>
        <p class="text-center" data-i18n="classroom.modals.settingsTeacher.passwordDescription"></p>
        <div class="d-flex justify-content-center">
            <form class="pwd-display-stud pwd-display-stud-modal" href="#">
                <input type="password" readonly class="modal-pwd" id="password-display-area" autocomplete="off"><i class="classroom-clickable fas fa-low-vision ml-2 password-display-toggler"></i>
            </form>
            
            <button class="btn c-btn-secondary" id="pwd-change-modal">Réinitialiser <i class="fas fa-chevron-right"></i></button>`,
        footer: ``
    },
    'settings-teacher-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.settingsTeacher.title'
        },
        content: `<div>
                    <h4 data-i18n="classroom.modals.settingsTeacher.lang">Langue</h4>
                    <div id="switch-lang-list">
                        <button class="btn c-btn-secondary" onclick="changeLang('fr')">
                            Français
                        </button>
                        <button class="btn c-btn-secondary" onclick="changeLang('en')">
                            English
                        </button>
                        <button class="btn c-btn-secondary" onclick="changeLang('it')">
                            Italiano
                        </button>
                        <button class="btn c-btn-secondary" onclick="changeLang('es')">
                            Español
                        </button>
                        <button class="btn c-btn-secondary" onclick="changeLang('nl')">
                            Nederlands
                        </button>   
                        <button class="btn c-btn-secondary" onclick="changeLang('ar')">
                            العربية
                        </button>
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
        content: `  <h4 class="c-text-primary font-weight-bold text-uppercase" data-i18n="classroom.classes.selectStudents">Sélectionner des apprenants</h4>
                    <p class='text-center' data-i18n="[html]classroom.classes.selectedStudents"><span class="student-number" id="attribuate-student-number">0</span> apprenants sélectionnés</p>
                    <div class="container-fluid">
                        <div id="list-student-attribute-modal" class="row justify-content-center c-primary-form"></div>
                    </div>
                    <button id="attribute-activity-to-students-close" class="btn btn-lg c-btn-primary" data-i18n="manager.buttons.validate">Valider</button>`,
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
        <div id="list-classes" class="mx-5 c-primary-form"></div>
        <button class="btn  mb-2 c-btn-primary" id="mode-student-check" onclick="modeApprenant()" > <span class="mr-1" data-i18n="classroom.modals.listClass.switchButton">Passer en mode apprenant</span> <i class="fas fa-cog"></i></button>
                `,
        footer: ``
    },
    'share-project-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.shareProject.title'
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
    'create-classroom-student-modal': {
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
        <button id="create-classroom-add-student-to-list" class="save-student-in-classroom c-btn-primary m-3"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addStudent.addStudentButton">Ajouter l'apprenant</span></button>
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
    'update-classroom-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudent.title'
        },
        content: `
        <div id="update-classroom-add-student-div">
            <div class="c-primary-form row col-12">
                <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
                <input class="col-5 student-form-name" type="text">
            </div>
        </div>
        <button id="update-classroom-add-student-to-list" class="btn save-student-in-classroom c-btn-primary m-3"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addStudent.addStudentButton">Ajouter l'apprenant</span></button>
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="d-flex justify-content-center modal-separator mt-4 mb-4">
                <span data-i18n="classroom.modals.addActivity.orSeparator">OU</span>
            </div>
            <button class="btn c-btn-secondary" onclick="openCsvModal(true);">
                <span data-i18n="classroom.modals.addStudent.addStudentByCsvButton">Ajouter un fichier d'apprenants (.csv)</span><i class="fas fa-chevron-right ml-1"></i>
            </button>
        </div>`,
        footer: ``
    },
    'add-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.addStudent.title'
        },
        content: `
        <div id="classroom-dashboard-add-student-div">
            <div class="c-primary-form row col-12">
                <label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
                <input class="col-5 student-form-name" type="text">
            </div>
        </div>
        <button id="add-student-to-classroom" class="btn save-student-in-classroom c-btn-primary m-3"><i class="fas fa-save"></i> <span class="ml-1" data-i18n="classroom.modals.addStudent.addStudentButton">Ajouter l'apprenant</span></button>
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

                    <div id="group_global_restrictions">
                    </div>

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
                    <div id="group_upd_global_restrictions">
                    </div>

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
            <div class="form-check form-check-inline c-checkbox">
                <input class="form-check-input" type="checkbox" id="u_is_admin">
                <label class="form-check-label" for="u_is_admin" data-i18n="manager.users.admin">
                    Administrateur
                </label>
            </div>
        </div>
    
        <div class="form-row form-group c-secondary-form">
            <div class="form-check form-check-inline c-checkbox">
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
                <div class="input-group-text c-checkbox c-checkbox-grey">
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

    <hr>

    <div id="create_global_user_restrictions">
        <h6 class="form-check-label font-weight-bold mb-1" style="color: var(--classroom-primary)" data-i18n="manager.users.globalRestrictions"></h6>
        <br>
        <div class="activity-add-form c-secondary-form">
            <label class="form-check-label" for="create_begin_date" data-i18n="[html]manager.table.dateBeginFA"></label>
            <input type="date" id="create_begin_date" name="trip-start" max="2023-12-31">
            <label class="form-check-label" for="create_end_date" data-i18n="[html]manager.table.dateEndFA"></label>
            <input type="date" id="create_end_date" name="trip-start" max="2025-12-31">
            <label class="form-check-label" for="create_max_students" data-i18n="[html]manager.table.maxStudentsFA"></label>
            <input type="number" id="create_max_students">

            <label class="form-check-label" for="create_max_classrooms" data-i18n="[html]manager.table.maxClassroomsFA"></label>
            <input type="number" id="create_max_classrooms">
        </div>
    </div>

    <hr>

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
            <div class="form-check form-check-inline c-checkbox">
                <input type="checkbox" id="update_u_is_active">
                <label class="form-check-label" for="update_u_is_active" data-i18n="manager.account.active">
                    Compte actif
                </label>
            </div>
    
            <div class="form-check form-check-inline c-checkbox ml-3">
                <input type="checkbox" id="update_u_is_admin">
                <label class="form-check-label" for="update_u_is_admin" data-i18n="manager.users.admin">
                    Administrateur
                </label>
            </div>
        </div>
    
        <div class="form-row form-group c-secondary-form">
            <div class="c-checkbox">
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

        <div id="update_global_user_restrictions">
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
            <div class="form-group col-md" id="group_admin_username">
                <label for="u_pseudo_ga" data-i18n="[html]manager.profil.nickname">Pseudonyme</label>
                <input type="text" class="form-control" id="u_pseudo_ga">
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

        <div id="create_applications_ga">
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
        content: `  <div id="groupadmin-disable-user-modal">
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
        content: `  <div id="groupadmin-delete-user-modal">
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
        content: `  <div id="manager-delete-user-modal">
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
        content: `  <div id="manager-disable-user-modal">
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
        content: `  <div id="manager-delete-group-modal">
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
        content: `  <div id="manager-show-resetlink-modal">
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
        content: `  <div id="groupadmin-show-grouplink-modal">
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
                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.group.generalInfo">Restriction d'activité</p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_update_name" data-i18n="[html]manager.table.nameMandatory">Name</label>
                                    <input type="text" class="form-control" id="app_update_name">
                                </div>
                                <div class="col-md">
                                    <label for="app_update_description" data-i18n="[html]manager.table.descriptionMandatory">Description</label>
                                    <input type="text" class="form-control" id="app_update_description">
                                </div>
                            </div>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_update_image" data-i18n="manager.table.image">Image</label>
                                    <input type="text" class="form-control" id="app_update_image">
                                    <img src="" class="app_image_preview" id="app_update_image_preview">
                                </div>
                                <div class="col-md">
                                    <label for="app_update_color" data-i18n="manager.table.color">Color</label>
                                    <input type="color" class="form-control" id="app_update_color">
                                </div>
                            </div>
                            <div class="form-row mt-1 c-secondary-form">

                                <div class="col-md">
                                    <label for="app_update_sort_index" data-i18n="manager.activitiesRestrictions.indexPos">Nombre</label>
                                    <input type="number" class="form-control" id="app_update_sort_index" value="0">
                                </div>

                                <input type="hidden" class="form-control" id="app_update_id">
                            </div>
                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.activitiesRestrictions.restrictions"> Restriction d'activité </p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_update_activity_restriction_value" data-i18n="manager.activitiesRestrictions.appQuantity">Nombre</label>
                                    <input type="number" class="form-control" id="app_update_activity_restriction_value">
                                </div>
                            </div>

                            <div class="c-checkbox">
                                <input type="checkbox" class="form-check-input" id="update_isLti">
                                <label for="update_isLti" class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.apps.ltiApps">Lti apps ?</label>
                            </div>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <div id="update_inputs-lti" style="display:none;">
                                        <label for="update_clientId" data-i18n="[html]manager.apps.clientId">Client Id</label>
                                        <input type="text" class="form-control mb-2" id="update_clientId">
                                        <label for="update_deploymentId" data-i18n="[html]manager.apps.deploymentId">Deployment Id</label>
                                        <input type="text" class="form-control mb-2" id="update_deploymentId">
                                        <label for="update_toolUrl" data-i18n="[html]manager.apps.toolUrl">Tool Url</label>
                                        <input type="text" class="form-control mb-2" id="update_toolUrl">
                                        <label for="update_publicKeySet" data-i18n="[html]manager.apps.publicKeySet">Public Key Set</label>
                                        <input type="text" class="form-control mb-2" id="update_publicKeySet">
                                        <label for="update_loginUrl" data-i18n="[html]manager.apps.loginUrl">Login Url</label>
                                        <input type="text" class="form-control mb-2" id="update_loginUrl">
                                        <label for="update_redirectionUrl" data-i18n="[html]manager.apps.redirectionUrl">Redirection Url</label>
                                        <input type="text" class="form-control mb-2" id="update_redirectionUrl">
                                        <label for="update_deepLinkUrl" data-i18n="[html]manager.apps.deepLinkUrl">DeepLink Url</label>
                                        <input type="text" class="form-control mb-2" id="update_deepLinkUrl">
                                        <label for="update_privateKey" data-i18n="[html]manager.apps.privateKey">Private Key</label>
                                        <textarea class="form-control mb-2" id="update_privateKey"></textarea>
                                    </div>
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
                            </div>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_create_image" data-i18n="manager.table.image">Image</label>
                                    <input type="text" class="form-control" id="app_create_image">
                                    <img src="" class="app_image_preview" id="app_create_image_preview">
                                </div>
                                <div class="col-md">
                                    <label for="app_create_color" data-i18n="manager.table.color">Color</label>
                                    <input type="color" class="form-control" id="app_create_color">
                                </div>
                            </div>
                            <div class="form-row mt-1 c-secondary-form">

                                <div class="col-md">
                                    <label for="app_create_sort_index" data-i18n="manager.activitiesRestrictions.indexPos">Nombre</label>
                                    <input type="number" class="form-control" id="app_create_sort_index" value="0">
                                </div>

                                <input type="hidden" class="form-control" id="app_create_id">
                            </div>

                            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.activitiesRestrictions.restrictions"> Restriction d'activité </p>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <label for="app_create_activity_restriction_value" data-i18n="manager.activitiesRestrictions.max">Nombre</label>
                                    <input type="number" class="form-control" id="app_create_activity_restriction_value">
                                </div>
                            </div>

                            <div class="c-checkbox">
                                <input type="checkbox" class="form-check-input" id="isLti">
                                <label for="isLti" class="mt-4 mb-1 vitta-modal-title" data-i18n="manager.apps.ltiApps">Lti apps ?</label>
                            </div>
                            <div class="form-row mt-1 c-secondary-form">
                                <div class="col-md">
                                    <div id="inputs-lti" style="display:none;">
                                        <label for="clientId" data-i18n="[html]manager.apps.clientId">Client Id</label>
                                        <input type="text" class="form-control mb-2" id="clientId">
                                        <label for="deploymentId" data-i18n="[html]manager.apps.deploymentId">Deployment Id</label>
                                        <input type="text" class="form-control mb-2" id="deploymentId">
                                        <label for="toolUrl" data-i18n="[html]manager.apps.toolUrl">Tool Url</label>
                                        <input type="text" class="form-control mb-2" id="toolUrl">
                                        <label for="publicKeySet" data-i18n="[html]manager.apps.publicKeySet">Public Key Set</label>
                                        <input type="text" class="form-control mb-2" id="publicKeySet">
                                        <label for="loginUrl" data-i18n="[html]manager.apps.loginUrl">Login Url</label>
                                        <input type="text" class="form-control mb-2" id="loginUrl">
                                        <label for="redirectionUrl" data-i18n="[html]manager.apps.redirectionUrl">Redirection Url</label>
                                        <input type="text" class="form-control mb-2" id="redirectionUrl">
                                        <label for="deepLinkUrl" data-i18n="[html]manager.apps.deepLinkUrl">DeepLink Url</label>
                                        <input type="text" class="form-control mb-2" id="deepLinkUrl">
                                        <label for="privateKey" data-i18n="[html]manager.apps.privateKey">Private Key</label>
                                        <textarea class="form-control mb-2" id="privateKey"></textarea>
                                    </div>
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
    'activity-restricted': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.activitiesRestrictions.appRestricted'
        },
        content: `  <div id="activity-restricted">
                        <div class="container-fluid" id="activity-restricted-content">
                            <p class="mt-4 mb-1 font-weight-bold" data-i18n="manager.activitiesRestrictions.appRestrictedUL1"> </p>
                            <p class="mt-4 mb-1" data-i18n="manager.activitiesRestrictions.appRestrictedUL2"> </p>
                            <hr>
                            <div class="w-100 text-center">
                                <p class="mt-4 mb-1 font-weight-bold" data-i18n="manager.activitiesRestrictions.appRestrictedSubtitle2"> </p>
                                <p data-i18n="manager.activitiesRestrictions.appRestrictedSubtitle3"> </p>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'activity-outdated': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.activitiesRestrictions.appOutDated'
        },
        content: `  <div id="activity-restricted">
                        <div class="container-fluid" id="activity-restricted-content">
                            <p class="mt-4 mb-1 font-weight-bold" data-i18n="manager.activitiesRestrictions.appOutDatedUL1"> </p>
                            <p class="mt-4 mb-1" data-i18n="manager.activitiesRestrictions.appOutDatedUL2"> </p>
                            <hr>
                            <div class="w-100 text-center">
                                <p data-i18n="manager.activitiesRestrictions.appOutDatedSubtitle3"> </p>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'activity-restricted-gar': {
        selector: '',
        header: {
            icon: '',
            title: 'manager.activitiesRestrictions.appRestricted'
        },
        content: `  <div id="activity-restricted-gar">
                        <div class="container-fluid" id="activity-restricted-gar-content">
                            <p class="mt-4 mb-1 font-weight-bold" data-i18n="manager.activitiesRestrictions.appRestrictedGarContent1" id="app-restricted-number" data-i18n-options=""> </p>
                            <p class="mt-4 mb-1" data-i18n="manager.activitiesRestrictions.appRestrictedGarContent2"> </p>
                            <hr>
                            <div class="w-100 text-center">
                                <p class="mt-4 mb-1 font-weight-bold" data-i18n="manager.activitiesRestrictions.appRestrictedSubtitle2"> </p>
                                <p data-i18n="manager.activitiesRestrictions.appRestrictedSubtitle3"> </p>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'profile-update-password-confirm': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.modals.profileUpdatePasswordConfirm.title'
        },
        content: `  <div>
                        <div class="col-12">
                            <form class="text-center c-primary-form">
                                <p class="text-center" data-i18n="classroom.modals.profileUpdatePasswordConfirm.description"></p>
                                <input type="password" name="current_password_prompt" id="current_password_prompt" data-i18n="[placeholder]classroom.modals.profileUpdatePasswordConfirm.placeholderInput" autocomplete="off">
                            </form>
                            <div class="text-center">
                                <button class="btn c-btn-primary mx-auto mt-3 btn-lg" id="saveProfileUpdate" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'delete-activity-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.activities.deleteActivity'
        },
        content: `  <div id="delete-activities-modal">
                        <div class="col-12">
                            <div class="alert" id="alertDisableUserGA" role="alert" style="display:none;"></div>
        
                            <p id="activity-linked-to-course-message" class="text-center mt-2"> Cette activité est liée à un ou plusieurs parcours.  </p>
                            <div class="d-flex flex-row justify-content-center align-items-center align-content-around">
                                <i class="fas fa-exclamation-triangle fa-3x mr-3" style="color: #ffb636;"></i>                   
                                <p id="delete-activity-text" class="m-0" data-i18n="[html]classroom.activities.deleteActivityDisclaimer"></p>
                            </div>
                            <div class="text-right">
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDeleteActivity()" data-i18n="manager.buttons.validate">Confirmer</button>
                                <button class="btn c-btn-light btn-blue mx-auto mt-3 btn-lg" onclick="cancelDeleteActivity()" data-i18n="manager.buttons.cancel">Annuler</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'folder-delete-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.folders.folderDelete'
        },
        content: `  <div id="folder-manager-modal-content">
            <!-- DELETE -->
            <div class="col-12" id="delete-folder">
                <div class="d-flex flex-row justify-content-center align-items-center align-content-around">
                    <i class="fas fa-exclamation-triangle fa-3x mr-3" style="color: #ffb636;"></i>                   
                    <p id="delete-folder-text" class="m-0" data-i18n="classroom.activities.foldersMessages.deleteFolder"></p>
                </div>

                <div class="text-right">
                    <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="foldersManager.persistDeleteFolder()" data-i18n="manager.buttons.validate">Confirmer</button>
                    <button class="btn c-btn-light btn-blue mx-auto mt-3 btn-lg" onclick="foldersManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
                </div>
            </div>
    </div>`,
        footer: ``
    },
    'folder-manager-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.folders.folderManagement'
        },
        content: `  <div id="folder-manager-modal-content">

        <!-- UPDATE -->
        <div class="container-fluid" id="update-folder-manager" style="display:none;">
    
            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="classroom.activities.foldersMessages.updateFolder">Modification de dossier</p>
    
            <div class="form-row mt-1 c-secondary-form">
                <div class="col-md">
                    <label for="folder_update_name" data-i18n="[html]classroom.activities.foldersMessages.nameMandatory">Name</label>
                    <input type="text" class="form-control" id="folder_update_name">
                </div>
            </div>
           
            <button class="btn c-btn-secondary my-3 btn" onclick="foldersManager.persistUpdateFolder()" data-i18n="manager.buttons.update">Modifier</button>
            <button class="btn c-btn-light my-3 btn" onclick="foldersManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
        </div>
    
        <!-- CREATE -->
        <div class="container-fluid" id="create-folder-manager" style="display:none;">
    
            <p class="mt-4 mb-1 vitta-modal-title" data-i18n="classroom.activities.foldersMessages.createFolder">Création de dossier</p>
    
            <div class="form-row mt-1 c-secondary-form">
                <div class="col-md">
                    <label for="folder_create_name" data-i18n="[html]classroom.activities.foldersMessages.nameMandatory">Name</label>
                    <input type="text" class="form-control" id="folder_create_name">
                </div>
            </div>
    
            <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="foldersManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
            <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="foldersManager.persistCreateFolder()" data-i18n="manager.buttons.validate">Valider</button>
        </div>
    </div>`,
        footer: ``
    },
    'folders-move-to': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.activities.moveToFolder'
        },
        content: `  <div id="folders-move-to-content" class="container-fluid">
                        <div id="folders-tree-content-modal">
                        </div>
                        <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="foldersManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
                        <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="foldersManager.persistMoveToFolder()" data-i18n="manager.buttons.validate">Valider</button>
                    </div>`,
        footer: ``
    },
    'folders-seek': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.activities.seekFolder'
        },
        content: `  <div id="folders-move-to-content" class="container-fluid">
                        <div id="folders-seek-tree-content-modal">
                        </div>
                        <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="foldersManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
                        <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="foldersManager.persistGoToSelected()" data-i18n="manager.buttons.validate">Valider</button>
                    </div>`,
        footer: ``
    },
    'delete-student-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.classes.deleteStudent'
        },
        content: `  <div id="delete-student-modal">
                        <div class="col-12">
                            <input type="hidden" id="student-to-delete-id">
                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="classroom.classes.deleteStudentConfirm"></h3>
                            <div class="text-center c-secondary-form">
                                <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                                <input type="text" name="validation-delete-student" id="validation-delete-student" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDeleteStudent()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDeleteStudent()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'pdf-preview': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.pdfPreview'
        },
        content: `  <div id="pdf-preview-galery">`,
        footer: ``
    },
    'add-activity-to-course': {
        selector: '',
        header: {
            icon: '',
            title: 'courses.addActivities'
        },
        content: `  <div id="add-activity-container" class="container-fluid">

                        <input type="search" class="form-control" id="course-activity-search" class="course-activity-search" data-i18n="[placeholder]courses.searchActivity">

                        <div id="add-activity-content">

                        </div>

                        <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="coursesManager.cancelActivityToCourse()" data-i18n="manager.buttons.cancel">Annuler</button>
                        <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="coursesManager.persistActivityToCourse()" data-i18n="manager.buttons.validate">Valider</button>
                    </div>`,
        footer: ``
    },
    'course-manager-modal': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.courses.coursesManager'
        },
        content: `  <div id="folder-manager-modal-content">
                        <div class="col-12" id="delete-course-manager">
                    
                            <h3 class="font-weight-bold text-danger m-auto text-center" data-i18n="classroom.activities.coursesMessages.deleteFolder">Confirmer la suppression</h3>
                            <p class="text-center" data-i18n="manager.users.deleteConfirmation">Veuillez écrire "supprimer" dans le champ si dessous pour valider l'action.</p>
                    
                            <div class="text-center c-secondary-form">
                                <input type="hidden" name="validation-delete-course-id" id="validation-delete-course-id">
                                <input type="text" name="validation-delete-course" id="validation-delete-course" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>
                    
                            <div class="text-center">
                                <button class="btn c-btn-red mx-auto mt-3 btn-lg" onclick="coursesManager.persistDeleteCourse()" data-i18n="manager.buttons.validate">Valider</button>
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="coursesManager.resetInputs()" data-i18n="manager.buttons.cancel">Annuler</button>
                            </div>
                        </div>
                    </div>`,
        footer: ``
    },
    'delete-classroom': {
        selector: '',
        header: {
            icon: '',
            title: 'classroom.classes.deleteModal.deleteTitle'
        },
        content: `  <div id="delete-classroom-modal">
                        <div class="col-12">

                            <h3 class="font-weight-bold c-text-red m-auto text-center" data-i18n="classroom.classes.deleteModal.message"></h3>

                            <div class="text-center c-secondary-form">
                                <p data-i18n="manager.users.disable.message" class="text-center"></p>
                                <input type="text" name="validation-delete-classroom" id="validation-delete-classroom" data-i18n="[placeholder]manager.input.placeholder.delete" placeholder="supprimer">
                            </div>

                            <div class="text-center">
                                <button class="btn c-btn-light mx-auto mt-3 btn-lg" onclick="cancelDeleteClassroom()" data-i18n="manager.buttons.cancel">Annuler</button>
                                <button class="btn c-btn-secondary mx-auto mt-3 btn-lg" onclick="persistDeleteClassroom()" data-i18n="manager.buttons.validate">Valider</button>
                            </div>

                        </div>
                    </div>`,
        footer: ``
    }
}
