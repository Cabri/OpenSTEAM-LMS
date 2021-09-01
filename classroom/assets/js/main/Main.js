var Main = (function () {
  /**
   * This object contains all the classroom application's functionalities.
   * @private
   */
  var R = {};

  R.classroomManager = null;
  R.init = function () {
    R.classroomManager = new ClassroomManager()

    if (UserManager.getUser()) {
      return new Promise(function (resolve, reject) {
          if (UserManager.getUser().isRegular) {
            R.classroomManager.getClasses(R.classroomManager).then(function () {
              R.classroomManager.getTeacherActivities(R.classroomManager).then(function () {
              resolve("loaded");
              });
            });
          } else {
            R.classroomManager.getStudentActivities(R.classroomManager).then(function () {
              resolve("loaded");
            })
          }
      });
    } else {
      return new Promise(function (resolve) {
        resolve("loaded");
      });
    }
  };
  return {
    init: function () {
      return R.init();
    },
    /**
     * Export the classroom manager
     * @public
     */
    getClassroomManager: function () {
      return R.classroomManager;
    },

  }
}());

function filterFromUrl(a) {
  a = a.replace(/%20/gi, " ");
  a = a.split(",");
  return a
}

function getFilter() {
  var filters = {
    'search': '',
    'support': [0, 1, 2],
    'difficulty': [0, 1, 2, 3],
    'lang': ['fr', 'en']
  }
  if ($_GET("search") && $_GET("search") != null) {
    filters.search = filterFromUrl($_GET("search"))[0]
  } else {
    filters.search = ""
  }
  if ($_GET("difficulty")) {
    filters.difficulty = filterFromUrl($_GET("difficulty"))
  }
  if ($_GET("lang")) {
    filters.lang = filterFromUrl($_GET("lang"))
  }
  if ($_GET("support")) {
    filters.support = filterFromUrl($_GET("support"))
  }
  return filters
}