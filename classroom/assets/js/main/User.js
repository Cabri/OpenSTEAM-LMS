var UserManager = (function () {
    var Manager = {};
    Manager.user = null;

    function init() {
        var promiseToGetUser = new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/routing/Routing.php?controller=session",
                success: function (response) {
                    if (response != "null") {
                        try {
                            Manager.user = JSON.parse(response);
                        } catch (e) {
                            Manager.user = null
                        }
                    }
                    resolve("done");
                },
                error: function (response) {
                    reject(response.status);
                }
            });
        });
        return promiseToGetUser;
    }

    return {
        /**
         * Init the user manager.
         * @returns {Promise}
         */
        init: function () {
            return init();
        },
        /**
         * Gets the signed in user.
         * @returns {User}
         */
        getUser: function () {
            return Manager.user;
        }
    }

}());