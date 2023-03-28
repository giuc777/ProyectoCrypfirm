const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//varibles twilio
const verifySid = "VAa880bf93dacfdadb85f2dcd4b3ce2549";
const accountSid = "AC5393e88c30f0d4a65991d880f8befd6b";
const authToken = "738de323367f2ade1d350dd7f60e0f2d";
const client = require("twilio")(accountSid, authToken);

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3001, function() {
  console.log('La aplicación está escuchando en el puerto 3000.');
});

//usando el Api de Twilio
app.post("/enviar-sms", (req, res) => {

  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: "+50247013483", channel: "sms" })
    .then((verification) => {
      console.log(verification.status);
      res.redirect("/verificar");
      
    })
    .catch((error) => {
      console.log(error);
      res.send("Hubo un error al enviar el SMS");
    });
});

app.get("/verificar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "confirmacion.html"));
});

app.post("/verificar", (req, res) => {
  const otpCode = req.body.otpCode;
  client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: "+50247013483", code: otpCode })
    .then((verification_check) => {
      console.log(otpCode);
      console.log(verification_check.status);
      
      res.redirect("/secionIniciada")
    })
    .catch((error) => {
      console.log(error);
      res.send("Hubo un error al verificar el código OTP");
      
    });
});

app.get("/secionIniciada", (req, res) =>{
  res.sendFile(path.join(__dirname, "public", "IniciosacionUser.html"));
})