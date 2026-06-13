const express = require('express');
const router = express.Router();
const multer = require('multer');
const contactoController = require('../controllers/contactoController');

// Configuración de multer usando almacenamiento en memoria
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Limitar a 5MB
    }
});

router.get('/', contactoController.getContactos);
router.get('/:id', contactoController.getContactoById);
router.post('/', upload.single('foto'), contactoController.createContacto);
router.put('/:id', upload.single('foto'), contactoController.updateContacto);
router.delete('/:id', contactoController.deleteContacto);

module.exports = router;
