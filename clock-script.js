// Lista completa de time zones
const timeZones = [
    // Américas
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'America/Halifax',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Mexico_City',
    'America/Toronto',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Caracas',
    
    // Europa
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Prague',
    'Europe/Warsaw',
    'Europe/Istanbul',
    'Europe/Moscow',
    'Europe/Dublin',
    'Europe/Lisbon',
    'Europe/Athens',
    
    // África
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',
    'Africa/Casablanca',
    'Africa/Algiers',
    
    // Ásia
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Hong_Kong',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Manila',
    'Asia/Jakarta',
    'Asia/Bangkok',
    'Asia/Karachi',
    'Asia/Tehran',
    'Asia/Baghdad',
    'Asia/Tel_Aviv',
    
    // Oceania
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Australia/Adelaide',
    'Pacific/Auckland',
    'Pacific/Fiji',
];

// Estado global
let selectedTimeZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

// ============================================
// INICIALIZAR
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    populateTimeZoneSelect();
    loadTimeZones();
    setupEventListeners();
    updateClocks();
    
    // Atualizar relógios a cada segundo
    setInterval(updateClocks, 1000);
});

// ============================================
// POPULAR SELECT COM TIMEZONES
// ============================================

function populateTimeZoneSelect() {
    const select = document.getElementById('timezoneSelect');
    
    timeZones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        select.appendChild(option);
    });
}

// ============================================
// CARREGAR TIMEZONES SALVOS
// ============================================

function loadTimeZones() {
    const saved = localStorage.getItem('selectedTimeZones');
    if (saved) {
        selectedTimeZones = JSON.parse(saved);
    }
    renderClocks();
}

// ============================================
// SALVAR TIMEZONES
// ============================================

function saveTimeZones() {
    localStorage.setItem('selectedTimeZones', JSON.stringify(selectedTimeZones));
}

// ============================================
// ADICIONAR TIMEZONE
// ============================================

document.getElementById('addBtn').addEventListener('click', function() {
    const select = document.getElementById('timezoneSelect');
    const timezone = select.value;
    
    if (!timezone) {
        alert('Please select a time zone');
        return;
    }
    
    if (selectedTimeZones.includes(timezone)) {
        alert('This time zone is already added!');
        return;
    }
    
    selectedTimeZones.push(timezone);
    saveTimeZones();
    renderClocks();
    select.value = '';
});

// ============================================
// REMOVER TIMEZONE
// ============================================

function removeTimeZone(timezone) {
    selectedTimeZones = selectedTimeZones.filter(tz => tz !== timezone);
    saveTimeZones();
    renderClocks();
}

// ============================================
// RESETAR PARA PADRÃO
// ============================================

document.getElementById('resetBtn').addEventListener('click', function() {
    selectedTimeZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
    saveTimeZones();
    renderClocks();
});

// ============================================
// RENDERIZAR RELÓGIOS
// ============================================

function renderClocks() {
    const container = document.getElementById('clocksContainer');
    
    if (selectedTimeZones.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🌍</div>
                <p class="empty-state-text">No time zones selected</p>
                <p class="empty-state-text" style="font-size: 0.9rem; color: var(--text-light);">
                    Add a time zone using the dropdown above
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = selectedTimeZones.map(timezone => `
        <div class="clock-card" data-timezone="${timezone}">
            <div class="clock-header">
                <div>
                    <div class="timezone-name">${formatTimezoneName(timezone)}</div>
                    <div class="timezone-offset">${getTimezoneOffset(timezone)}</div>
                </div>
                <button class="remove-btn" onclick="removeTimeZone('${timezone}')" title="Remove this timezone">✕</button>
            </div>
            
            <div class="clock-display">
                <div class="digital-time" id="time-${timezone}">--:--:--</div>
                <div class="date-info">
                    <div class="day-name" id="day-${timezone}">---</div>
                    <div id="date-${timezone}">--/--/----</div>
                </div>
            </div>
            
            <div class="clock-info">
                <div class="info-item">
                    <div class="info-label">Hour</div>
                    <div class="info-value" id="hour-${timezone}">--</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Minute</div>
                    <div class="info-value" id="minute-${timezone}">--</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Second</div>
                    <div class="info-value" id="second-${timezone}">--</div>
                </div>
            </div>
            
            <div class="time-status" id="status-${timezone}">Daytime</div>
        </div>
    `).join('');
    
    updateClocks();
}

// ============================================
// ATUALIZAR RELÓGIOS
// ============================================

function updateClocks() {
    selectedTimeZones.forEach(timezone => {
        updateClockForTimeZone(timezone);
    });
}

function updateClockForTimeZone(timezone) {
    const now = new Date();
    
    // Obter hora no timezone específico
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'long'
    });
    
    const parts = formatter.formatToParts(now);
    const timeObj = {};
    
    parts.forEach(part => {
        timeObj[part.type] = part.value;
    });
    
    const hour = String(timeObj.hour).padStart(2, '0');
    const minute = String(timeObj.minute).padStart(2, '0');
    const second = String(timeObj.second).padStart(2, '0');
    const day = timeObj.weekday;
    const date = `${timeObj.month}/${timeObj.day}/${timeObj.year}`;
    
    // Atualizar elementos
    const timeEl = document.getElementById(`time-${timezone}`);
    const dayEl = document.getElementById(`day-${timezone}`);
    const dateEl = document.getElementById(`date-${timezone}`);
    const hourEl = document.getElementById(`hour-${timezone}`);
    const minuteEl = document.getElementById(`minute-${timezone}`);
    const secondEl = document.getElementById(`second-${timezone}`);
    const statusEl = document.getElementById(`status-${timezone}`);
    
    if (timeEl) {
        timeEl.textContent = `${hour}:${minute}:${second}`;
    }
    
    if (dayEl) dayEl.textContent = day;
    if (dateEl) dateEl.textContent = date;
    if (hourEl) hourEl.textContent = hour;
    if (minuteEl) minuteEl.textContent = minute;
    if (secondEl) secondEl.textContent = second;
    
    // Atualizar status (dia/noite)
    const hourNum = parseInt(hour);
    if (statusEl) {
        if (hourNum >= 6 && hourNum < 18) {
            statusEl.textContent = '☀️ Daytime';
            statusEl.classList.remove('night');
        } else {
            statusEl.textContent = '🌙 Nighttime';
            statusEl.classList.add('night');
        }
    }
}

// ============================================
// UTILIDADES
// ============================================

function formatTimezoneName(timezone) {
    return timezone
        .split('/')
        .pop()
        .replace(/_/g, ' ');
}

function getTimezoneOffset(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    const diffMs = tzDate - utcDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const sign = diffHours >= 0 ? '+' : '';
    const hours = Math.floor(Math.abs(diffHours));
    const minutes = Math.round((Math.abs(diffHours) - hours) * 60);
    
    return `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

// ============================================
// ATALHO DE TECLADO (Enter para adicionar)
// ============================================

document.getElementById('timezoneSelect').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});
