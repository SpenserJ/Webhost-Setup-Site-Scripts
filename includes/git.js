var gift = require('gift')
  , fs = require('fs')
  , colors = require('colors');

var Git = function Git(settings, callback) {
  var self = this;

  self.settings = settings;
  self.callback = callback;

  fs.exists('/var/www/shared/' + self.settings.name + '/public_html/.git', 
    function (exists) {
      if (exists === true) {
        console.log('The repository has already been initalized. Please update it manually.'.blue);
        return self.callback();
      }

      gift.clone(self.settings.repository,
        '/var/www/shared/' + self.settings.name + '/public_html',
        function (err, repo) {
          if (err) throw err;
          console.log('Repository has been cloned.'.green);
          self.callback();
        });
    });
}

module.exports = Git;
