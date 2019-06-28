const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone and code must be provided' });
  }

  const phone = String(req.body.phone)//.replace(/[^\d]/g, "");
  const code = parseInt(req.body.code);

  admin.auth().getUser(phone)
    .then(() => {
      const ref = admin.database().ref('users/' + phone);
      return ref.on('value', snapshot => {
        ref.off();
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'code not valid' });
        }

        // if we get here, user has submitted valid code
        console.log('HALOOOOO LOGI????????')
        ref.update({ codeValid: false });
        admin.auth().createCustomToken(phone)
          .then(token => res.send({ token: token }))
          .catch(err => res.status(500).send({ error: err }));
      });
    })
    .catch(err => {
      return res.status(422).send({ error: err });
    })
}