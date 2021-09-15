const mainSuperAdmin = (function () {
    /**
     * This object contains all the superadmin application's functionalities.
     * @private
     */
    const S = {};
    S.superadminManager = null;
    S.init = function () {
        return new Promise(function (resolve, reject) {
            S.superadminManager = new SuperAdminManager();
            if (UserManager.getUser()) {
                S.superadminManager.isAdmin().then((res) => {
                    if (res.Admin === true) {
                        $('#superadmin-switch-button').show();
                        $('#superAdmin_options').show();
                        resolve("loaded");
                    } else {
                        resolve("loaded");
                    }
                })
            }
        })
    };

    return {
        init: function () {
            return S.init();
        },
        /**
         * Export the superadmin manager
         * @public
         */
        getSuperAdminManager: function () {
            return S.superadminManager;
        },

    }
}());

const mainGroupAdmin = (function () {
    /**
     * This object contains all the groupAdmin application's functionalities.
     * @private
     */
    const G = {};
    G.groupadminmanager = null;
    G.init = function () {
        return new Promise(function (resolve, reject) {
            G.groupadminmanager = new GroupAdminManager()
            if (UserManager.getUser()) {
                G.groupadminmanager.isGroupAdmin().then((res) => {
                    if (res.GroupAdmin === true) {
                        $('#groupadmin-switch-button').show();
                        $('#groupAdmin_options').show();
                        resolve("loaded");
                    } else {
                        resolve("loaded");
                    }
                })
            }
        })
    };

    return {
        init: function () {
            return G.init();
        },
        /**
         * Export the groupadmin manager
         * @public
         */
        getGroupAdminManager: function () {
            return G.groupadminmanager;
        },
    }
}());