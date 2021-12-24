/**
 * Manage the help request forms
 */
class CheckMail {
    constructor() {
        this._MIN_MESSAGE_SIZE = 10;
        this._MAX_MESSAGE_SIZE = 800;
        this._MIN_SUBJECT_SIZE = 2;
        this._MAX_SUBJECT_SIZE = 80;
        this._teacherFormElt = document.getElementById('about-contact-form');
        this._teacherMessageInputElt = document.getElementById('contact-message-input');
        this._teacherSubjectInputElt = document.getElementById('contact-subject-input');
        this._learnerFormElt = document.getElementById('about-contact-form-student');
        this._learnerMessageInputElt = document.getElementById('learner-contact-message-input');
        this._learnerSubjectInputElt = document.getElementById('learner-contact-subject-input');
        this._groupAdminFormElt = document.getElementById('groupadmin-about-contact-form');
        this._groupAdminSubjectInputElt = document.getElementById('groupadmin-contact-subject-input');
        this._groupAdminMessageInputElt = document.getElementById('groupadmin-contact-message-input');
        this._init();
    }

    /**
     * Setup the listeners
     */
    _init() {
        // Teacher help form listeners
        this._teacherMessageInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_MESSAGE_SIZE, this._MAX_MESSAGE_SIZE);
            this._checkContactForm(this._teacherFormElt);
        });

        this._teacherSubjectInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_SUBJECT_SIZE, this._MAX_SUBJECT_SIZE);
            this._checkContactForm(this._teacherFormElt);
        });

        this._teacherFormElt.addEventListener('submit', (e) => { this._submitForm(e) });

        // Learner help form listeners
        this._learnerMessageInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_MESSAGE_SIZE, this._MAX_MESSAGE_SIZE);
            this._checkContactForm(this._learnerFormElt);
        });

        this._learnerSubjectInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_SUBJECT_SIZE, this._MAX_SUBJECT_SIZE);
            this._checkContactForm(this._learnerFormElt);
        });

        this._learnerFormElt.addEventListener('submit', (e) => { this._submitForm(e) });


        // Group admin help
        this._groupAdminMessageInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_MESSAGE_SIZE, this._MAX_MESSAGE_SIZE);
            this._checkContactForm(this._groupAdminFormElt);
        });

        this._groupAdminSubjectInputElt.addEventListener('input', (e) => {
            this._checkText(e.target, this._MIN_SUBJECT_SIZE, this._MAX_SUBJECT_SIZE);
            this._checkContactForm(this._groupAdminFormElt);
        });
    }

    /**
     * Check if the subject and message field values are valid
     * @param {DOM Element} input 
     * @param {number} min 
     * @param {number} max 
     */
    _checkText(input, min, max) {
        var value = input.value.trim();
        if (value.length === 0) {
            input.className = "form-control";
        }
        else {
            if (value.length >= min && value.length <= max) {
                input.className = "form-control is-valid";
            }
            else {
                input.className = "form-control is-invalid";
            }
        }
    }

    /**
     * Enable/disable the submit button depending on the fields validation
     * @param {DOM Element} form 
     */
    _checkContactForm(form) {
        let btn = document.querySelector(`#${form.id} input[type='submit']`);
        let subjectInput = document.querySelector(`#${form.id} input[name='subject']`);
        let messageInput = document.querySelector(`#${form.id} textarea[name='message']`);
        if (form.id != "groupadmin-about-contact-form") {
            if (subjectInput.classList.contains('is-valid') && messageInput.classList.contains('is-valid')) {
                this._enableButton(btn, true);
            } else {
                this._disableButton(btn, i18next.t('classroom.teacherHelpPanel.contactForm.fillInAllTheFields'));
            }
        } else {
            // Update @Rémi 
            if (subjectInput.classList.contains('is-valid') && messageInput.classList.contains('is-valid')) {
                $('#btn-help-for-groupAdmin').prop( "disabled", false );
                $('#btn-help-for-groupAdmin').css('cursor','pointer');
            } else {
                $('#btn-help-for-groupAdmin').prop( "disabled", true );
                $('#btn-help-for-groupAdmin').css('cursor','not-allowed');
            }
        }
    }

    /**
     * Enable the button given as argument and set (optional) its title
     * @param {DOM Element} btn 
     * @param {string} title - Optional
     */
    _enableButton(btn, title = false) {
        btn.removeAttribute("disabled");
        btn.style.cursor = "pointer";
        if (title != false) {
            btn.setAttribute('title', "")
        }
    }

    /**
     * Disable the button given as argument and set (optional) its title
     * @param {DOM Element} btn 
     * @param {string} title - Optional
     */
    _disableButton(btn, title = false) {
        btn.setAttribute("disabled", "disabled");
        btn.style.cursor = "not-allowed";   
        if (title != false) {
            btn.setAttribute('title', title)
        }
    }

    /**
     * Actions triggered when the forms are submitted
     * @param {event} e 
     */
    _submitForm(e) {
        e.preventDefault();
        let btn = document.querySelector(`#${e.target.id} input[type='submit']`);
        this._disableButton(btn);
        let formData = new FormData(e.target);
        let userId = UserManager.getUser().id;
        if (userId && parseInt(userId) === parseInt(userId)) {
            formData.append('id', userId);
            // Teacher's form
            if (UserManager.getUser().isRegular) {
                Main.getClassroomManager().sendHelpRequestFromTeacher(formData)
                    .then((data) => {
                        if (data.emailSent == true) {
                            displayNotification('#notif-div', "classroom.notif.helpRequestFromTeacherSent", "success");
                            document.querySelector(`#${e.target.id} input[name='subject']`).value = '';
                            document.querySelector(`#${e.target.id} textarea[name='message']`).value = '';
                        } else {
                            if (data.errors) {
                                for (let error in data.errors) {
                                    displayNotification('#notif-div', `classroom.notif.${error}TeacherHelpForm`, "error");
                                }
                            }
                            if (data.errorType) {
                                displayNotification('#notif-div', `classroom.notif.${data.errorType}TeacherHelpForm`, "error");
                            }
                        }
                        this._enableButton(btn);
                    });
            } else {
                // Learner's form
                Main.getClassroomManager().sendHelpRequestFromLearner(formData)
                    .then((data) => {
                        if (data.emailSent == true) {
                            displayNotification('#notif-div', "classroom.notif.helpRequestFromLearnerSent", "success");
                            document.querySelector(`#${e.target.id} input[name='subject']`).value = '';
                            document.querySelector(`#${e.target.id} textarea[name='message']`).value = '';
                        } else {
                            if (data.errors) {
                                for (let error in data.errors) {
                                    displayNotification('#notif-div', `classroom.notif.${error}LearnerHelpForm`, "error");
                                }
                            }
                            if (data.errorType) {
                                displayNotification('#notif-div', `classroom.notif.${data.errorType}LearnerHelpForm`, "error");
                            }
                        }
                        this._enableButton(btn);
                    });
            }
        } else {
            displayNotification('#notif-div', "classroom.notif.invalidUserId", "error");
        }
    }
}

let checkMail = new CheckMail();