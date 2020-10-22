// Script to perform Zonal Statistics
// There is limitation of No. of Images in Image collection to perform this script
// In order to perform Zonal sts over Larger Image Collection,Try uisng Python API


// Define your Fetaure Collections
var gaul = ee.FeatureCollection("FAO/GAUL/2015/level1");
var filter = ee.Filter.inList('ADM1_NAME', ['Uttar Pradesh', 'Meghalaya',
             'Rajasthan', 'Kerala'])
var aoi = gaul.filter(filter);

//var aoi = ee.FeatureCollection("users/sukkiisukant/bundelkhand_districts");


print ("No of Features: ", aoi.size()) 

// Define your Image Collections
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
                .filter(ee.Filter.date('2018-06-01', '2018-08-01'));
                
print ("No of Images: ", chirps.size())               

Map.addLayer (aoi)

//Prepare Chart
var title = {
  title: 'Daily precipitation',
  hAxis: {title: 'Time'},
  vAxis: {title: 'Precipitation (mm)'},
};

var chart = ui.Chart.image.seriesByRegion({
  imageCollection: chirps, 
  regions: aoi,
  reducer: ee.Reducer.mean(),
  band: 'precipitation',
  scale: 5000,
  xProperty: 'system:time_start',
  seriesProperty: 'ADM1_NAME'  //'ADM1_NAME' //'NAME_2' 
}).setOptions(title)

  print(chart);





