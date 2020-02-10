const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const fs = require('fs');
const json_users =  fs.readFileSync('files/users.JSON', 'utf-8');
const  users = JSON.parse(json_users);


// Register

router.get('/singup',(req, res)=>{
   res.render('auth/singup.hbs');
});

router.post('/singup', (req, res) => {
   let email = req.body.email;
   let password = req.body.password;
   let id = users.length + 1;
   password.toString();
   let hash = bcrypt.hashSync(password, 10);
   let input = {id,email, hash};
   users.push(input);
   const new_user = JSON.stringify(users);
   fs.writeFileSync('files/users.JSON',new_user, 'utf-8');
   res.redirect('/').send('Ok');
});

// Login

router.get('/', (req,res) => {
   res.render('auth/login.hbs')
});

router.post('/',(req,res)=>{

   let email = req.body.email;
   let password = req.body.password;
   let storage = users.find(o => o.email === email);

   if (storage.email === email){
   let hash = storage.hash;
      if(bcrypt.compareSync(password, hash)) {
         res.redirect('/proyects');
      } else {
         res.send('Credentials not valid');
      }
   }else {
      res.send('Credentials not valid');
   }



});

module.exports = router;