var swig = require('swig')
  , fs = require('fs')
  , exec = require('child_process').exec
  , colors = require('colors');

var Nginx = function Nginx(settings, callback) {
  var self = this;

  self.settings = settings;
  self.callback = callback;

  var template = swig.compileFile(__dirname + '/../templates/site.conf.swig')
    , output = template(self.settings);

  fs.writeFile('/etc/nginx/sites-available/' + self.settings.name + '.conf',
    output, function (err) {
      if (err) throw err;
      var message = 'Configured Nginx site for ' + self.settings.name;
      console.log(message.green);
      self.enable();
    });

  self.enable = function enable() {
    fs.exists('/etc/nginx/sites-enabled/' + self.settings.name + '.conf',
      function (exists) {
        if (exists) {
          var message = 'Nginx site for ' + self.settings.name + ' already enabled';
          console.log(message.blue);
          return self.callback();
        }

        fs.symlink('/etc/nginx/sites-available/' + self.settings.name + '.conf',
                   '/etc/nginx/sites-enabled/' + self.settings.name + '.conf',
          function(err) {
            if (err) throw err;
            var message = 'Enabled Nginx site for ' + self.settings.name;
            console.log(message.green);
            self.callback();
          });
      });
  }

  self.reload = function reload() {
    var child = exec('sudo service nginx reload', function (err, stdout, stderr) {
      if (err) throw err;
      if (stdout.indexOf('fail') > -1) {
        console.log(stdout.red);
      } else {
        console.log(stdout.green);
      }
    });
  }
}

module.exports = Nginx;
