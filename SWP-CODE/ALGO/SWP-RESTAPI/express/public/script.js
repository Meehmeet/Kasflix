// API Base URL
const API_URL = 'http://localhost:3000/api/cars';

// State
let cars = [];
let editingId = null;

// DOM Elements
const autoForm = document.getElementById('auto-form');
const carsContainer = document.getElementById('cars-container');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('no-results');
const searchInput = document.getElementById('search');
const refreshBtn = document.getElementById('refresh-btn');
const cancelBtn = document.getElementById('cancel-btn');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');

// Farben-Mapping für Anzeige
const colorMap = {
    'Schwarz': '#000000',
    'Weiß': '#FFFFFF',
    'Silber': '#C0C0C0',
    'Grau': '#808080',
    'Rot': '#FF0000',
    'Blau': '#0000FF',
    'Grün': '#008000',
    'Gelb': '#FFFF00',
    'Orange': '#FFA500'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
autoForm.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', handleSearch);
refreshBtn.addEventListener('click', loadCars);
cancelBtn.addEventListener('click', cancelEdit);

// Initialisierung
function init() {
    loadCars();
}

// Autos laden
async function loadCars() {
    try {
        showLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            cars = data.data;
            displayCars(cars);
            updateStats(cars);
        }
    } catch (error) {
        showToast('Fehler beim Laden der Autos', 'error');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Autos anzeigen
function displayCars(carsToDisplay) {
    carsContainer.innerHTML = '';
    
    if (carsToDisplay.length === 0) {
        noResultsElement.style.display = 'block';
        return;
    }
    
    noResultsElement.style.display = 'none';
    
    carsToDisplay.forEach(car => {
        const carCard = createCarCard(car);
        carsContainer.appendChild(carCard);
    });
}

// Auto-Karte erstellen
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    const colorHex = colorMap[car.farbe] || '#CCCCCC';
    
    card.innerHTML = `
        <div class="car-header">
            <div class="car-brand">
                <h3>${car.marke}</h3>
                <p>${car.modell}</p>
            </div>
            <div class="car-color" style="background-color: ${colorHex}; ${car.farbe === 'Weiß' ? 'border: 2px solid #ddd;' : ''}"></div>
        </div>
        
        <div class="car-details">
            <div class="detail-item">
                <span class="detail-icon">⚡</span>
                <div>
                    <div class="detail-label">Leistung</div>
                    <div class="detail-value">${car.ps} PS</div>
                </div>
            </div>
            
            <div class="detail-item">
                <span class="detail-icon">👥</span>
                <div>
                    <div class="detail-label">Plätze</div>
                    <div class="detail-value">${car.plaetze}</div>
                </div>
            </div>
            
            <div class="detail-item">
                <span class="detail-icon">📅</span>
                <div>
                    <div class="detail-label">Baujahr</div>
                    <div class="detail-value">${car.baujahr}</div>
                </div>
            </div>
            
            <div class="detail-item">
                <span class="detail-icon">🎨</span>
                <div>
                    <div class="detail-label">Farbe</div>
                    <div class="detail-value">${car.farbe}</div>
                </div>
            </div>
        </div>
        
        <div class="car-actions">
            <button class="btn btn-success" onclick="editCar(${car.id})">
                <span class="btn-icon">✏️</span> Bearbeiten
            </button>
            <button class="btn btn-danger" onclick="deleteCar(${car.id})">
                <span class="btn-icon">🗑️</span> Löschen
            </button>
        </div>
    `;
    
    return card;
}

// Statistiken aktualisieren
function updateStats(cars) {
    const totalCars = cars.length;
    document.getElementById('total-cars').textContent = totalCars;
    
    if (totalCars > 0) {
        const avgPs = Math.round(cars.reduce((sum, car) => sum + car.ps, 0) / totalCars);
        document.getElementById('avg-ps').textContent = avgPs;
        
        const newestYear = Math.max(...cars.map(car => car.baujahr));
        document.getElementById('newest-year').textContent = newestYear;
    } else {
        document.getElementById('avg-ps').textContent = '0';
        document.getElementById('newest-year').textContent = '-';
    }
}

// Formular absenden
async function handleSubmit(e) {
    e.preventDefault();
    
    const carData = {
        marke: document.getElementById('marke').value,
        modell: document.getElementById('modell').value,
        ps: parseInt(document.getElementById('ps').value),
        plaetze: parseInt(document.getElementById('plaetze').value),
        baujahr: parseInt(document.getElementById('baujahr').value),
        farbe: document.getElementById('farbe').value
    };
    
    try {
        let response;
        
        if (editingId) {
            // Update
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            autoForm.reset();
            cancelEdit();
            loadCars();
        } else {
            showToast('Fehler beim Speichern', 'error');
        }
    } catch (error) {
        showToast('Fehler beim Speichern', 'error');
        console.error('Error:', error);
    }
}

// Auto bearbeiten
function editCar(id) {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    
    editingId = id;
    
    document.getElementById('marke').value = car.marke;
    document.getElementById('modell').value = car.modell;
    document.getElementById('ps').value = car.ps;
    document.getElementById('plaetze').value = car.plaetze;
    document.getElementById('baujahr').value = car.baujahr;
    document.getElementById('farbe').value = car.farbe;
    
    formTitle.textContent = 'Auto bearbeiten';
    submitBtn.innerHTML = '<span class="btn-icon">💾</span> Änderungen speichern';
    cancelBtn.style.display = 'inline-flex';
    
    // Scroll zum Formular
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Bearbeitung abbrechen
function cancelEdit() {
    editingId = null;
    autoForm.reset();
    formTitle.textContent = 'Neues Auto hinzufügen';
    submitBtn.innerHTML = '<span class="btn-icon">➕</span> Auto hinzufügen';
    cancelBtn.style.display = 'none';
}

// Auto löschen
async function deleteCar(id) {
    if (!confirm('Möchten Sie dieses Auto wirklich löschen?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            loadCars();
        } else {
            showToast('Fehler beim Löschen', 'error');
        }
    } catch (error) {
        showToast('Fehler beim Löschen', 'error');
        console.error('Error:', error);
    }
}

// Suche
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        displayCars(cars);
        return;
    }
    
    const filtered = cars.filter(car => 
        car.marke.toLowerCase().includes(searchTerm) ||
        car.modell.toLowerCase().includes(searchTerm) ||
        car.farbe.toLowerCase().includes(searchTerm)
    );
    
    displayCars(filtered);
}

// Loading-Zustand
function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
    carsContainer.style.display = show ? 'none' : 'grid';
}

// Toast-Benachrichtigung
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
