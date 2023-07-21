const { response } = require('express');
const bcrypt = require('bcryptjs');

const Worker = require('../models/worker.model');

/** ======================================================================
 *  GET WORKER
=========================================================================*/
const getWorkers = async(req, res = response) => {

    try {

        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limite) || 10;

        const [workers, total] = await Promise.all([

            Worker.find()
            .skip(desde)
            .limit(limit),

            Worker.countDocuments()
        ]);

        res.json({
            ok: true,
            workers,
            total
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });

    }

};

/** ======================================================================
 *  GET WORKER ID
=========================================================================*/
const getWorkerId = async(req, res = response) => {

    try {

        const wid = req.params.id;

        const worker = await Worker.findById(wid);

        if (!worker) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun trabajador con este ID'
            });
        }

        res.json({
            ok: true,
            worker
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


/** ======================================================================
 *  EXPORT EXCEL WORKER
=========================================================================*/
const excelWorker = async(req, res = response) => {

    try {

        const [workers, total] = await Promise.all([
            Worker.find({ status: true }, 'name cedula phone email address city type barrio'),
            Worker.countDocuments()
        ]);

        res.json({
            ok: true,
            workers,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


/** ======================================================================
 *  POST WORKER
=========================================================================*/
const createWorker = async(req, res = response) => {

    try {

        const { name, email, password } = req.body;

        const validateEmail = await Worker.findOne({ email });
        if (validateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existen un trabajador con este correo electronico'
            });
        }

        const worker = new Worker(req.body);

        // ENCRYPTAR PASSWORD
        const salt = bcrypt.genSaltSync();
        worker.password = bcrypt.hashSync(password, salt);

        // SAVE WORKER
        await worker.save();

        worker.password = '******';

        res.json({
            ok: true,
            worker
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

}

/** ======================================================================
 *  PUT WORKER
=========================================================================*/
const updateWorker = async(req, res = response) => {

    try {

        const wid = req.params.id;

        // SEARCH USERS
        const workerDB = await Worker.findById(wid);
        if (!workerDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningun usuario con este ID'
            });
        }
        // SEARCH USER

        // VALIDATE USER
        const { password, email, ...campos } = req.body;

        if (password) {
            // ENCRYPTAR PASSWORD
            const salt = bcrypt.genSaltSync();
            campos.password = bcrypt.hashSync(password, salt);
        }

        if (email) {
            campos.email = email.toLowerCase();
        }

        // UPDATE
        const workerUpdate = await Worker.findByIdAndUpdate(wid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            worker: workerUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};


// EXPORTS
module.exports = {
    getWorkers,
    updateWorker,
    getWorkerId,
    excelWorker
}