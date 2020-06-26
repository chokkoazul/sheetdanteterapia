const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log('SlipSlap REST API listening on port', port);
});

app.get('/', async (req, res) => {
    //accessSpreadsheet();
    addSpreadsheet();
    //const id = req.params.id;
    //const ingredient = await getIngredient(id);
    let retVal;
    retVal = {status: 'success', data: 'ok'};
    //if (ingredient) {
    //  retVal = {status: 'success', data: {ingredient: ingredient}};
    //}
    //else {
    //  res.status(404);
    //  retVal = {status: 'fail', data: {title: `Ingredient ${id} not found`}};
    //}
    res.json(retVal);
  });

app.post('/tarea', function (req, res) {
    console.log("dia: ", req.body.dia);
    console.log("tarea: ", req.body.tarea);
    console.log("estado: ", req.body.estado);

    let dia = req.body.dia;
    let tarea = req.body.tarea;
    let estado = req.body.estado;
    
    addSpreadsheet(dia, tarea, estado);
    let retVal;
    retVal = {status: 'success', data: 'ok'};

    res.status(201).json(retVal);
});

app.post('/alert', function (req, res) {
    

    let unix_timestamp = req.body.result._time;
    
var date = new Date(unix_timestamp * 1000);

let diaformat = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let fecha = diaformat;
    let efectividad = req.body.result.efectividad;
    let alarma = req.body.search_name;
    
    addSpreadSheetAlert(alarma, efectividad, fecha);
    let retVal;
    retVal = {status: 'success', data: 'ok'};

    res.status(200).json(retVal);
});

app.post('/efectividadmv', function (req, res) {
    
    let date = new Date(req.body.result.fecha_consulta);

    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()

    let fecha = day + '-' + month + '-' + year;

    let efectividad = req.body.result.efectividad.replace(".", ",").concat("%");

    addSpreadSheetEfectividadMV(efectividad, fecha);
    let retVal;
    retVal = {status: 'success', data: 'ok'};

    res.status(200).json(retVal);
});

function printtarea(tarea){
    console.log("dia: ", tarea.dia);
    console.log("tarea: ", tarea.tarea);
    console.log("estado: ", tarea.estado);
    console.log("-----------------");
}

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet('1_cSpvwEV98cLqCHKQXZjvcFy_Y5Csdn8Q-Xp0vSl7xQ');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    console.log("Title: "+ sheet.title + "Rows: "+ sheet.rowCount);

    const rows = await promisify(sheet.getRows)({
        offset: 1
    });

    rows.forEach(row => {
        printtarea(row);
    });
}

async function addSpreadsheet(dia, tarea, estado) {
    const doc = new GoogleSpreadsheet('1_cSpvwEV98cLqCHKQXZjvcFy_Y5Csdn8Q-Xp0vSl7xQ');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    
    const row = {
        dia : dia,
        tarea : tarea,
        estado : estado
    };

    await promisify(sheet.addRow)(row);
}

async function addSpreadSheetAlert(alarma, efectividad, fecha) {
    const doc = new GoogleSpreadsheet('1_cSpvwEV98cLqCHKQXZjvcFy_Y5Csdn8Q-Xp0vSl7xQ');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[1];
    
    const row = {
        alarma : alarma,
        efectividad : efectividad,
        fecha : fecha
    };

    await promisify(sheet.addRow)(row);
}

async function addSpreadSheetEfectividadMV(efectividad, fecha) {
    const doc = new GoogleSpreadsheet('1y2a1EQtNef9Ox2v8yG75H8E3hhHARVH4zQE9suCA3XU');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[5];
    
    const row = {
        fecha : fecha,
        efectividad : efectividad
    };

    await promisify(sheet.addRow)(row);
}

