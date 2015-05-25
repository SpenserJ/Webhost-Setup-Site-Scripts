var fs = require('fs')
  , exec = require('child_process').exec
  , colors = require('colors');

var Git = function Git(settings, callback) {
  var self = this
    , child, path;

  self.settings = settings;
  self.callback = callback;
  
  path = '/var/www/shared/' + self.settings.name + '/public_html';

  fs.exists(path + '/.git', 
    function (exists) {
      if (exists === true) {
        console.log('The repository has already been initalized. Please update it manually.'.blue);
        return self.callback();
      }
      child = exec('git clone --recursive ' + self.settings.repository + ' ' + path, function(err, stdout, stderr) {
        if (err) { throw err; }
        console.log('Repository has been cloned.'.green);
        self.callback();
      });
    });
}

module.exports = Git;
