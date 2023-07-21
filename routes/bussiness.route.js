/** =====================================================================
 *  BUSSINESS ROUTER
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
 *  GET BUSSINESSS
=========================================================================*/
router.get('/', validarJWT, getBussiness);
/** =====================================================================
 *  GET BUSSINESSS
=========================================================================*/

/** =====================================================================
 *  GET BUSSINESS ID
=========================================================================*/
router.get('/:id', validarJWT, getBussinessId);
/** =====================================================================
 *  GET BUSSINESS ID
=========================================================================*/

/** =====================================================================
 *  POST BUSSINESS
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
*  POST BUSSINESS
=========================================================================*/

/** =====================================================================
 *  PUT BUSSINESS
=========================================================================*/
router.put('/:id', [
        validarJWT,
        validarCampos
    ],
    updateBussiness
);
/** =====================================================================
*  PUT BUSSINESS
=========================================================================*/



// EXPORT
module.exports = router;