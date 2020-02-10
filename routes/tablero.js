const express = require('express');
const router = express.Router();
const fs = require('fs');
const sessionStorage = require('sessionstorage');

let json_tablero = fs.readFileSync('files/Tareas.JSON', 'utf-8');
let tablero = JSON.parse(json_tablero); // OBJ

router.get('/:id', (req, res) => {
    let id = req.params.id;
    sessionStorage.setItem('idProyecto', id.toString());
    let tablero_to_do = tablero.filter(o => o.id_Proyecto === id.toString() && o.estado === 'to_do');
    let tablero_done = tablero.filter(o => o.id_Proyecto === id.toString() && o.estado === 'done');
    let tablero_progress = tablero.filter(o => o.id_Proyecto === id.toString() && o.estado === 'in_progress');

    res.render('dashboard/view.hbs', {to_do: tablero_to_do, progress: tablero_progress, done: tablero_done});

});

// Move to Do

router.get('/move_to_do/:id_Proyecto/:estado/:titulo',(req, res)=>{

   let id = req.params.id_Proyecto;
   let estado = req.params.estado;
   let titulo = req.params.titulo;

   //Write the edited data into to_do list
   let update = tablero.find(o => o.id_Proyecto === id.toString() && o.estado === estado.toString() && o.titulo === titulo.toString());
    update.estado = 'to_do';
    json_tablero = JSON.stringify(tablero);
    fs.writeFileSync('files/Tareas.JSON', json_tablero,'utf-8');

    res.redirect('/dashboard/'+id)

});

// Move In progress

router.get('/move_progress/:id_Proyecto/:estado/:titulo',(req, res)=>{

    let id = req.params.id_Proyecto;
    let estado = req.params.estado;
    let titulo = req.params.titulo;

    //Write the edited data into IN_PROGRESS list

    let update = tablero.find(o => o.id_Proyecto === id.toString() && o.estado === estado.toString() && o.titulo === titulo.toString());
    update.estado = 'in_progress' ;
    json_tablero = JSON.stringify(tablero);
    fs.writeFileSync('files/Tareas.JSON', json_tablero,'utf-8');

    res.redirect('/dashboard/'+id)

});

// Move to done
router.get('/move_done/:id_Proyecto/:estado/:titulo',(req, res)=>{

    let id = req.params.id_Proyecto;
    let estado = req.params.estado;
    let titulo = req.params.titulo;

    //Write the  data into done list

    let update = tablero.find(o => o.id_Proyecto === id.toString() && o.estado === estado.toString() && o.titulo === titulo.toString());
    update.estado = 'done';
    json_tablero = JSON.stringify(tablero);
    fs.writeFileSync('files/Tareas.JSON', json_tablero,'utf-8');

    res.redirect('/dashboard/'+id)

});


router.get('/dashboard/new',(req, res) => {

    res.render('dashboard/new.hbs');

});

// New
router.post('/dashboard/new', (req,res) => {

   let id_Proyecto = sessionStorage.getItem('idProyecto');
   let color = req.body.color;
   let descripcion = req.body.descripcion;
   let titulo = req.body.titulo;
   let estado = 'to_do';

   let input_board = {id_Proyecto, titulo, descripcion, estado, color};
   tablero.push(input_board);
   let new_task = JSON.stringify(tablero);
   fs.writeFileSync('files/Tareas.Json', new_task, 'utf-8');
   sessionStorage.clear();
   res.redirect('/proyects');

});
// Delete

router.get('/delete/:id_Proyecto/:titulo', (req, res) =>{

    let id = req.params.id_Proyecto;
    let titulo = req.params.titulo;

    tablero = tablero.filter(o => o.id_Proyecto.toString() !== id.toString() && o.titulo !== titulo);
    const json_tablero = JSON.stringify(tablero);
    fs.writeFileSync('files/recicle-bin.JSON',json_tablero, 'utf-8' );

    res.redirect('/proyects');

});



// Edit

router.get('/edit/:id_Proyecto/:titulo/:descripcion', (req, res) => {
    let id = req.params.id_Proyecto;
    let titulo = req.params.titulo;
    let descripcion = req.params.descripcion;
    let prev = tablero.find(o => o.id_Proyecto === id  && o.titulo === titulo.toString() && o.descripcion === descripcion.toString());
    let color = prev.color;
    color.toString();
    let input = {titulo, descripcion, color};
    let arr = [input];

   res.render('dashboard/edit.hbs', {arr});

});

router.post('/edit/:id_Proyecto/:titulo/:descripcion', (req,res) => {

    let id = req.params.id_Proyecto;
    let prev_titulo = req.params.titulo;
    let prev_descripcion = req.params.descripcion;
    let prev = tablero.find(o => o.id_Proyecto === id  && o.titulo === prev_titulo.toString() && o.descripcion === prev_descripcion.toString());
    let prev_color = prev.color;
    let color = req.body.color;
    let descripcion = req.body.descripcion;
    let titulo = req.body.titulo;

    let update = tablero.find(o => o.id_Proyecto === id  && o.titulo === prev_titulo.toString() && o.descripcion === prev_descripcion.toString() &&
                               o.color === prev_color.toString());
    update.titulo = titulo;
    update.descripcion = descripcion;
    update.color = color;

    json_tablero = JSON.stringify(tablero);
    fs.writeFileSync('files/Tareas.JSON', json_tablero,'utf-8');

    res.redirect('/proyects');
});



module.exports = router;