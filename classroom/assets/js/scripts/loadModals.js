{
    var pseudoModal = new Modal("a")
    $.each(classroomModals, (element, modal) => {
        const modalEl = new Modal(element, modal);
        document.querySelector('body').appendChild(modalEl);
    });
    $(".vitta-modal").draggable();

    $(document).on('keydown', function (e) {
        if (e.keyCode === 27)
            pseudoModal.closeLatestModal();
    });

    // Useful for adding students from a csv file
    $("#importcsv-fileinput").change(function() {
        filename = this.files[0]?.name;
        if(filename) {
            $("#importcsv-fileinput-classroom-filename").text(filename);
        }
    });
    
    $("#importcsv-fileinput-classroom-create").change(function() {
        filename = this.files[0]?.name;
        if(filename) {
            $("#importcsv-fileinput-classroom-create-filename").text(filename);
        }
    });

    $("#importcsv-fileinput-classroom-update").change(function() {
        filename = this.files[0]?.name;
        if(filename) {
            $("#importcsv-fileinput-classroom-update-filename").text(filename);
        }
    });
}