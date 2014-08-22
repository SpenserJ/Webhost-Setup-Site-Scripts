var swig = require('swig')
  , fs = require('fs')
  , exec = require('child_process').exec;

var Nginx = function Nginx(settings, callback) {
  var self = this;

  self.settings = settings;
  self.callback = callback;

  var template = swig.compileFile('templates/site.conf.swig')
    , output = template(self.settings);

  fs.writeFile('/etc/nginx/sites-available/' + self.settings.name + '.conf',
    output, function (err) {
      if (err) throw err;
      console.log('Configured Nginx site for ' + self.settings.name);
      self.enable();
    });

  self.enable = function enable() {
    fs.exists('/etc/nginx/sites-enabled/' + self.settings.name + '.conf',
      function (exists) {
        if (exists) {
          console.log('Nginx site for ' + self.settings.name + ' already enabled');
          return self.callback();
        }

        fs.symlink('/etc/nginx/sites-available/' + self.settings.name + '.conf',
                   '/etc/nginx/sites-enabled/' + self.settings.name + '.conf',
          function(err) {
            if (err) throw err;
            console.log('Enabled Nginx site for ' + self.settings.name);
            self.callback();
          });
      });
  }

  self.reload = function reload() {
    var child = exec('service nginx reload', function (err, stdout, stderr) {
      if (err) throw err;
      console.log(stdout, stderr);
    });
  }
}

module.exports = Nginx;
