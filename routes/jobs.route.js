/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { createJob, updateJob, getJobBussiness, deleteJob } = require('../controllers/jobs.controller');

const router = Router();

/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/
router.get('/all/:bussiness', [
        validarJWT,
    ],
    getJobBussiness
);
/** =====================================================================
 *  GET JOBS OF BUSSINESS
=========================================================================*/

/** =====================================================================
 *  POST JOB
=========================================================================*/
router.post('/', [
        validarJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createJob
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
    updateJob
);
/** =====================================================================
*  PUT JOB
=========================================================================*/

/** =====================================================================
 *  DELETE JOB
=========================================================================*/
router.delete('/:job', [
        validarJWT,
    ],
    deleteJob
);
/** =====================================================================
*  DELETE JOB
=========================================================================*/



// EXPORT
module.exports = router;