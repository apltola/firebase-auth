const admin = require('firebase-admin');

module.exports = function(req, res) {
  // verify user provided a phone
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Bad input' });
  }

  // format phone number. remove dashes and parens
  const phone = String(req.body.phone)//.replace(/[^\d]/g, "");

  // create a new user account
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(err => res.status(422).send({ error: err }));

  // respond to request saying account was created
}