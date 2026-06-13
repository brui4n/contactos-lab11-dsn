const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api/contactos`;

// Elementos del DOM
const contactosList = document.getElementById('contactosList');
const modalForm = document.getElementById('modalForm');
const modalConfirm = document.getElementById('modalConfirm');
const form = document.getElementById('contactoForm');
const messagesContainer = document.getElementById('messages');
const modalTitle = document.getElementById('modalTitle');

// Botones
const btnNuevo = document.getElementById('btnNuevoContacto');
const btnCloseModal = document.getElementById('closeModal');
const btnCancel = document.getElementById('btnCancel');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

let contactoIdToDelete = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarContactos();
});

// ==========================
// Peticiones a la API
// ==========================

async function cargarContactos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderContactos(data);
    } catch (error) {
        console.error('Error al cargar:', error);
        showMessage('Error al cargar los contactos. Asegúrate de que el backend esté corriendo.', 'error');
        contactosList.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error de conexión</td></tr>';
    }
}

async function guardarContacto(formData) {
    const id = formData.get('id');
    const isEdit = !!id;
    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            // Nota: No se especifica 'Content-Type' para permitir al navegador definir el boundary del FormData
            body: formData
        });

        if (response.ok) {
            showMessage(`Contacto ${isEdit ? 'actualizado' : 'creado'} exitosamente`);
            closeModals();
            cargarContactos();
        } else {
            const errorData = await response.json();
            showMessage(errorData.message || 'Error al guardar', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión', 'error');
    }
}

async function eliminarContacto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Contacto eliminado exitosamente');
            closeModals();
            cargarContactos();
        } else {
            showMessage('Error al eliminar', 'error');
        }
    } catch (error) {
        showMessage('Error de conexión', 'error');
    }
}

// ==========================
// Renderizado UI
// ==========================

function renderContactos(contactos) {
    if (contactos.length === 0) {
        contactosList.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="padding: 3rem;">
                    <div style="color: var(--text-muted); margin-bottom: 1rem;">No tienes contactos todavía</div>
                    <button class="btn btn-primary btn-sm" onclick="btnNuevo.click()">Crear mi primer contacto</button>
                </td>
            </tr>
        `;
        return;
    }

    contactosList.innerHTML = contactos.map(contacto => {
        const initial = contacto.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';
        const avatarHTML = contacto.foto_url 
            ? `<img src="${contacto.foto_url}" class="contact-avatar" alt="Foto de ${escapeHTML(contacto.nombre)}">`
            : `<div class="avatar-placeholder">${initial}</div>`;

        return `
            <tr>
                <td style="width: 60px;">${avatarHTML}</td>
                <td>
                    <strong>${escapeHTML(contacto.nombre)} ${escapeHTML(contacto.apellido)}</strong>
                </td>
                <td>${escapeHTML(contacto.telefono)}</td>
                <td>${escapeHTML(contacto.email || '-')}</td>
                <td>${escapeHTML(contacto.direccion || '-')}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick='abrirEditar(${JSON.stringify(contacto)})'>
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${contacto.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showMessage(msg, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = msg;
    
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ==========================
// Manejo de Modales y Eventos
// ==========================

function openModalForm() {
    modalForm.classList.add('show');
}

function closeModals() {
    modalForm.classList.remove('show');
    modalConfirm.classList.remove('show');
    form.reset();
    document.getElementById('contactoId').value = '';
    contactoIdToDelete = null;
}

window.abrirEditar = function(contacto) {
    modalTitle.textContent = 'Editar Contacto';
    document.getElementById('contactoId').value = contacto.id;
    document.getElementById('nombre').value = contacto.nombre;
    document.getElementById('apellido').value = contacto.apellido;
    document.getElementById('telefono').value = contacto.telefono;
    document.getElementById('email').value = contacto.email || '';
    document.getElementById('direccion').value = contacto.direccion || '';
    openModalForm();
};

window.confirmarEliminar = function(id) {
    contactoIdToDelete = id;
    modalConfirm.classList.add('show');
};

// Listeners
btnNuevo.addEventListener('click', () => {
    modalTitle.textContent = 'Nuevo Contacto';
    form.reset();
    document.getElementById('contactoId').value = '';
    openModalForm();
});

btnCloseModal.addEventListener('click', closeModals);
btnCancel.addEventListener('click', closeModals);
btnCancelDelete.addEventListener('click', closeModals);

btnConfirmDelete.addEventListener('click', () => {
    if (contactoIdToDelete) {
        eliminarContacto(contactoIdToDelete);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const id = document.getElementById('contactoId').value;
    if (id) {
        formData.append('id', id);
    }
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('apellido', document.getElementById('apellido').value);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('direccion', document.getElementById('direccion').value);
    
    const fotoInput = document.getElementById('foto');
    if (fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
    }
    
    guardarContacto(formData);
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === modalForm) closeModals();
    if (e.target === modalConfirm) closeModals();
});

// Utilidad para prevenir XSS simple
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
