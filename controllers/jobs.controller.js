const { response } = require('express');

const Job = require('../models/jobs.model');

/** ======================================================================
 *  GET JOBS
=========================================================================*/
const getJobsStatus = async(req, res = response) => {

    try {

        const type = req.query.type || 'Pendiente';
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limite) || 10;

        let jobs;

        switch (type) {

            case 'Pendiente':

                jobs = await Job.find({ type })
                    .populate('bussiness', 'name nit email phone address bid img')
                    .populate('worker', 'name cedula email phone address wid img');

                res.json({
                    ok: true,
                    jobs
                });

                break;

            case 'Aprobado':

                jobs = await Job.find({ type })
                    .populate('bussiness', 'name nit email phone address bid img')
                    .populate('worker', 'name cedula email phone address wid img');

                res.json({
                    ok: true,
                    jobs
                });

                break;

            case 'none':

                jobs = await Job.find()
                    .populate('bussiness', 'name nit email phone address bid img')
                    .populate('worker', 'name cedula email phone address wid img')
                    .skip(desde)
                    .limit(limit);

                res.json({
                    ok: true,
                    jobs
                });

                break;

            default:
                break;
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, porfavor intente nuevamente'
        });
    }

};

/** ======================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
const getJobBussiness = async(req, res = response) => {

    try {

        const bussiness = req.params.bussiness;

        const jobs = await Job.find({ bussiness })
            .populate('bussiness', 'name nit email phone address bid img')
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            jobs
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
 *  GET JOBS FOR WORKER
=========================================================================*/
const getJobWorker = async(req, res = response) => {

    try {

        const worker = req.params.worker;

        const jobs = await Job.find({ worker })
            .populate('bussiness', 'name nit email phone address bid img')
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            jobs
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
 *  POST JOB
=========================================================================*/
const createJob = async(req, res = response) => {

    try {

        const bussiness = req.params.bid;

        const job = new Job(req.body);

        job.bussiness = bussiness;

        // SAVE WORKER
        await job.save();

        res.json({
            ok: true,
            job
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
 *  PUT JOBS
=========================================================================*/
const updateJob = async(req, res = response) => {

    try {

        const jid = req.params.id;

        // SEARCH JOB
        const jobDB = await Job.findById(jid);
        if (!jobDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH JOB

        const {...campos } = req.body;

        // UPDATE
        const jobUpdate = await Job.findByIdAndUpdate(jid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            job: jobUpdate
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
 *  DELETE JOBS
=========================================================================*/
const deleteJob = async(req, res = response) => {

    try {

        const jid = req.params.job;

        // SEARCH JOB
        const jobDB = await Job.findById(jid);
        if (!jobDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH JOB

        const del = await Job.deleteOne({ _id: jid }, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            msg: 'Se ha eliminado exitosamente la oferta'
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
 *  DELETE WORKER OF JOB job
worker
=========================================================================*/
const delteWorkerJob = async(req, res = response) => {

    try {
        const jid = req.params.job;
        const worker = req.params.worker;

        const workerDel = await Job.updateOne({ _id: jid }, { $unset: { worker: worker } });

        // VERIFICAR SI SE ACTUALIZO..
        if (workerDel.nModified === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se pudo eliminar el archivo, porfavor intente de nuevo'
            });
        }

        const jobs = await Job.find({ worker })
            .populate('bussiness', 'name nit email phone address bid img')
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            jobs,
            total: jobs.length
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
    getJobsStatus,
    getJobBussiness,
    createJob,
    updateJob,
    deleteJob,
    getJobWorker,
    delteWorkerJob
}