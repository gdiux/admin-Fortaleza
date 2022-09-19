const { response } = require('express');

const User = require('../models/users.model');
const Client = require('../models/clients.model');
const Worker = require('../models/worker.model');
const Bussiness = require('../models/bussiness.model');
const Job = require('../models/jobs.model');

/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/
const search = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp(busqueda, 'i');
    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 50;

    let data = [];
    let total;

    const numeros = /^[0-9]+$/;
    let number = false;

    if (busqueda.match(numeros)) {
        number = true;
    } else {
        number = false;
    }

    switch (tabla) {

        case 'users':

            // data = await User.find({ name: regex }); examples
            [data, total] = await Promise.all([
                User.find({
                    $or: [
                        { usuario: regex },
                        { name: regex },
                        { role: regex },
                        { address: regex }
                    ]
                }),
                User.countDocuments()
            ]);
            break;


        case 'clients':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Client.find({
                    $or: [
                        { name: regex },
                        { cedula: regex },
                        { phone: regex },
                        { email: regex },
                        { address: regex },
                        { city: regex },
                        { Department: regex }
                    ]
                }),
                Client.countDocuments()
            ]);
            break;


        case 'workers':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Worker.find({
                    $or: [
                        { name: regex },
                        { cedula: regex },
                        { phone: regex },
                        { email: regex },
                        { address: regex },
                        { city: regex },
                        { department: regex },
                        { type: regex },
                        { description: regex },
                    ]
                }),
                Worker.countDocuments()
            ]);
            break;

        case 'bussiness':

            // data = await Client.find({ name: regex });
            [data, total] = await Promise.all([
                Bussiness.find({
                    $or: [
                        { name: regex },
                        { nit: regex },
                        { phone: regex },
                        { email: regex },
                        { address: regex },
                        { city: regex },
                        { department: regex },
                        { type: regex }
                    ]
                }),
                Bussiness.countDocuments()
            ]);
            break;

        case 'jobs':

            // COMPROBAR SI ES NUMERO
            if (number) {

                [data, total] = await Promise.all([
                    Job.find({
                        $or: [
                            { control: busqueda }
                        ]
                    })
                    .populate('bussiness', 'name nit email phone address bid')
                    .populate('worker', 'name cedula email phone address wid'),
                    Job.countDocuments()
                ]);

            } else {
                [data, total] = await Promise.all([
                    Job.find({
                        $or: [
                            { name: regex },
                            { cedula: regex },
                            { phone: regex },
                            { email: regex },
                            { address: regex },
                            { city: regex },
                            { department: regex },
                            { type: regex }
                        ]
                    })
                    .populate('bussiness', 'name nit email phone address bid')
                    .populate('worker', 'name cedula email phone address wid'),
                    Job.countDocuments()
                ]);
            }


            break;



        default:
            res.status(400).json({
                ok: false,
                msg: 'Error en los parametros de la busquedad'
            });
            break;

    }

    res.json({
        ok: true,
        resultados: data,
        total
    });

};
/** =====================================================================
 *  SEARCH FOR TABLE
=========================================================================*/


// EXPORTS
module.exports = {
    search
};