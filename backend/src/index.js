require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactoRoutes = require('./routes/contactoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear application/json

// Rutas
app.use('/api/contactos', contactoRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.send('API de Gestión de Contactos funcionando');
});

// Manejo de errores general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Algo salió mal en el servidor!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
