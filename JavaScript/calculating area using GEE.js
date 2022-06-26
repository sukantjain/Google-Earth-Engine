//Calculating Area in Google Earth Engine
//Link to video tutorial
// Part-1 https://youtu.be/Q-f3CWWKAB4
// Part-2 https://youtu.be/GuVUMCQT1tU
// Part-3 https://youtu.be/Nm9vpH5mvjs



// Importing the data
var dataset = ee.ImageCollection('MODIS/006/MCD12Q1')
          .filterDate("2017-01-01", "2018-01-01")
          .first();
var igbpLandCover = dataset.select('LC_Type1');
var igbpLandCoverVis = {
  min: 1.0,
  max: 17.0,
  palette: [
    '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
    'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
    '69fff8', 'f9ffa4', '1c0dff'
  ],
};

print (igbpLandCover)
//Map.addLayer(igbpLandCover, igbpLandCoverVis, 'IGBP Land Cover');

//Defining the area
var gaul = ee.FeatureCollection("FAO/GAUL/2015/level2")
var goa = gaul.filter(ee.Filter.eq('ADM1_NAME', 'Goa'))

Map.addLayer (goa)
Map.centerObject(goa)

var goaLULC = igbpLandCover.clip(goa)
Map.addLayer(goaLULC, igbpLandCoverVis, 'Goa LULC');

var goaArea = goa.geometry().area()
goaArea = ee.Number(goaArea).divide(1000000).round()

//Area of region in SqKm.
print (goaArea)


var urban = goaLULC.eq(13)
Map.addLayer (urban, {}, 'urban')


var areaImage = urban.multiply(ee.Image.pixelArea())
var area = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry:goa.geometry(),
  scale:500,
  maxPixels : 1e10
  
})

var urbanArea = ee.Number(area.get('LC_Type1')).divide(1000000).round()

//Area of only urban class in region in SqKm.
print ("Area of Urban class", urbanArea)

////////////////////////////////////////////
///Area Calculation by Class
///////////////////////////////////////////

var areaImage = ee.Image.pixelArea().addBands(goaLULC)

var areas = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField:1,
    groupName:'class'
  }),
  geometry:goa.geometry(),
  scale:500,
  maxPixels : 1e10
  
})

print (areas)

var classAreas = ee.List(areas.get('groups'))

var classAreaLists = classAreas.map(function(item){
  var areaDict = ee.Dictionary(item)
  var classNumber = ee.Number(areaDict.get('class')).format()
  var area = ee.Number(
    areaDict.get('sum')).divide(1000000).round()
    return ee.List([classNumber, area])
})

var result = ee.Dictionary(classAreaLists.flatten())
print (result)

////////////////////////////////////////////////
/// Area calculation by class for diffrent region
//////////////////////////////////////////////


var  calClassArea = function(feature){
  var areaImage = ee.Image.pixelArea().addBands(igbpLandCover)

var areas = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField:1,
    groupName:'class'
  }),
  geometry:feature.geometry(),
  scale:500,
  maxPixels : 1e10
  
})
var classAreas = ee.List(areas.get('groups'))

var classAreaLists = classAreas.map(function(item){
  var areaDict = ee.Dictionary(item)
  var classNumber = ee.Number(areaDict.get('class')).format()
  var area = ee.Number(
    areaDict.get('sum')).divide(1000000).round()
    return ee.List([classNumber, area])
})
var result = ee.Dictionary(classAreaLists.flatten())
var district = feature.get('ADM2_NAME')
return ee.Feature(feature.geometry(),
      result.set('district',district))
}

var distrcitAreas = goa.map(calClassArea)
print (distrcitAreas)

var classes = ee.List.sequence(1,17)
var outputFields = ee.List(['district']).cat(classes).getInfo()

Export.table.toDrive ({
  collection: distrcitAreas,
  description: 'AreaByClass',
  folder: 'earthengine2',
  fileFormat: 'CSV',
  selectors: outputFields
})