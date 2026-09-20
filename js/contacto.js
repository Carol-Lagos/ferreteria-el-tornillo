/**
 * ==========================================================================
 * FERRETERÍA EL TORNILLO - INTERACTIVIDAD Y CONTACTO
 * Archivo: js/contacto.js
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Número de WhatsApp oficial de la ferretería
  const NUMERO_WHATSAPP = '525512345678';

  /* ------------------------------------------------------------------------
     1. NAVEGACIÓN MÓVIL (MENÚ RESPONSIVO)
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Cerrar el menú al pulsar cualquier enlace
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Cerrar menú al hacer clic fuera del mismo
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. RESALTADO ACTIVO DE ENLACES SEGÚN EL SCROLL
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('.section-scroll');
  const navLinks = document.querySelectorAll('.nav-link');

  function actualizarEnlaceActivo() {
    let scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', actualizarEnlaceActivo);

  /* ------------------------------------------------------------------------
     3. AUTOLLENADO AL COTIZAR DESDE EL CATÁLOGO DE PRODUCTOS
     ------------------------------------------------------------------------ */
  const botonesCotizar = document.querySelectorAll('.product-card a[href="#contacto"]');
  const campoMensaje = document.getElementById('mensaje');
  const selectAsunto = document.getElementById('asunto');
  const campoNombre = document.getElementById('nombre');

  botonesCotizar.forEach(boton => {
    boton.addEventListener('click', () => {
      const tarjeta = boton.closest('.product-card');
      if (!tarjeta) return;

      const tituloProducto = tarjeta.querySelector('.product-title')?.innerText?.trim() || 'Producto';
      const precioProducto = tarjeta.querySelector('.product-price')?.innerText?.replace(/\s+/g, ' ')?.trim() || '';

      if (selectAsunto) {
        selectAsunto.value = 'cotizacion';
      }

      if (campoMensaje) {
        campoMensaje.value = `Hola, me interesa cotizar el siguiente producto:\n• ${tituloProducto} (${precioProducto})\nCantidad requerida: `;
      }

      setTimeout(() => {
        if (campoNombre) campoNombre.focus();
      }, 400);
    });
  });

  /* ------------------------------------------------------------------------
     4. PERSISTENCIA DE BORRADOR (LOCALSTORAGE)
     ------------------------------------------------------------------------ */
  const STORAGE_KEY = 'ferreteria_contacto_borrador';
  const inputNombre = document.getElementById('nombre');
  const inputTelefono = document.getElementById('telefono');
  const inputCorreo = document.getElementById('correo');

  function guardarBorrador() {
    const borrador = {
      nombre: inputNombre ? inputNombre.value : '',
      telefono: inputTelefono ? inputTelefono.value : '',
      correo: inputCorreo ? inputCorreo.value : '',
      asunto: selectAsunto ? selectAsunto.value : 'cotizacion',
      mensaje: campoMensaje ? campoMensaje.value : ''
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(borrador));
    } catch (e) {
      // Ignorar si el almacenamiento local está restringido
    }
  }

  function restaurarBorrador() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const data = JSON.parse(guardado);
        if (inputNombre && data.nombre && !inputNombre.value) inputNombre.value = data.nombre;
        if (inputTelefono && data.telefono && !inputTelefono.value) inputTelefono.value = data.telefono;
        if (inputCorreo && data.correo && !inputCorreo.value) inputCorreo.value = data.correo;
        if (selectAsunto && data.asunto) selectAsunto.value = data.asunto;
        if (campoMensaje && data.mensaje && !campoMensaje.value) campoMensaje.value = data.mensaje;
      }
    } catch (e) {
      // Ignorar error de parsing
    }
  }

  restaurarBorrador();

  [inputNombre, inputTelefono, inputCorreo, selectAsunto, campoMensaje].forEach(elem => {
    if (elem) elem.addEventListener('input', guardarBorrador);
  });

  /* ------------------------------------------------------------------------
     5. VALIDACIÓN EN TIEMPO REAL
     ------------------------------------------------------------------------ */
  function marcarValidez(elemento, esValido) {
    if (!elemento) return;
    if (esValido) {
      elemento.classList.remove('is-invalid');
    } else {
      elemento.classList.add('is-invalid');
    }
  }

  if (inputNombre) {
    inputNombre.addEventListener('blur', () => {
      marcarValidez(inputNombre, inputNombre.value.trim().length >= 2);
    });
    inputNombre.addEventListener('input', () => {
      if (inputNombre.classList.contains('is-invalid')) {
        marcarValidez(inputNombre, inputNombre.value.trim().length >= 2);
      }
    });
  }

  if (campoMensaje) {
    campoMensaje.addEventListener('blur', () => {
      marcarValidez(campoMensaje, campoMensaje.value.trim().length >= 2);
    });
    campoMensaje.addEventListener('input', () => {
      if (campoMensaje.classList.contains('is-invalid')) {
        marcarValidez(campoMensaje, campoMensaje.value.trim().length >= 2);
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
     ------------------------------------------------------------------------ */
  const formularioContacto = document.getElementById('formularioContacto');
  const feedback = document.getElementById('mensajeFeedback');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = inputNombre ? inputNombre.value.trim() : '';
      const mensaje = campoMensaje ? campoMensaje.value.trim() : '';
      const telefono = inputTelefono ? inputTelefono.value.trim() : '';
      const correo = inputCorreo ? inputCorreo.value.trim() : '';
      const asunto = selectAsunto ? selectAsunto.options[selectAsunto.selectedIndex].text : 'Consulta General';

      let errores = [];

      // Validación requerida del taller:
      // El nombre debe tener al menos 2 caracteres
      if (!nombre || nombre.length < 2) {
        errores.push('El nombre es obligatorio y debe tener al menos 2 caracteres.');
        marcarValidez(inputNombre, false);
      } else {
        marcarValidez(inputNombre, true);
      }

      // Validación del campo de mensaje (obligatorio)
      if (!mensaje || mensaje.length < 2) {
        errores.push('Por favor, ingresa tu mensaje o los productos a cotizar.');
        marcarValidez(campoMensaje, false);
      } else {
        marcarValidez(campoMensaje, true);
      }

      // Validación opcional de teléfono si el usuario decidió llenarlo
      if (telefono) {
        const telLimpio = telefono.replace(/[\s\-\(\)\+]/g, '');
        if (telLimpio.length < 7 || !/^\d+$/.test(telLimpio)) {
          errores.push('Si ingresas un teléfono, debe tener al menos 7 dígitos válidos.');
          marcarValidez(inputTelefono, false);
        } else {
          marcarValidez(inputTelefono, true);
        }
      } else if (inputTelefono) {
        marcarValidez(inputTelefono, true);
      }

      // Validación opcional de correo si el usuario decidió llenarlo
      if (correo) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
          errores.push('El formato del correo electrónico no es válido.');
          marcarValidez(inputCorreo, false);
        } else {
          marcarValidez(inputCorreo, true);
        }
      } else if (inputCorreo) {
        marcarValidez(inputCorreo, true);
      }

      // Si hay errores, mostrarlos y detener el envío
      if (errores.length > 0) {
        mostrarFeedback(errores.join('<br>'), 'error');
        return;
      }

      // Si pasa la validación (nombre >= 2 caracteres y mensaje válido), mostrar mensaje de éxito
      const textoWhatsApp = encodeURIComponent(
        `*SOLICITUD DE COTIZACIÓN - Ferretería El Tornillo*\n` +
        `• *Cliente:* ${nombre}\n` +
        (telefono ? `• *Teléfono:* ${telefono}\n` : '') +
        (correo ? `• *Correo:* ${correo}\n` : '') +
        `• *Departamento / Asunto:* ${asunto}\n` +
        `• *Mensaje:*\n${mensaje}`
      );
      const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${textoWhatsApp}`;

      const mensajeExito = `
        <strong>¡Mensaje enviado con éxito!</strong><br>
        Gracias por contactarnos, <strong>${nombre}</strong>. Hemos recibido tu solicitud correctamente y nos pondremos en contacto contigo lo antes posible.<br>
        <a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp" style="margin-top: 10px; display: inline-flex;">
          <i class="fa-brands fa-whatsapp"></i> Continuar por WhatsApp
        </a>
      `;

      mostrarFeedback(mensajeExito, 'success');

      // Limpiar formulario y borrador guardado
      formularioContacto.reset();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
    });
  }

  function mostrarFeedback(htmlMensaje, tipo) {
    if (!feedback) return;
    feedback.innerHTML = htmlMensaje;
    feedback.className = `form-feedback ${tipo}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
