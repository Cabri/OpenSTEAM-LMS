const mainManager = (function () {
    /**
     * This object contains all the manager application's functionalities.
     * @private
     */
    const S = {};
    S.managermanager = null;
    S.init = function () {
        return new Promise(function (resolve, reject) {
            S.managermanager = new managerManager();
            if (UserManager.getUser()) {
                S.managermanager.isAdmin().then((res) => {
                    if (res.Admin === true) {
                        $('#manager-switch-button').show();
                        $('#manager_options').show();
                        resolve(true);
                    } else {
                        resolve(false);
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
         * Export the manager manager
         * @public
         */
        getmanagerManager: function () {
            return S.managermanager;
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
                        resolve(true);
                    } else {
                        resolve(false);
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