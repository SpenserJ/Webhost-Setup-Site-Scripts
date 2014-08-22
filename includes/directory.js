var fs = require('fs')
  , colors = require('colors');

var directory = function WebDir(settings, callback) {
  var self = this;

  self.finishedCount = 0;
  self.settings = settings;
  self.callback = callback;

  fs.exists('/var/www/shared/' + self.settings.name,
    function (exists) {
      if (exists) {
        var message = 'Folder for ' + self.settings.name + ' already exists';
        console.log(message.blue);
        self.mkdirLogs();
        self.mkdirHTML();
        return;
      }

      fs.mkdir('/var/www/shared/' + self.settings.name, '0775',
        function (err) {
          if (err) throw err;
          var message = 'Created folder for ' + self.settings.name;
          console.log(message.green);
          self.mkdirLogs();
          self.mkdirHTML();
        });
    });

  self.mkdirLogs = function mkdirLogs() {
    fs.exists('/var/www/shared/' + self.settings.name + '/logs',
      function (exists) {
        if (exists) {
          var message = 'Folder logs for ' + self.settings.name + ' already exists';
          console.log(message.blue);
          return self.finished();
        }

        fs.mkdir('/var/www/shared/' + self.settings.name + '/logs', '0775',
          function (err) {
            if (err) throw err;
            var message = 'Creating logs folder for ' + self.settings.name;
            console.log(message.green);
            self.finished();
          });
      });
  }

  self.mkdirHTML = function mkdirHTML() {
    fs.exists('/var/www/shared/' + self.settings.name + '/public_html',
      function (exists) {
        if (exists) {
          var message = 'Folder public_html for ' + self.settings.name + ' already exists';
          console.log(message.blue);
          return self.finished();
        }

        fs.mkdir('/var/www/shared/' + self.settings.name + '/public_html', '0775',
          function (err) {
            if (err) throw err;
            var message = 'Creating public_html folder for ' + self.settings.name;
            console.log(message.green);
            self.finished();
          });
      });
  }

  self.finished = function finished() {
    self.finishedCount++;
    if (self.finishedCount === 2) {
      self.callback();
    }
  }
}

module.exports = directory;
