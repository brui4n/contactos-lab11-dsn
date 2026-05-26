const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

router.get('/', contactoController.getContactos);
router.get('/:id', contactoController.getContactoById);
router.post('/', contactoController.createContacto);
router.put('/:id', contactoController.updateContacto);
router.delete('/:id', contactoController.deleteContacto);

module.exports = router;
