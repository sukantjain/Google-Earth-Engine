//Download Rainfall data using Google Earth Engine
//https://youtu.be/OBTkCq_OFRk


//Define area
var aoi = geometry

//Define start & end Date
var startDate= '2011-01-01'
var endDate = '2012-01-01'

//Define rainfall data

//CHIRPS daily (mm/day): UCSB-CHG/CHIRPS/DAILY, precipitation, 5000
//TRMM 3-Hourly (mm/day): TRMM/3B42, precipitation, 27000
//ERA daily (m/day): ECMWF/ERA5/DAILY, total_precipitation, 27830

var imageCollection = 'TRMM/3B42'
var bandName = 'precipitation'
var resolution = 27830     //in meters


////////////////////////////////
var rainfall = ee.ImageCollection(imageCollection)
                    .filter(ee.Filter.date(startDate, endDate))
                    .select(bandName);
                    
var chart = ui.Chart.image.series({
  imageCollection: rainfall, 
  region: aoi, 
  reducer: ee.Reducer.mean(), 
  scale: resolution,
});
print(chart);

Map.addLayer (aoi)
Map.centerObject(aoi)  