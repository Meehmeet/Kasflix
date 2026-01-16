const fs = require('fs');

// Textdatei einlesen
function readNumbers(filename) {
    const numbers = [];
    
    try {
        if (fs.existsSync(filename)) {
            const data = fs.readFileSync(filename, 'utf-8');
            const values = data.split(/[\s,]+/);
            
            values.forEach(value => {
                const num = parseInt(value.trim());
                if (!isNaN(num)) {
                    numbers.push(num);
                }
            });
        }
    } catch (err) {
        console.log(`Fehler beim Lesen der Datei: ${err.message}`);
    }
    
    return numbers;
}

// Bubblesort Algorithmus
function bubbleSort(arr) {
    const n = arr.length;
    console.log('Sortiere mit Bubblesort...');
    
    for (let i = 0; i < n - 1; i++) {
        // Fortschritt anzeigen
        if (n > 10 && i % Math.max(1, Math.floor((n - 1) / 10)) === 0) {
            const progress = Math.floor((i / (n - 1)) * 100);
            process.stdout.write(`\rFortschritt: ${progress}%`);
        }
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Tauschen
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    if (n > 10) console.log('\rFortschritt: 100%');
    console.log('Sortierung abgeschlossen!');
    return arr;
}

// Quicksort Algorithmus
function quickSort(arr, low = 0, high = arr.length - 1, isFirstCall = true) {
    if (isFirstCall) {
        console.log('Sortiere mit Quicksort...');
    }
    
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1, false);
        quickSort(arr, pivotIndex + 1, high, false);
    }
    
    if (isFirstCall) {
        console.log('Sortierung abgeschlossen!');
    }
    
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Insertsort Algorithmus
function insertSort(arr) {
    const n = arr.length;
    console.log('Sortiere mit Insertsort...');
    
    for (let i = 1; i < n; i++) {
        // Fortschritt anzeigen
        if (n > 10 && i % Math.max(1, Math.floor(n / 10)) === 0) {
            const progress = Math.floor((i / n) * 100);
            process.stdout.write(`\rFortschritt: ${progress}%`);
        }
        
        const key = arr[i];
        let j = i - 1;
        
        // Verschiebe Elemente größer als key eine Position nach rechts
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    
    if (n > 10) console.log('\rFortschritt: 100%');
    console.log('Sortierung abgeschlossen!');
    return arr;
}

// Universelle Sort-Funktion
function sort(arr, algorithm) {
    switch (algorithm.toLowerCase()) {
        case 'bubble':
            return bubbleSort(arr);
        case 'quick':
            return quickSort(arr);
        case 'insert':
            return insertSort(arr);
        default:
            console.log('Unbekannter Algorithmus. Verwende Quicksort.');
            return quickSort(arr);
    }
}

// Hauptprogramm
function main() {
    const filePath = 'unsortierte_zahlen.txt';
    
    // Kommandozeilenargument lesen
    const args = process.argv.slice(2);
    const algorithm = args[0] ? args[0].toLowerCase() : 'all';
    
    // Textdatei einlesen
    let numbers = readNumbers(filePath);
    
    if (numbers.length === 0) {
        console.log('Keine Daten gefunden oder Datei nicht vorhanden.');
        console.log('Verwende Beispieldaten...');
        numbers = [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 23, 36, 18, 77];
    }
    
    console.log('Original Daten:');
    console.log(numbers);
    console.log();
    
    if (algorithm === 'all') {
        // Alle Algorithmen ausführen
        
        // Bubblesort
        let bubbleData = [...numbers];
        let startTime = Date.now();
        sort(bubbleData, 'bubble');
        let elapsedTime = (Date.now() - startTime) / 1000;
        console.log('=== BUBBLESORT ===');
        printAllNumbers(bubbleData);
        console.log(`\nZeit: ${elapsedTime.toFixed(6)} Sekunden`);
        console.log();
        
        // Quicksort
        let quickData = [...numbers];
        startTime = Date.now();
        sort(quickData, 'quick');
        elapsedTime = (Date.now() - startTime) / 1000;
        console.log('=== QUICKSORT ===');
        printAllNumbers(quickData);
        console.log(`\nZeit: ${elapsedTime.toFixed(6)} Sekunden`);
        console.log();
        
        // Insertsort
        let insertData = [...numbers];
        startTime = Date.now();
        sort(insertData, 'insert');
        elapsedTime = (Date.now() - startTime) / 1000;
        console.log('=== INSERTSORT ===');
        printAllNumbers(insertData);
        console.log(`\nZeit: ${elapsedTime.toFixed(6)} Sekunden`);
        console.log();
    } else {
        // Nur einen spezifischen Algorithmus ausführen
        let data = [...numbers];
        let startTime = Date.now();
        sort(data, algorithm);
        let elapsedTime = (Date.now() - startTime) / 1000;
        console.log(`\n=== ${algorithm.toUpperCase()} ===`);
        printAllNumbers(data);
        console.log(`\nZeit: ${elapsedTime.toFixed(6)} Sekunden`);
        console.log();
    }
}

// Alle Zahlen ausgeben
function printAllNumbers(arr) {
    console.log('Sortierte Zahlen:');
    arr.forEach(num => console.log(num));
}

// Programm starten
main();
