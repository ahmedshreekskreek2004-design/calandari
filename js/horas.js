
const bookingForm = document.getElementById('bookingForm');
const nameInput = document.getElementById('name');
const startHourInput = document.getElementById('startHour');
const durationInput = document.getElementById('duration');
const hoursTable = document.getElementById('hoursTable');
const selectedDateElement = document.getElementById('selectedDate');
const notifyBtn = document.getElementById('notify-btn');
const shareBtn = document.getElementById('share-btn');


// la fecha seleccionada se obtiene de localStorage
const selectedDateKey = localStorage.getItem('selectedDateKey');

// las reservas
let reservado = {};

// 1. LOAD CLIENT: localStorage
function loadClient() {
    const savedClient = localStorage.getItem('hourReservations');

    if (savedClient) {
        reservado = JSON.parse(savedClient);
    } else {
        reservado = {};
    }

    renderHours();
}

// 2. SAVE CLIENT localStorage
function saveClient() {
    localStorage.setItem(
        'hourReservations',
        JSON.stringify(reservado)
    );
}

// 3. RENDER HOURS: 
function renderHours() {
    
    hoursTable.innerHTML = '';


for (let hour = 0; hour < 24; hour++) {
    const hourBox = document.createElement('div');

    const time = String(hour).padStart(2, '0') + ':00';

    hourBox.textContent = time;
    hourBox.classList.add('hour');

    const bookings = reservado[selectedDateKey] || [];

    const booking = bookings.find(item =>
        hour >= item.start &&
        hour < item.start + item.duration
    );

    if (booking) {
        hourBox.classList.add('selected');

        const nameLabel = document.createElement('p');
        nameLabel.textContent = booking.name;
        hourBox.appendChild(nameLabel);

        hourBox.addEventListener('click', () => {
            removeBooking(booking);
        });
    }

    hoursTable.appendChild(hourBox);
}}

bookingForm.addEventListener('submit', addEvent);

// 4. ADD EVENT: 
function addEvent(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const start = Number(startHourInput.value);
    const duration = Number(durationInput.value);

    if (!selectedDateKey) {
        alert('Selecciona una fecha primero.');
        return;
    }

    if (
        !name ||
        startHourInput.value === '' ||
        !Number.isInteger(duration) ||
        duration < 1 ||
        duration > 24
    ) {
        alert('Introduce datos válidos.');
        return;
    }

    // Si mas de 24 horas
    if (start + duration >= 24) {
        alert('La reserva no puede pasar de las 24:00.');
        return;
    }

    if (!reservado[selectedDateKey]) {
        reservado[selectedDateKey] = [];
    }

    // comprobar que las horas no estén reservadas
    const isReserved = reservado[selectedDateKey].some(item =>
        start < item.start + item.duration &&
        start + duration > item.start
    );

    if (isReserved) {
        alert('Esta hora ya está reservada.');
        return;
    }

    // anadir la reserva al objeto reservado
    reservado[selectedDateKey].push({
        name: name,
        start: start,
        duration: duration
    });

    saveClient();

    // renderizar las horas después de agregar la reserva
    renderHours();

    bookingForm.reset();
    sendNotification(
  'Nuevo reserva ' + selectedDateKey,
  'La reserva se ha añadido correctamente.'
);
}

function removeBooking(bookingToRemove) {
    const bookings = reservado[selectedDateKey];

    reservado[selectedDateKey] = bookings.filter(item =>
        item !== bookingToRemove
    );

    saveClient();
    renderHours();
    sendNotification(
  'reserva eliminada'+ selectedDateKey,
  'La reserva se ha eliminado correctamente.'
);
}
// استقبال بيانات الفورم

// mostra la fecha arriba
if (selectedDateKey) {
    selectedDateElement.textContent = selectedDateKey;
}
// ==========================================================================
// FASE 4: RESTA D'APIS DEL NAVEGADOR (NOTIFICATION I WEB SHARE)
// ==========================================================================

/**
 * Mostra una notificació del sistema si tenim permís concedit.
 */

function sendNotification(title, body) {
  // TODO: Comprova si Notification.permission === 'granted' i crea una new Notification()
  // Mira a la pràctica AC2 com es fa!
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body
    });
  }
}

// TODO: Escoltador d'esdeveniment per a 'notifyBtn' (Sol·licitar permisos de notificació)
// Mira a la pràctica AC2 com es fa!
notifyBtn.addEventListener('click', () => {
  try{
    Notification.requestPermission();
      console.log('Permiso de notificación solicitado');

  } catch (error) {
    console.error('Error al solicitar permiso de notificación:', error);
  }
});


shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Mi calendario',
        text: 'Mira mi calendario y puedes probarlo ',
        url: window.location.href
      });
    } catch (error) {
      console.log('No se pudo compartir:', error);
    }
  } else {
    alert('La función de compartir no está disponible.');
  }
});


// TODO: Escoltador d'esdeveniment per a 'shareBtn' (Web Share API amb fallback a clipboard)
// Mira a la pràctica AC2 com es fa!


// mosrtrar las horas reservadas
   loadClient(); 

