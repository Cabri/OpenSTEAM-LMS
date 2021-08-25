const BASE_STUDENT_FORM = `<div class="green-form row col-12">
        
<label class="col-5" data-i18n="classroom.modals.addStudent.pseudo">Pseudonyme</label>
<input class="col-5 student-form-name" type="text">
</div>`;
const LINK_REGEX = /(\[iframe\].*link=)([a-f0-9]{13})/
const NO_CLASS = "<p class='no-classes'> Vous devez d'abord créer une classe pour pouvoir utiliser cette fonctionalité"
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
        <p data-i18n="classroom.modals.listClass.description">Vous pouvez tester en toute simplicité l'interface en tant qu'apprenant, et revenir à tout moment à votre profil d'enseignant. La progression en tant qu'apprenant sera sauvegardée sur le compte Vittademo.</p>
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
    }

}