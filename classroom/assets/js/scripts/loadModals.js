{
    var pseudoModal = new Modal("a")
    $.each(classroomModals, (element, modal) => {
        document.querySelector('body').appendChild(new Modal(element, modal));
    });
    $(".vitta-modal").draggable();

    $(document).on('keydown', function (e) {
        if (e.keyCode === 27)
            pseudoModal.closeLatestModal();
    });
}
// if (UserManager.getUser()) {
//     setInterval(checkNewThings, 60000)
// }

// function checkNewThings() {
//     if (UserManager.getUser().isRegular == true) {
//         Main.getClassroomManager().getChangesForTeacher().then(function (changes) {
//             if (changes != false) {
//                 Main.getClassroomManager()._myClasses = changes.classrooms
//                 if (ClassroomSettings.classroom) {
//                     let students = getClassroomInListByLink(ClassroomSettings.classroom)[0].students
//                     displayStudentsInClassroom(students)
//                 }
//                 displayNotification('#notif-div', "classroom.notif.corrections", "success")
//             }
//             //intègre changes à l'html
//         })
//     } else {
//         /*  Main.getClassroomManager().checkChangeForStudent().then(function (changes) {
//              //intègre changes à l'html
//          }) */
//     }
// }