import { zone } from './neighboroud.js';
import { cat } from './categories.js';

// 1. RAGGRUPPAMENTO ELEMENTI DEL DOM
const elementiDOM = {
    pulsanteRicerca: document.getElementById('submitResearch'),
    tagCategorie: document.querySelectorAll('.custom-tag'),
    listaZone: document.getElementById('cityZone'),
    pulsanteZona: document.getElementById('dropdownZone'),
    pulsanteCategoria: document.getElementById('dropdownCat'),
    listaCategorie: document.getElementById('categoryContainer')
};

// 2. CONFIGURAZIONE MAPPA
const mappa = L.map('map', { zoomControl: false }).setView([41.3851, 2.1734], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mappa);
const livelloMarcatori = L.layerGroup().addTo(mappa);
L.control.zoom({ position: 'bottomleft' }).addTo(mappa);

const iconaPosizione = L.icon({
    iconUrl: 'media/location-dot-solid.png',
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

// 3. POPOLAMENTO INTERFACCIA UTENTE
elementiDOM.listaZone.innerHTML = zone.map(el => 
    `<li class="zoneSelector"><a class="dropdown-item zoneItem" data-name="${el.name}">${el.name}</a></li>`
).join('');

elementiDOM.listaCategorie.innerHTML = cat.map(el => 
    `<li class="catSelector"><a class="dropdown-item catItem" data-name="${el.name}">${el.name}</a></li>`
).join('');

// 4. GESTIONE EVENTI MENU A TENDINA
function configuraMenuTendina(contenitore, classeTarget, nodoVisualizzazione) {
    contenitore.addEventListener('click', (evento) => {
        const elemento = evento.target.closest(`.${classeTarget}`);
        if (elemento) {
            evento.preventDefault();
            nodoVisualizzazione.innerHTML = elemento.getAttribute('data-name');
        }
    });
}

configuraMenuTendina(elementiDOM.listaZone, 'zoneItem', elementiDOM.pulsanteZona);
configuraMenuTendina(elementiDOM.listaCategorie, 'catItem', elementiDOM.pulsanteCategoria);

// 5. LOGICA DI RICERCA E VISUALIZZAZIONE
elementiDOM.pulsanteRicerca.addEventListener('click', async () => {
    const categoriaSelezionata = elementiDOM.pulsanteCategoria.innerHTML.trim();
    const zonaSelezionata = elementiDOM.pulsanteZona.innerHTML.trim();
    
    // Validazione della selezione
    if (categoriaSelezionata === "What are you looking for?" || zonaSelezionata === "Select Zone") {
        alert("Per favore, seleziona sia una zona che una categoria.");
        return;
    }

    const queryOverpass = `[out:json];area["name"="Barcelona"]["admin_level"="8"]->.city;area["name"="${zonaSelezionata}"](area.city)->.searchArea;node["amenity"="${categoriaSelezionata}"](area.searchArea);out 100;`;
    const indirizzoAPI = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryOverpass)}`;

    const datiRisultati = await recuperaDatiAttivita(indirizzoAPI);
    mostraMarcatoriSullaMappa(datiRisultati);
});

async function recuperaDatiAttivita(url) {
    try {
        const risposta = await fetch(url);
        if (!risposta.ok) throw new Error(`Errore Server: ${risposta.status}`);
        const dati = await risposta.json();
        return dati.elements || [];
    } catch (errore) {
        console.error("Errore nel recupero dati:", errore);
        return [];
    }
}

function mostraMarcatoriSullaMappa(dati) {
    livelloMarcatori.clearLayers();
    
    if (dati.length === 0) {
        alert("Nessun risultato trovato per questa combinazione.");
        return;
    }

    dati.forEach(({ lat, lon }) => {
        L.marker([lat, lon], { icon: iconaPosizione }).addTo(livelloMarcatori);
    });
}

// 6. GESTIONE TAG CATEGORIE RAPIDE
elementiDOM.tagCategorie.forEach(tag => {
    tag.addEventListener('click', (evento) => {
        // Gestione feedback visivo (classe attiva)
        elementiDOM.tagCategorie.forEach(t => t.classList.remove('custom-tag-active'));
        evento.currentTarget.classList.add('custom-tag-active');
        
        // Sincronizzazione con il menu a tendina
        const idCategoria = evento.currentTarget.id;
        elementiDOM.pulsanteCategoria.innerHTML = idCategoria;
    });
});