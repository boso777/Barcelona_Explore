let searchbar = document.getElementById('search');
let submit = document.getElementById('submitResearch');
let links = document.querySelectorAll('.custom-tag');
let cityZone = document.getElementById('cityZone');
let dropdownZone = document.getElementById('dropdownZone');
let dropdownCat = document.getElementById('dropdownCat');
let categoryContainer = document.getElementById('categoryContainer');

// import local data from js element

import { zone } from './neighboroud.js';
import { cat } from './categories.js';


// mappa di barcellona , zoom control spostato in basso a sx

const map = L.map('map', {zoomControl: false}).setView([41.3851, 2.1734], 13); 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


const markersLayer = L.layerGroup().addTo(map);

L.control.zoom({position: 'bottomleft'}).addTo(map);


// icon control

let geoPoint = L.icon({
    iconUrl: 'media/location-dot-solid.png',
    shadowUrl: 'media/location-dot-solid.png',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



let selectedZone = "";
let selectedCategory = "";

// 1 - cicle for each element of the DB, create -> appends childs // fix-it make a function for both


zone.forEach((el)  => {
    let newZone = document.createElement('li');
    newZone.classList.add(`zoneSelector`)
    newZone.innerHTML = `<a class="dropdown-item zoneItem" data-name="${el.name}">${el.name}</a>`
    cityZone.appendChild(newZone);
});

cat.forEach((el)  => {
    let newCat = document.createElement('li');
    newCat.classList.add(`catSelector`)
    newCat.innerHTML = `<a class="dropdown-item catItem" data-name="${el.name}">${el.name}</a>`
    categoryContainer.appendChild(newCat);
});



// 2-  event listener on click capture the inpute of the user a modify the dropdown text //  fix-it make a function for both

cityZone.addEventListener('click' , (el)=> {
    if(el.target.classList.contains('zoneItem')){
        
        el.preventDefault();
        let selectedElement = el.target.getAttribute('data-name');
        dropdownZone.innerHTML = selectedElement;
    }
})


categoryContainer.addEventListener('click' , (el)=>{
    if(el.target.classList.contains('catItem')){

        el.preventDefault();
        let selectedCat = el.target.getAttribute('data-name');
        dropdownCat.innerHTML = selectedCat;
    }
})

let data = "";

// 3 event listner con callback asincrona (aspetta che finisca l'operazione await per passare a step successivo)

submit.addEventListener('click', async () => {

    markersLayer.clearLayers();
    selectedCategory = dropdownCat.innerHTML;
    selectedZone = dropdownZone.innerHTML;
    
    const query = `[out:json];area["name"="Barcelona"]["admin_level"="8"]->.city;area["name"="${selectedZone}"](area.city)->.searchArea;node["amenity"="${selectedCategory}"](area.searchArea);out 100;`;
    
    const baseUrl = "https://overpass-api.de/api/interpreter?data=";
    
    const urlDef = baseUrl + encodeURIComponent(query);

// fix-it continuare da qui, dati salvati in data

    data = await cercaShop(urlDef);
    
    addPointer(data);
});

// chiamata api per json attivià barcellona, url dinamico in base ai dati passati in richiesta

async function cercaShop(query) {
    
    
    try {
        const response = await fetch(query);
        
        // First control
        if (!response.ok) {
            throw new Error(`Errore Server: ${response.status}`);
        }
        
        const data = await response.json();
        return data.elements || []; // Restituisci array vuoto se elements manca
        
    } catch (error) {
        console.error("Errore nel recupero dati:", error);
        return []; // control 2 (everytime he return an array)
    }
}


// 4 function who print target on the map 

function addPointer(data){

   markersLayer.clearLayers();
    
    data.forEach(place => {
        let lat = place.lat;
        let lon = place.lon;
        L.marker([lat , lon], {icon: geoPoint}).addTo(markersLayer);
    });

    

}












// active effect categories menu // fixit

links.forEach(link => {
    link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('custom-tag-active'));
        this.classList.add('custom-tag-active');
    });
});

