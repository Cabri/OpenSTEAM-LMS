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