const { response } = require('express');
const { sendMail } = require('../helpers/send-mail');

const Entrevista = require('../models/entrevista.model');
const Worker = require('../models/worker.model');

/** ======================================================================
 *  GET ENTREVISTAS
=========================================================================*/
const getEntrevistasStatus = async(req, res = response) => {

    try {

        let status = req.query.status || 'false';
        let confirm = req.query.confirm || 'none';

        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limite) || 10;

        let entrevistas;

        if (status === 'false') {
            status = false;
        } else {
            status = true;
        }

        if (confirm === 'false') {
            confirm = false;
        } else if (confirm === 'true') {
            confirm = true;
        } else {
            confirm = 'none';
        }

        // ENTREVISTAS COFIRMADAS O SIN CONFIRMAR
        if (confirm === 'none') {
            entrevistas = await Entrevista.find({ status: false, cancel: false })
                .populate('worker', 'name cedula email phone address wid img');
        } else {
            entrevistas = await Entrevista.find({ status, confirm, cancel: false })
                .populate('worker', 'name cedula email phone address wid img');
        }

        res.json({
            ok: true,
            entrevistas
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
 *  GET ENTREVISTAS FOR WORKER
=========================================================================*/
const getEntrevistasWorker = async(req, res = response) => {

    try {

        const worker = req.params.worker;

        const entrevistas = await Entrevista.find({ worker })
            .populate('worker', 'name cedula email phone address wid img');

        res.json({
            ok: true,
            entrevistas
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
 *  POST ENTREVISTA
=========================================================================*/
const createEntrevista = async(req, res = response) => {

    try {

        const { trabajador, email, day } = req.body;
        const entrevista = new Entrevista(req.body);

        // PARAMETROS DEL EMAIL
        const subject = 'Entrevista de trabajo';
        const msg = 'Se ha enviado un email al trabajador con la fecha de la entrevista';
        const html = `<div style="box-sizing:border-box;margin:0;font-family: Montserrat,-apple-system,BlinkMacSystemFont;font-size:1rem;font-weight:400;line-height:1.5;text-align:left;background-color:#fff;color:#333">
                <div class="adM">
                    <center>
                        <img src="https://grupofortalezasas.com/assets/img/logo/logo.webp" style="max-width: 250px;">
                    </center>
                </div>
                <div style="box-sizing:border-box;width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto;max-width:620px">
                    <div class="adM">
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div class="adM">
                        </div>
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center;padding-top:20px">
    
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin-top:40px;padding:20px 0;background-color:#2d2d2d;color:#fff">
                            <h2 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;text-align:center!important">Cita de Entrevista</h2>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                            <h3 style="text-transform: capitalize; box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:2rem;margin:20px 0">Hola, ${trabajador}</h3>
                            <h5 style="box-sizing:border-box;margin-top:0;margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;font-size:1.25rem;margin:20px 0">Se te ha asignado una entrevista para la siguiente fecha:</h5>
                            <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                                <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;text-align:center">
                                </div>
                            </div>
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Fecha de la entrevista: ${day}.</p>
                            
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Con el siguiente link tambien puedes acceder a la entrevista:</p>
                            <p>${entrevista.enlace}</p>
                        </div>
                    </div>
                    <div style="box-sizing:border-box;display:-webkit-box;display:-ms-flexbox;display:flex">
                        <div style="box-sizing:border-box;width:100%;min-height:1px;padding-right:15px;padding-left:15px;margin:40px 0;text-align:center">
                            <p style="box-sizing:border-box;margin-top:0;margin-bottom:1rem">Si esta solicitud se ha enviado sin su consentimiento, puede ignorar este correo electrónico ó eliminarlo. </p>
                        </div>
                    </div>
    
                </div>
                </div>`;
        // PARAMETROS DEL EMAIL

        const send_mail = await sendMail(email, subject, html, msg);

        console.log(send_mail);

        // if (!send_mail.ok) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: send_mail.msg
        //     });
        // }

        // SAVE WORKER
        await entrevista.save();

        res.json({
            ok: true,
            entrevista
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
 *  PUT ENTREVISTAS
=========================================================================*/
const updateEntrevista = async(req, res = response) => {

    try {

        const eid = req.params.id;

        // SEARCH ENTREVISTA
        const entrevistaDB = await Entrevista.findById(eid);
        if (!entrevistaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna entrevista este ID'
            });
        }
        // SEARCH ENTREVISTA

        const {...campos } = req.body;

        // UPDATE
        const entrevistaUpdate = await Entrevista.findByIdAndUpdate(eid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            entrevista: entrevistaUpdate
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
 *  DELETE ENTREVISTAS
=========================================================================*/
const deleteEntrevista = async(req, res = response) => {

    try {

        const eid = req.params.id;

        // SEARCH ENTREVISTA
        const entrevistaDB = await Entrevista.findById(eid);
        if (!entrevistaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna oferta de empleo con este ID'
            });
        }
        // SEARCH ENTREVISTA

        const del = await Entrevista.deleteOne({ _id: eid }, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            msg: 'Se ha eliminado exitosamente la entrevista'
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
    getEntrevistasStatus,
    getEntrevistasWorker,
    createEntrevista,
    updateEntrevista,
    deleteEntrevista
}