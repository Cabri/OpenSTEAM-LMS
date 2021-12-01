console.log(getCookie('lng'))
i18next.use(window.i18nextXHRBackend)
    .init({
        debug: false,
        lng: getCookie('lng'),
        whitelist: ['fr', 'en', 'es', 'it'],
        fallbackLng: 'fr',
        backend: {
            loadPath: _PATH + 'assets/lang/{{lng}}/ns.json'
        }
    }, (err, t) => {
        jqueryI18next.init(i18next, $, {
            optionsAttr: 'i18n-options',
            useOptionsAttr: true,
            useDataAttrOptions: true,
            parseDefaultValueFromContent: true
        });
        console.log('localize')
        $(document).localize();
        if($("[data-toggle='tooltip']")[0]){
            $("[data-toggle='tooltip']").tooltip('dispose');
            $("[data-toggle='tooltip']").tooltip();
        }
    });

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}