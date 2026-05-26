const pool = require('../config/db');

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

        const query = 'INSERT INTO contactos (nombre, apellido, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(query, [nombre, apellido, telefono, email, direccion]);
        
        res.status(201).json({ 
            message: 'Contacto creado exitosamente', 
            id: result.insertId 
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

        const query = 'UPDATE contactos SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?';
        const [result] = await pool.query(query, [nombre, apellido, telefono, email, direccion, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }
        
        res.json({ message: 'Contacto actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el contacto' });
    }
};

// Eliminar un contacto
const deleteContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM contactos WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }
        
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
