// Watch Video Tutorial https://youtu.be/vhwhPrlxDeg

var CHIRPS = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD"),
    soil = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02"),
    DEM = ee.Image("USGS/SRTMGL1_003"),
    s2 = ee.ImageCollection("COPERNICUS/S2"),
    modis = ee.ImageCollection("MODIS/006/MCD12Q1");

//Defining Study Area

//For Basin Baoundary
var dataset = ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_12")
//Map.addLayer (dataset)

var mainID = 4120031730 // Mahi Basin
// var mainID = 4120031610 //ID for Narmada Basin
// var mainID = 4120025450 //for Ganga
// var mainID = 4120031730 //for Mahi Basin
// var mainID = 4120027100 // Mahanadi
// var mainID = 4120027940 //Krishna Basin

var main = dataset.filter(ee.Filter.eq('MAIN_BAS', mainID))
print('No of Subbasins:', main.size());
var aoi = main;

// Defining dates/year
var date1 = '2017-01-01';
var date2 = '2018-01-01';

Map.addLayer (aoi, {}, 'aoi')

Map.centerObject (aoi)


// **************** R Factor ***************
var current = CHIRPS.filterDate(date1, date2).select('precipitation').sum().clip(aoi);
Map.addLayer (current, {}, 'Annual Rain', 0)
var R = ee.Image(current.multiply(0.363).add(79)).rename('R');
Map.addLayer(R, {min: 300, max: 900, palette: ['a52508','ff3818','fbff18','25cdff','2f35ff','0b2dab']}, 'R Factor Map', 0);

// **************** K Factor ***************
soil = soil.select('b0').clip(aoi).rename('soil')     
Map.addLayer(soil, {min: 0, max: 100, palette: ['a52508','ff3818','fbff18','25cdff','2f35ff','0b2dab']}, 'Soil', 0);

var K = soil.expression(
    "(b('soil') > 11) ? 0.0053" +
      ": (b('soil') > 10) ? 0.0170" +
        ": (b('soil') > 9) ? 0.045" +
           ": (b('soil') > 8) ? 0.050" +
            ": (b('soil') > 7) ? 0.0499" +
            ": (b('soil') > 6) ? 0.0394" +
            ": (b('soil') > 5) ? 0.0264" +
            ": (b('soil') > 4) ? 0.0423" +
            ": (b('soil') > 3) ? 0.0394" +
            ": (b('soil') > 2) ? 0.036" +
            ": (b('soil') > 1) ? 0.0341" +
            ": (b('soil') > 0) ? 0.0288" +
             ": 0")
             .rename('K').clip(aoi);              
              
Map.addLayer(K, {min: 0, max: 0.06, palette: ['a52508','ff3818','fbff18','25cdff','2f35ff','0b2dab']}, 'KFactor Map', 0);


// **************** LS Factor ***************

var elevation = DEM.select('elevation');
var slope1 = ee.Terrain.slope(elevation).clip(aoi);
    //Converting Slope from Degrees to %
var slope = slope1.divide(180).multiply(Math.PI).tan().multiply(100);
Map.addLayer(slope, {min: 0, max: 15, palette: ['a52508','ff3818','fbff18','25cdff','2f35ff','0b2dab']}, 'slope in %', 0);

var LS4 = Math.sqrt(500/100); 
var LS3 = ee.Image(slope.multiply(0.53));
var LS2 = ee.Image(slope).multiply(ee.Image(slope).multiply(0.076));
var LS1 = ee.Image(LS3).add(LS2).add(0.76);
var LS = ee.Image(LS1).multiply(LS4).rename("LS");
 
Map.addLayer(LS, {min: 0, max: 90, palette: ['a52508','ff3818','fbff18','25cdff','2f35ff','0b2dab']}, 'LS Factor Map', 0);


// **************** C Factor ***************

s2 = s2.filterDate(date1, date2).median().clip(aoi);
var image_ndvi = s2.normalizedDifference(['B8','B4']).rename("NDVI");

Map.addLayer (image_ndvi, {min: 0, max: 0.85, palette: ['FFFFFF','CC9966','CC9900', '996600', '33CC00', '009900','006600','000000']}, 'NDVI', 0);

var alpha = ee.Number(-2)
var beta = ee.Number (1)

var C1 = image_ndvi.multiply(alpha)
var oneImage = ee.Image(1).clip(aoi);
var C2 = oneImage.subtract(image_ndvi)
var C3 = C1.divide(C2).rename('C3')
var C4 = C3.exp()

var maxC4 = C4.reduceRegion({
  geometry: aoi, 
  reducer: ee.Reducer.max(), 
  scale: 3000,
  maxPixels: 475160679
})

var C5 = maxC4.toImage().clip(aoi)
var minC4 = C4.reduceRegion({
   
  geometry: aoi, 
  reducer: ee.Reducer.min(), 
  scale: 3000,
  maxPixels: 475160679
})

var C6 = minC4.toImage().clip(aoi)
var C7 = C4.subtract(C6)
var C8 = C5.subtract(C6)

var C = C7.divide(C8).rename('C')

Map.addLayer (C, {min: 0, max: 1, palette: ['FFFFFF','CC9966','CC9900', '996600', '33CC00', '009900','006600','000000']}, 'C Map',0);

 // **************** P Factor ***************
 
var lulc = modis.filterDate(date1, date2).select('LC_Type1')
        .first().clip(aoi).rename('lulc');
Map.addLayer (lulc, {}, 'lulc', 0) 

