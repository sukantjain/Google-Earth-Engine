/////// User Input///////////////

// Upload the shape file or draw the polygon or provide the coordinates
var bound = ee.FeatureCollection("users/sukkiisukant/bundelkhand_districts");

var geometry = ee.Geometry.Point([77.618, 25.353]);

// Define the AOI (either shape file/coordinates/geometry)
var aoi = geometry

// Field name to distinguish features (uncomment line 67)
// var PropertyName = 'NAME_2'  

// Define the dataset
var dataset = "NASA/SMAP/SPL3SMP_E/005"
var Band = 'soil_moisture_am'
var startDate = '2020-01-01'
var endDate = '2020-01-31'
var scale = 9000   // meters 

// Range for data visualization
var min = 0.1
var max = 0.5

////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// Show the AOI  with a blue outline
var AOI_viz = ee.Image().byte().paint({
  featureCollection: aoi,
  color: 1,
  width: 1
});

Map.centerObject (aoi)



var dataset2 = ee.ImageCollection(dataset).select(Band)
                .filter(ee.Filter.date(startDate, endDate));

var visualization = {
  bands: Band,
  min: min,
  max: max,
  palette: [
    '000080', '0000d9', '4000ff', '8000ff', '0080ff', '00ffff',
    '00ff80', '80ff00', 'daff00', 'ffff00', 'fff500', 'ffda00',
    'ffb000', 'ffa400', 'ff4f00', 'ff2500', 'ff0a00', 'ff00ff',
  ]
};

print ("No of Images: ", dataset2.size())  

Map.addLayer(dataset2, visualization, 'Data');
Map.addLayer(AOI_viz, {palette: ['blue']}, 'AOI')


var chart2 = ui.Chart.image.seriesByRegion({
  imageCollection: dataset2, 
  regions: aoi, 
  reducer: ee.Reducer.mean(), 
  band: Band, 
  scale: scale, 
  xProperty: 'system:time_start',
  // seriesProperty:  PropertyName //uncomment if line 12 is uncommented
  })
print (chart2)





