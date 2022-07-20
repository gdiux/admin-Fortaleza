/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { updateWorker, getWorkers } = require('../controllers/worker.controller');

const router = Router();

/** =====================================================================
 *  GET WORKERS
=========================================================================*/
router.get('/', validarJWT, getWorkers);
/** =====================================================================
 *  GET WORKERS
=========================================================================*/

/** =====================================================================
 *  PUT USER
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateWorker
);
/** =====================================================================
*  PUT USER
=========================================================================*/



// EXPORT
module.exports = router;