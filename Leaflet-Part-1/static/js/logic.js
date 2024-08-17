
// Set up the background
let basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
  {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });


// Create a starting point for the map

let map = L.map("map", {
  center: [
    40, -90
  ],
  zoom: 4
});

basemap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson").then(function (data) {

  // Use earthquake data to know what to plot

  function data_info(earthquake) {
    return {
      color: "#000000",
      fillColor: data_color(earthquake.geometry.coordinates[2]),
      opacity: 1,
      fillOpacity: 1,
      weight: 0.5,
      radius: data_radius(earthquake.properties.mag),
      stroke: true
    };
  }

  // Use earthquake data to determine color

  function data_color(depth) {
    switch (true) {
      case depth > 100:
        return "#ff0400";
      case depth > 80:
        return "#ff4800";
      case depth > 60:
        return "#ff8c00";
      case depth > 40:
        return "#ffe100";
      case depth > 20:
        return "#c0ff01";
      default:
        return "#4dff00";
    }
  }

  L.geoJson(data, {

    // Turn each earthquake into a circle on the map

    pointToLayer: function (earthquake, latlng) {
      return L.circleMarker(latlng);
    },

    // Use the previously defined functions to define each data point's characteristics

    style: data_info,

    // Data that is displayed when a data point is clicked

    onEachFeature: function (earthquake, layer) {
      layer.bindPopup(
        + "Location: "
        + earthquake.properties.place
        + "<br>Magnitude: "
        + earthquake.properties.mag
        + "<br>Depth: "
        + earthquake.geometry.coordinates[2]
      );
    }
  }).addTo(map);

  // Scale the dots up by a constant for easier readability
  
  function data_radius(magnitude) {

    return magnitude * 3;
  }

  // Creating a legend
  let legend = L.control({
    position: "bottomright"
  });

  // Adding a scale for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [0, 20, 40, 60, 80, 100];
    let colors = [
      "#4dff00",
      "#d4ee00",
      "#ffe100",
      "#ff8c00",
      "#ff4800",
      "#ff0400"
    ];

    // For each step in the legend, add the colored box that was shown in
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add a legend to the map (also with the .css)
  legend.addTo(map);
});
