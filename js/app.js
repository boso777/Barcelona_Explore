let searchbar = document.getElementById('search');
let submit = document.getElementById('submitResearch');
let links = document.querySelectorAll('.custom-tag');
let cityZone = document.getElementById('cityZone');
let dropdownZone = document.getElementById('dropdownZone');


// import local data from js element

import { zone } from './neighboroud.js';


// cicle for each element of the DB, create a section in the dropwdown menu

zone.forEach((el , i)  => {
    let newZone = document.createElement('li');
    newZone.classList.add(`zoneSelector`)
    newZone.innerHTML = `<a class="dropdown-item" data-name="${el.name}">${el.name}</a>`
    cityZone.appendChild(newZone);
});


// event listener on click added on father of dynamic generated list items(it works on the sons for the callback parameter el), check all the element with the class dropdown-item into the cityZone element (the html UL), it valorize the variable selectedElement with the target data and inject them into the menu button text.

cityZone.addEventListener('click' , (el)=> {
    if(el.target.classList.contains('dropdown-item')){
        el.preventDefault();
        let selectedElement = el.target.getAttribute('data-name');
        dropdownZone.innerText = selectedElement;
    }
})


const quartiere = "";
const category = "restaurant";

const query = `[out:json];area["name"="Barcelona"]["admin_level"="8"]->.city;area["name"="${quartiere}"](area.city)->.searchArea;node["amenity"="bar"](area.searchArea);out 100;`;


// fetch() a Overpass API



async function cercaShop(category) {
    const baseUrl = "https://overpass-api.de/api/interpreter?data=";
    const query = `[out:json];node["amenity"="${category}"](41.382, 2.165, 41.392, 2.175);out 100;`;
    const urlDef = baseUrl + encodeURIComponent(query);
    
    try {
        const response = await fetch(urlDef);
        
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


// mappa di barcellona , zoom control spostato in basso a sx

const map = L.map('map', {zoomControl: false}).setView([41.3851, 2.1734], 13); 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


const markersLayer = L.layerGroup().addTo(map);

L.control.zoom({position: 'bottomleft'}).addTo(map);


// funzione richiesta

//event listner con callback asincrona (aspetta che finisca l'operazione await per passare a step successivo)
submit.addEventListener('click', async () => {
console.log(quartiere);
    
    markersLayer.clearLayers();
    let categoria = searchbar.value.toLowerCase();    //funzione di ricerca value input
    await findBySearchbar(categoria);
    
});

async function findBySearchbar(cat){
    
    let dataset = await cercaShop(cat);
    
    let coordinates = findCoordinates(dataset);
    
    coordinates.forEach(coordinate => {
        
        let circle = L.circle([Number(coordinate[0]),Number(coordinate[1])], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(markersLayer);
        
    });
    
}

// chiamata api per json attivià barcellona, url dinamico in base ai dati passati in richiesta


function findCoordinates(data) {
    
    return data.map(place => {
        let latitude = place.lat;
        let longitude = place.lon;
        return [Number(latitude) , Number(longitude)];
    });
}






// active effect categories menu



links.forEach(link => {
    link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('custom-tag-active'));
        this.classList.add('custom-tag-active');
    });
});

