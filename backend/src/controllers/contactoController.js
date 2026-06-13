const pool = require('../config/db');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
const path = require('path');

// Helper para subir archivos a S3
const uploadToS3 = async (file) => {
    if (!file) return null;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    
    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
};

// Helper para eliminar archivos de S3
const deleteFromS3 = async (url) => {
    if (!url) return;
    try {
        const parts = url.split('/');
        const key = parts[parts.length - 1];
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        };
        await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
        console.error('Error al eliminar imagen de S3:', error);
    }
};

// Obtener todos los contactos
const getContactos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contactos ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los contactos' });
    }
};

// Obtener un contacto por ID
const getContactoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM contactos WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el contacto' });
    }
};

// Crear un nuevo contacto
const createContacto = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, direccion } = req.body;

        if (!nombre || !apellido || !telefono) {
            return res.status(400).json({ message: 'Nombre, apellido y teléfono son obligatorios' });
        }

        let foto_url = null;
        if (req.file) {
            foto_url = await uploadToS3(req.file);
        }

        const query = 'INSERT INTO contactos (nombre, apellido, telefono, email, direccion, foto_url) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.query(query, [nombre, apellido, telefono, email, direccion, foto_url]);
        
        res.status(201).json({ 
            message: 'Contacto creado exitosamente', 
            id: result.insertId,
            foto_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el contacto' });
    }
};

// Actualizar un contacto
const updateContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, email, direccion } = req.body;

        if (!nombre || !apellido || !telefono) {
            return res.status(400).json({ message: 'Nombre, apellido y teléfono son obligatorios' });
        }

        // Obtener la información del contacto actual para ver si tiene foto
        const [current] = await pool.query('SELECT foto_url FROM contactos WHERE id = ?', [id]);
        if (current.length === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }
        
        let foto_url = current[0].foto_url;
        
        // Si se subió una nueva foto, subimos la nueva y borramos la vieja
        if (req.file) {
            if (foto_url) {
                await deleteFromS3(foto_url);
            }
            foto_url = await uploadToS3(req.file);
        }

        const query = 'UPDATE contactos SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ?, foto_url = ? WHERE id = ?';
        const [result] = await pool.query(query, [nombre, apellido, telefono, email, direccion, foto_url, id]);
        
        res.json({ message: 'Contacto actualizado exitosamente', foto_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el contacto' });
    }
};

// Eliminar un contacto
const deleteContacto = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtener foto para borrar de S3 antes de eliminar el contacto
        const [current] = await pool.query('SELECT foto_url FROM contactos WHERE id = ?', [id]);
        if (current.length === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }
        
        const foto_url = current[0].foto_url;
        if (foto_url) {
            await deleteFromS3(foto_url);
        }

        const [result] = await pool.query('DELETE FROM contactos WHERE id = ?', [id]);
        res.json({ message: 'Contacto eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el contacto' });
    }
};

module.exports = {
    getContactos,
    getContactoById,
    createContacto,
    updateContacto,
    deleteContacto
};
