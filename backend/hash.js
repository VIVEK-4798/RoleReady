const bcrypt = require('bcrypt');

bcrypt.hash('test', 10).then((hash) => {
  console.log("Hashed password:", hash);
});