// Combined LULC & slope in single image
var lulc_slope = lulc.addBands(slope)

// Create P Facor map using an expression
var P = lulc_slope.expression(
    
     "(b('lulc') < 11) ? 0.8" +
      ": (b('lulc') == 11) ? 1" +
      ": (b('lulc') == 13) ? 1" +
      ": (b('lulc') > 14) ? 1" +
      ": (b('slope') < 2) and((b('lulc')==12) or (b('lulc')==14)) ? 0.6" +
    ": (b('slope') < 5) and((b('lulc')==12) or (b('lulc')==14)) ? 0.5" +
    ": (b('slope') < 8) and((b('lulc')==12) or (b('lulc')==14)) ? 0.5" +
    ": (b('slope') < 12) and((b('lulc')==12) or (b('lulc')==14)) ? 0.6" +
    ": (b('slope') < 16) and((b('lulc')==12) or (b('lulc')==14)) ? 0.7" +
    ": (b('slope') < 20) and((b('lulc')==12) or (b('lulc')==14)) ? 0.8" +
    ": (b('slope') > 20) and((b('lulc')==12) or (b('lulc')==14)) ? 0.9" +
    ": 1"
).rename('P').clip(aoi);
Map.addLayer (P, {}, 'P Factor', 0)

// **************  Estimating Soil Loss ******************
var soil_loss = ee.Image(R.multiply(K).multiply(LS).multiply(C).multiply(P)).rename("Soil Loss")


var style = ['490eff','12f4ff','12ff50','e5ff12','ff4812']

Map.addLayer (soil_loss, {min: 0, max: 10, palette: style}, 'Soil Loss', 0)

var SL_class = soil_loss.expression(
    "(b('Soil Loss') < 5) ? 1" +
      ": (b('Soil Loss') < 10) ? 2" +
      ": (b('Soil Loss') < 20) ? 3"+
      ": (b('Soil Loss') < 40) ? 4"+
             ": 5")
             .rename('SL_class').clip(aoi);  
Map.addLayer (SL_class, {min: 0, max: 5, palette: style}, 'Soil Loss Class')

var SL_mean = soil_loss.reduceRegion({
  geometry: aoi, 
  reducer: ee.Reducer.mean(), 
  scale: 500,
  maxPixels: 475160679
})

print ("Mean Soil Loss",SL_mean.get("Soil Loss"))

// Add reducer output to the Features in the collection.
var maineMeansFeatures = soil_loss.reduceRegions({
  collection: aoi,
  reducer: ee.Reducer.mean(),
  scale: 500,
});

print ("Mean Soil Loss of Each Subbasins",maineMeansFeatures)

//Calculating Area
var areaImage = ee.Image.pixelArea().addBands(
      SL_class)
var areas = areaImage.reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'class',
    }),
    geometry: aoi.geometry(),
    scale: 500,
    maxPixels: 1e10
    }); 
 
//print(areas)

var classAreas = ee.List(areas.get('groups'))
 
var className = classAreas.map(function(item) {
  var areaDict = ee.Dictionary(item)
  var classNumber = ee.Number(areaDict.get('class')).format()
  return ee.List(classNumber)  
})
//print(className)

var Area = classAreas.map(function(item) {
  var areaDict = ee.Dictionary(item)
  var area = ee.Number(
  areaDict.get('sum')).divide(1e6).round()
  return ee.List(area) 
})
//print(Area)
var className2 = ee.List(["Slight (<10)","Moderate (10-20)","High (20-30)","Very high (30-40)","Severe (>40)"])

print(ui.Chart.array.values(Area, 0, className2)
    .setChartType('PieChart')
    .setOptions({pointSize: 2, title: 'Soil Loss',}));

//////////////////////////////
var calculateClassArea = function(feature) {
    var areas = ee.Image.pixelArea().addBands(SL_class)
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
      groupField: 1,
      groupName: 'class',
    }),
    geometry: feature.geometry(),
    scale: 500,
    maxPixels: 1e10
    })
 
    var classAreas = ee.List(areas.get('groups'))
    var classAreaLists = classAreas.map(function(item) {
      var areaDict = ee.Dictionary(item)
      var classNumber = ee.Number(
        areaDict.get('class')).format()
      var area = ee.Number(
        areaDict.get('sum')).round()
      return ee.List([classNumber, area])
    })
 
    var result = ee.Dictionary(classAreaLists.flatten())
    var district = feature.get('HYBAS_ID')
    return ee.Feature(
      feature.geometry(),
      result.set('district', district))
}
 
var districtAreas = aoi.map(calculateClassArea);
//print (districtAreas)

var classes = ee.List.sequence(1, 5)
var outputFields = ee.List(
    ['district']).cat(classes).getInfo()
 
Export.table.toDrive({
    collection: districtAreas,
    description: 'class_area_by_subbasin',
    folder: 'earthengine',
    fileNamePrefix: 'class_area_by_subbasin',
    fileFormat: 'CSV',
    selectors: outputFields
    })

//Legend Panel

// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
 
//////////////////////////////////////////////// 
// Create legend title
var legendTitle = ui.Label({
  value: 'Soil Loss (t/hac/year)',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette =style;
 
// name of the legend
// var names = ["Slight","Moderate","High","Very high","Severe"];
var names = ["Slight (<10)","Moderate (10-20)","High (20-30)","Very high (30-40)","Severe (>40)"]
 
// Add color and and names
for (var i = 0; i < 5; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);
