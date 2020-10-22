// Script to Estimate the Annual Rain Average 

var gaul = ee.FeatureCollection("FAO/GAUL/2015/level1");
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD");

// Define your AOI
var aoi = gaul.filter(ee.Filter.eq('ADM1_NAME', 'Uttar Pradesh'))

// set start and end year
var startyear = 2010; 
var endyear = 2014; 


var startdate = ee.Date.fromYMD(startyear,1, 1);
var enddate = ee.Date.fromYMD(endyear + 1, 1, 1);

var years = ee.List.sequence(startyear, endyear);


var annualPrecip = ee.ImageCollection.fromImages(
  years.map(function (year) {
    var annual = chirps
        .filter(ee.Filter.calendarRange(year, year, 'year'))
        .sum();
    return annual
        .set('year', year)
        .set('system:time_start', ee.Date.fromYMD(year, 1, 1));
}));


var title = {
  title: 'Annual precipitation',
  hAxis: {title: 'Time'},
  vAxis: {title: 'Precipitation (mm)'},
};

var chart = ui.Chart.image.seriesByRegion({
  imageCollection: annualPrecip, 
  regions: aoi,
  reducer: ee.Reducer.mean(),
  band: 'precipitation',
  scale: 5000,
  xProperty: 'system:time_start',
  seriesProperty: 'SITE'
}).setOptions(title)
  .setChartType('ColumnChart');
  
  print(chart);


var annualMean = annualPrecip.mean().clip(aoi);

var pViz = {
  min: 500, 
  max: 2000, 
  palette: '000000, 0000FF, FDFF92, FF2700, FF00E7'
};


Map.centerObject(aoi);
Map.addLayer(annualMean, pViz, 'mean yearly P');


