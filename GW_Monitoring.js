// Groundwater Monitoring Analysis using GLDAS dataset in Google Earth Engine

// Define two locations for analysis
var location1 = [80.3880, 8.3114]; // Anuradhapura
var location2 = [79.8612, 6.9271]; // Colombo 

var pointFeature1 = ee.Feature(ee.Geometry.Point(location1), {name: 'Anuradhapura'});
var pointFeature2 = ee.Feature(ee.Geometry.Point(location2), {name: 'Colombo'});

Map.addLayer(pointFeature1, {color: 'red'}, 'Point: Anuradhapura');
Map.addLayer(pointFeature2, {color: 'blue'}, 'Point: Colombo');

var pointsCollection = ee.FeatureCollection([pointFeature1, pointFeature2]);

// Add Sri Lanka boundary
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var sriLanka = countries.filter(ee.Filter.eq('country_na', 'Sri Lanka'));
Map.addLayer(sriLanka, {color: 'green'}, 'Sri Lanka Boundary');
Map.centerObject(sriLanka, 7);

// Time range
var startDate = ee.Date('2013-01-01');
var endDate = ee.Date('2024-01-01');
var timeDifference = endDate.difference(startDate, 'month').round();


// Load GLDAS data
var groundwaterData = ee.ImageCollection("NASA/GLDAS/V022/CLSM/G025/DA1D")
  .select('GWS_tavg')
  .filterDate(startDate, endDate)
  .filterBounds(sriLanka);

// Monthly list
var dateList = ee.List.sequence(0, timeDifference.subtract(1), 1).map(function(delta) {
  return startDate.advance(delta, 'month');
});

// Monthly average groundwater collection
var monthlyGW = ee.ImageCollection(dateList.map(function(date) {
  var start = ee.Date(date);
  var end = start.advance(1, 'month');
  var monthlyAverage = groundwaterData.filterDate(start, end).mean().rename('Groundwater');
  var numBands = monthlyAverage.bandNames().size();
  
  return monthlyAverage
    .set('system:time_start', start.millis())
    .set('system:time_end', end.millis())
    .set('system:index', start.format('YYYY-MM-dd'))
    .set('num_bands', numBands);
})).filter(ee.Filter.gt('num_bands', 0));


// Mean and latest image
var meanGW = monthlyGW.mean();
var lastImage = monthlyGW.sort('system:time_start', false).first();

// Get min/max dynamically
var stats = meanGW.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: sriLanka.geometry(),
  scale: 27000,
  bestEffort: true
});
print('Mean Groundwater min and max:', stats);

var latestStats = lastImage.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: sriLanka.geometry(),
  scale: 27000,
  bestEffort: true
});
print('Latest Groundwater min and max:', latestStats);

// --- Visualization Parameters ---
var gwPalette = ['darkred', 'orange', 'white', 'lightblue', 'blue'];

var visParams = {
  min: 400,
  max: 2100,
  palette: gwPalette
};

// Function to create a legend
function addLegend(title, palette, min, max) {
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px',
      backgroundColor: 'white'
    }
  });

  var legendTitle = ui.Label({
    value: title,
    style: {fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0'}
  });
  legend.add(legendTitle);

  // Create a gradient image for color bar
  var lon = ee.Image.pixelLonLat().select('latitude');
  var gradient = lon.multiply(0).add(1).multiply(ee.Image.pixelLonLat().select('longitude'));
  var colorBar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select('longitude')
      .multiply((max - min) / 100.0).add(min)
      .visualize({min: min, max: max, palette: palette}),
    params: {bbox: [0, 0, 100, 10], dimensions: '100x10'},
    style: {stretch: 'horizontal', margin: '4px 0', maxHeight: '20px'}
  });
  legend.add(colorBar);

  // Add min and max labels
  var minLabel = ui.Label(min.toFixed(1));
  var maxLabel = ui.Label(max.toFixed(1));
  var legendLabels = ui.Panel({
    widgets: [minLabel, ui.Label({value: '', style: {stretch: 'horizontal'}}), maxLabel],
    layout: ui.Panel.Layout.flow('horizontal')
  });
  legend.add(legendLabels);

  Map.add(legend);
}


// --- Visualize Mean Groundwater ---
Map.addLayer(meanGW.clip(sriLanka), visParams, 'Mean Groundwater Storage (2013–2023)');

// --- Visualize Latest Month ---
Map.addLayer(lastImage.clip(sriLanka), visParams, 'Groundwater Storage - Latest Month');

// --- Drought Threshold (e.g., <1000 mm) ---
var droughtAreas = lastImage.lt(1000).selfMask(); // Mask where groundwater < 1000
Map.addLayer(droughtAreas.clip(sriLanka), {palette: ['red']}, 'Drought Risk Areas (<1000 mm)');

// Add legends for the two layers
var gwPalette = ['darkred', 'orange', 'white', 'lightblue', 'blue'];

addLegend('Mean Groundwater Storage (mm)', gwPalette, 436, 1940);
addLegend('Latest Groundwater Storage (mm)', gwPalette, 574, 2092);
addLegend('Drought Risk Areas (<1000 mm)', ['red'], 0, 1);

// Add title for Mean Groundwater Storage Map
var title = ui.Label({
  value: 'Mean Groundwater Storage in Sri Lanka (2013–2023)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '10px 0 0 0',
    padding: '8px',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});

var titlePanel = ui.Panel({
  widgets: [title],
  style: {
    position: 'top-center',
    padding: '0px'
  }
});

Map.add(titlePanel);


// Add title for Latest Groundwater Storage Map
var latestTitle = ui.Label({
  value: 'Latest Groundwater Storage in Sri Lanka (as of December 2023)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '10px 0 0 0',
    padding: '8px',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});

var latestTitlePanel = ui.Panel({
  widgets: [latestTitle],
  style: {
    position: 'top-center',
    padding: '0px'
  }
});

Map.add(latestTitlePanel);


// Add title for Drought Risk Areas Map
var droughtTitle = ui.Label({
  value: 'Drought Risk Areas in Sri Lanka (Groundwater < 1000 mm)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '10px 0 0 0',
    padding: '8px',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});

var droughtTitlePanel = ui.Panel({
  widgets: [droughtTitle],
  style: {
    position: 'top-center',
    padding: '0px'
  }
});

Map.add(droughtTitlePanel);


// --- Time Series Charts ---
// National average
var groundwaterChart = ui.Chart.image.series({
  imageCollection: monthlyGW,
  region: sriLanka,
  reducer: ee.Reducer.mean(),
  scale: 27000,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Mean Groundwater Storage (Sri Lanka)',
  hAxis: {title: 'Time'},
  vAxis: {title: 'Groundwater Storage (mm)'},
  colors: ['green']
});
print(groundwaterChart);

// Time series at points
var pointChart = ui.Chart.image.seriesByRegion({
  imageCollection: monthlyGW,
  regions: pointsCollection,
  reducer: ee.Reducer.first(),
  band: 'Groundwater',
  scale: 27000,
  xProperty: 'system:time_start',
  seriesProperty: 'name'
}).setOptions({
  title: 'Groundwater Storage at Selected Points',
  hAxis: {title: 'Time'},
  vAxis: {title: 'Groundwater Storage (mm)'},
  colors: ['red', 'blue']
});
print(pointChart);


