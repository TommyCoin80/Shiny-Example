var lightSettings = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.85,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};



var deckgl =  new deck.DeckGL({
    container: 'deckMap',
    map: mapboxgl,
    //mapboxAccessToken: 'pk.eyJ1IjoidG9tbXljb2luIiwiYSI6ImNqM244b2MxYjAwNjAzMm55bDJ3enhmZzYifQ.K-5LwxDgXsDGfELMz69siQ',
    // This token is for demo-purpose only and rotated regularly. Get your token at https://www.mapbox.com
    mapboxApiAccessToken: 'pk.eyJ1IjoidG9tbXljb2luIiwiYSI6ImNqM244b2MxYjAwNjAzMm55bDJ3enhmZzYifQ.K-5LwxDgXsDGfELMz69siQ',
    mapStyle: 'mapbox://styles/mapbox/dark-v9',
    //mapStyle: 'mapbox://styles/tommycoin/cjo7pcrya062n2rowfgguz22u',
    longitude:-0.091489,
    latitude: 51.514421,
    zoom: 14,
    minZoom: 1,
    maxZoom: 20,
    pitch: 40.5
});

const colorRange = d3.schemeSpectral[6].map(function(d) { var rgb = d3.color(d); return [rgb.r, rgb.g, rgb.b] }).reverse();
const elevationRange = [0,200];

function updateHex(data) {

  var hexLayer = new deck.HexagonLayer({
        id: 'deckMap',
        data: data,
        extruded: true,
        wireframe: true,
        fp64: false,
        getPosition: f => [f.Longitude, f.Latitude],
        ightSettings: lightSettings,
        colorRange: colorRange,
        elevationRange: elevationRange,
        pickable:true,
        radius:60,
        upperPecentile:100,
        coverage:.9,
        opacity:.5
      })
  
  deckgl.setProps({layers: [hexLayer]});
}

$(function() {
  
 $('a').on('click', function() {
    var t = d3.interval(function(elapsed) {
      deckgl._map.resize();
      if(elapsed > 300)  {t.stop();}
    },15);
 })
 
});