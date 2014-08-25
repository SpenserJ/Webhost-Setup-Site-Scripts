var mysql = require('mysql')
  , generatePassword = require('password-generator');

var Database = function Database(settings, callback) {
  var self = this;

  self.settings = settings;
  self.callback = callback;

  self.mysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MUDXKhc0zhg8lsUtPkavwUkgXCIO',
    multipleStatements: true,
  });
  self.mysql.connect();

  self.mysql.query('SHOW DATABASES', function (err, result) {
    if (err) throw err;

    var found = false, i, message;
    for (i in result) {
      if (result[i].Database === self.settings.name) {
        found = true;
        break;
      }
    }

    if (found === true) {
      message = 'The database for ' + self.settings.name + ' already exists.';
      console.log(message.red);
      return self.finished();
    }

    self.createDatabase();
  });

  self.createDatabase = function createDatabase() {
    var password = generatePassword(32, false), message;
    self.mysql.query("\
CREATE DATABASE \`" + self.settings.name + "\` /*\!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;\n\
CREATE USER '" + self.settings.name + "'@'localhost' IDENTIFIED BY '" + password + "';\n\
GRANT USAGE ON *.* TO '"+ self.settings.name + "'@'localhost' IDENTIFIED BY '" + password + "' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;\n\
GRANT ALL PRIVILEGES ON \`" + self.settings.name + "\`.* TO '" + self.settings.name + "'@'localhost';\n\
FLUSH PRIVILEGES;", function (err, result) {
      if (err) throw err;

      message = 'Created database for ' + self.settings.name;
      console.log(message.green);
      message = 'Database: ' + self.settings.name + "\n" +
                'Username: ' + self.settings.name + "\n" +
                'Password: ' + password;
      console.log(message.yellow);

      self.finished();
    });
  }

  self.finished = function finished() {
    self.mysql.end();
    self.callback();
  }
}

module.exports = Database;
