let searchbar = document.getElementById('search');
let submit = document.getElementById('submit');

// mappa di barcellona , zoom control spostato in basso a sx

const map = L.map('map', {zoomControl: false}).setView([41.3851, 2.1734], 13); 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


const markersLayer = L.layerGroup().addTo(map);

L.control.zoom({position: 'bottomleft'}).addTo(map);
console.log(L.control.zoom);

// funzione richiesta

//event listner con callback asincrona (aspetta che finisca l'operazione await per passare a step successivo)
submit.addEventListener('click', async () => {

    markersLayer.clearLayers();
    let categoria = searchbar.value.toLowerCase();    
    findBySearchbar(categoria);

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

async function cercaShop(category) {
    
    const baseUrl = "https://overpass-api.de/api/interpreter?data=";
    
    const query = `[out:json];node["amenity"="${category}"](41.382, 2.165, 41.392, 2.175);out 100;`
    
    const urlDef = baseUrl + encodeURIComponent(query);
    
    try {
        
        // implementazione moderna - approfondire await;
        const response = await fetch(urlDef); 
        const data = await response.json();

        return data.elements; 
        
    } catch (error) {
        
        console.error("Errore nel recupero dati:", error);
        
    }
    
}

function findCoordinates(data) {
    
    return data.map(place => {
        let latitude = place.lat;
        let longitude = place.lon;
        return [Number(latitude) , Number(longitude)];
    });
}






// active effect categories menu

let links = document.querySelectorAll('.custom-tag');

links.forEach(link => {
    link.addEventListener('click', function() {
        
        links.forEach(l => l.classList.remove('custom-tag-active'));
        this.classList.add('custom-tag-active');
    });
});

