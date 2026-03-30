let searchbar = document.getElementById('search');
let submit = document.getElementById('submit');

// mappa di barcellona , zoom control spostato in basso a sx

const map = L.map('map', {zoomControl: false}).setView([41.3851, 2.1734], 13); 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


L.control.zoom({position: 'bottomleft'}).addTo(map);
console.log(L.control.zoom);

// funzione richiesta

//event listner con callback asincrona (aspetta che finisca l'operazione await per passare a step successivo)
submit.addEventListener('click', async () => {
    let categoria = searchbar.value;    

    let dataset = await cercaShop(categoria);

    console.log(dataset);
});



// chiamata api per json attivià barcellona, url dinamico in base ai dati passati in richiesta

async function cercaShop(category) {
    
    const baseUrl = "https://overpass-api.de/api/interpreter?data=";
    
    const query = `[out:json];node["amenity"="${category}"](41.37, 2.14, 41.40, 2.19);out 100;`
    
    const urlDef = baseUrl + encodeURIComponent(query);
    
    try {

        // implementazione moderna - approfondire await;
        const response = await fetch(urlDef); 
        const data = await response.json();
        
        return data; 
        
    } catch (error) {
        
        console.error("Errore nel recupero dati:", error);
        
    }
    
}


