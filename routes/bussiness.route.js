/** =====================================================================
 *  WORKER ROUTER
=========================================================================*/
const { Router } = require('express');
const { check } = require('express-validator');

// HELPERS
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// CONTROLLERS
const { createBussiness, updateBussiness, getBussiness, getBussinessId } = require('../controllers/bussiness.controller');

const router = Router();

/** =====================================================================
 *  GET WORKERS
=========================================================================*/
router.get('/', validarJWT, getBussiness);
/** =====================================================================
 *  GET WORKERS
=========================================================================*/

/** =====================================================================
 *  GET WORKER ID
=========================================================================*/
router.get('/:id', validarJWT, getBussinessId);
/** =====================================================================
 *  GET WORKER ID
=========================================================================*/

/** =====================================================================
 *  POST WORKER
=========================================================================*/
router.post('/', [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El nombre es obligatorio').isEmail(),
        check('password', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createBussiness
);
/** =====================================================================
*  POST WORKER
=========================================================================*/

/** =====================================================================
 *  PUT USER
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateBussiness
);
/** =====================================================================
*  PUT USER
=========================================================================*/



// EXPORT
module.exports = router;