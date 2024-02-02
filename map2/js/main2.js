mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 3.5, // starting zoom
    minZoom: 2, // minimum zoom level of the map
    center: [-98, 39] // starting center
});
const grades = [10, 25, 45, 75, 100, 125];
const colors = [
    'rgb(255, 230, 230)',  // Light red
    'rgb(255, 180, 180)',
    'rgb(255, 130, 130)',
    'rgb(255, 80, 80)',
    'rgb(255, 30, 30)',
    'rgb(200, 0, 0)'       // Dark red
]
// Set Albers projection
map.setProjection({
    name: 'albers',
    center: [-98, 39], // Center coordinates for your desired view
    parallels: [29.5, 45] // Specify the parallels
});

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('rates', {
        type: 'geojson',
        data: 'assets/covidRates.json'
    });
    map.addLayer({
            'id': 'rates-fill',
            'type': 'fill',
            'source': 'rates',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'fill-color': {
                    'property': 'rates',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                        [grades[4], colors[4]],
                        [grades[5], colors[5]]
                    ]
                },
            'fill-opacity': 0.6
            }
        }
    );
    // click on tree to view rates in a popup
    map.on('click', 'rates-fill', (event) => {
            new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`<strong>Rates:</strong> ${event.features[0].properties.rates}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Rates</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    labels.push(
        '<div class="legend-box" style="background:' + colors[i] + ';"></div>' +
        '<span class="legend-label">' + vbreak + '</span>'
    );
}

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
legend.innerHTML = labels.join('') + source;