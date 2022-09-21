/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { getEntrevistasStatus, getEntrevistasWorker, createEntrevista, updateEntrevista, deleteEntrevista } = require('../controllers/entrevistas.controller');


const router = Router();

/** =====================================================================
 *  GET JOBS STATUS
=========================================================================*/
router.get('/query', [
        validarJWT,
    ],
    getEntrevistasStatus
);
/** =====================================================================
*  GET JOBS STATUS
=========================================================================*/


/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
router.get('/worker/:worker', [
        validarJWT,
    ],
    getEntrevistasWorker
);
/** =====================================================================
*  GET JOBS OF BUSSINESS
=========================================================================*/

/** =====================================================================
 *  POST JOB
=========================================================================*/
router.post('/', [
        validarJWT,
        validarCampos
    ],
    createEntrevista
);
/** =====================================================================
*  POST JOB
=========================================================================*/

/** =====================================================================
 *  PUT JOB
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateEntrevista
);
/** =====================================================================
*  PUT JOB
=========================================================================*/

/** =====================================================================
 *  DELETE JOB
=========================================================================*/
router.delete('/:id', [
        validarJWT,
    ],
    deleteEntrevista
);
/** =====================================================================
*  DELETE JOB
=========================================================================*/



// EXPORT
module.exports = router;