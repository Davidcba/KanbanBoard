const express = require('express');
const router = express.Router();
const fs = require('fs');
const json_proyects =  fs.readFileSync('files/proyectos.JSON', 'utf-8');
let proyectos = JSON.parse(json_proyects);
const json_recicle = fs.readFileSync('files/recicle-bin.JSON', 'utf-8');
let papelera = JSON.parse(json_recicle);
let json_tablero = fs.readFileSync('files/Tareas.JSON', 'utf-8');
let tablero = JSON.parse(json_tablero); // OBJ

// New Projects
router.get('/new',(req, res) => {
    res.render('proyects/new.hbs');
});

router.post('/new', (req,res) => {

  let nombre = req.body.nombre;
  let descripcion = req.body.descripcion;
  let id = proyectos.length + 1;
  let final_date = new Date();
  let date = final_date.getDay() + '/' + final_date.getMonth() + '/' + final_date.getFullYear();
  let input = { id, nombre, descripcion, date};
  if (proyectos.find(o => o.id === input.id)){
    input.id = proyectos.length + 10;
  }
  proyectos.push(input);
  const new_proy = JSON.stringify(proyectos);
  fs.writeFileSync('files/proyectos.JSON',new_proy, 'utf-8');
  res.redirect('/proyects');

});

// All projects

router.get('/',(req, res)=>{

  res.render('proyects/all.hbs', {proyectos: proyectos})

});

// Send proyects to the recicle bin

router.get('/delete/:id', (req, res) =>  {

  let id = req.params.id;

  //Write data into the recicle bin
  let input_recicle = proyectos.find(o => o.id.toString() === id);
  papelera.push(input_recicle);
  let new_deleted = JSON.stringify(papelera);
  fs.writeFileSync('files/recicle-bin.JSON',new_deleted, 'utf-8' );

  // Erase data from projects

  proyectos = proyectos.filter(proyecto => proyecto.id.toString() !== req.params.id);
  const json_proyects = JSON.stringify(proyectos);
  fs.writeFileSync('files/proyectos.JSON',json_proyects, 'utf-8' );

  //Redirect to main page
  res.redirect('/proyects');

});
// Filter proyects search
router.get('/filter', (req, res) => {

    let filtro = req.body.buscar;
    let filtrados = proyectos.filter(o => o.nombre === filtro.toString());
    console.log(filtrados);
    res.render('proyects/all.hbs', {proyectos:  filtrados});

});



router.get('/recycle-bin', (req, res) => {

  res.render('proyects/recycle-bin.hbs', {papelera});

});

// Erase proyects from the recycle bin

router.get('/recycle-bin/delete/:id', (req, res) =>{


  let id = req.params.id;
  papelera = papelera.filter(o => o.id.toString() !== id);
  tablero = tablero.filter(obj => obj.id_Proyecto.toString() !== id.toString());
  let json_tablero = JSON.stringify(tablero);
  fs.writeFileSync('files/Tareas.JSON', json_tablero,'utf-8');
  const json_recicle = JSON.stringify(papelera);
  fs.writeFileSync('files/recicle-bin.JSON',json_recicle, 'utf-8' );
  res.redirect('/proyects/recycle-bin')

});


// Restore proyects from the recycle bin

router.get('/recycle-bin/restore/:id', (req, res) =>{
  let id = req.params.id;

  //Write data into projects
  let input_proy = papelera.find(o => o.id.toString() === id);
  proyectos.push(input_proy);
  let restored = JSON.stringify(proyectos);
  fs.writeFileSync('files/proyectos.JSON',restored, 'utf-8' );

  //Erase the data from the Bin

  papelera = papelera.filter(o => o.id.toString() !== id);
  const json_papelera = JSON.stringify(papelera);
  fs.writeFileSync('files/proyectos.JSON',json_papelera, 'utf-8' );



  res.redirect('/proyects/recycle-bin');
});





module.exports = router;