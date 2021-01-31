//This Script is created by Sukant Jain, 
//Research Scientist, National Institute of Hydrology, Bhopal

// Define your Area of Intersest either via shape file or created Geometry
var aoi = ee.FeatureCollection("users/sukkiisukant/Shipra_Ujjain");

// Define period for study
var startDate = '2019-01-01'
var endDate = '2020-01-01'

// Year for Land Use
var year = 2019

Map.centerObject(aoi)
var soil_class = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02")
              .select('b0').clip(aoi)
              .rename('soil');

// Converting soil textute into soil group
// A == 1, B == 2,  C == 3, D == 4
var soil_grp = soil_class.expression(
    "(b('soil') > 10) ? 4" +
      ": (b('soil') > 4) ? 3" +
        ": (b('soil') > 1) ? 2" +
           ": (b('soil') > 0) ? 1" +
             ": 0"
).rename('soil');
var modis = ee.ImageCollection('MODIS/006/MCD12Q1')
            .filter(ee.Filter.calendarRange(year,year,'year'))
var lulc = modis.select('LC_Type1').first().clip(aoi)
            .rename('lulc');
              
//Map.addLayer(soil, {}, "Soil texture class");
//Map.addLayer(lulc, {}, "LULC");

// Combined LULC & SOil in single image
var lulc_soil = lulc.addBands(soil_grp)
//print (lulc_soil);
Map.addLayer (lulc_soil, {}, 'Soil & LULC', 0)

// Create CN map using an expression
var CN_whole = lulc_soil.expression(
    "(b('soil') == 1) and(b('lulc')==1) ? 35" +
     ": (b('soil') == 1) and(b('lulc')==2) ? 25" +
        ": (b('soil') == 1) and(b('lulc')==3) ? 45" +
        ": (b('soil') == 1) and(b('lulc')==4) ? 39" +
        ": (b('soil') == 1) and(b('lulc')==5) ? 45" +
        ": (b('soil') == 1) and(b('lulc')==6) ? 49" +
        ": (b('soil') == 1) and(b('lulc')==7) ? 68" +
        ": (b('soil') == 1) and(b('lulc')==8) ? 36" +
        ": (b('soil') == 1) and(b('lulc')==9) ? 45" +
        ": (b('soil') == 1) and(b('lulc')==10) ? 30" +
        ": (b('soil') == 1) and(b('lulc')==11) ? 95" +
        ": (b('soil') == 1) and(b('lulc')==12) ? 67" +
        ": (b('soil') == 1) and(b('lulc')==13) ? 72" +
        ": (b('soil') == 1) and(b('lulc')==14) ? 63" +
        ": (b('soil') == 1) and(b('lulc')==15) ? 100" +
        ": (b('soil') == 1) and(b('lulc')==16) ? 74" +
        ": (b('soil') == 1) and(b('lulc')==17) ? 100" +
          ": (b('soil') == 2) and(b('lulc')==1) ? 50" +
          ": (b('soil') == 2) and(b('lulc')==2) ? 55" +
          ": (b('soil') == 2) and(b('lulc')==3) ? 66" +
          ": (b('soil') == 2) and(b('lulc')==4) ? 61" +
          ": (b('soil') == 2) and(b('lulc')==5) ? 66" +
          ": (b('soil') == 2) and(b('lulc')==6) ? 69" +
          ": (b('soil') == 2) and(b('lulc')==7) ? 79" +
          ": (b('soil') == 2) and(b('lulc')==8) ? 60" +
          ": (b('soil') == 2) and(b('lulc')==9) ? 66" +
          ": (b('soil') == 2) and(b('lulc')==10) ? 58" +
          ": (b('soil') == 2) and(b('lulc')==11) ? 95" +
          ": (b('soil') == 2) and(b('lulc')==12) ? 78" +
          ": (b('soil') == 2) and(b('lulc')==13) ? 82" +
          ": (b('soil') == 2) and(b('lulc')==14) ? 75" +
          ": (b('soil') == 2) and(b('lulc')==15) ? 100" +
          ": (b('soil') == 2) and(b('lulc')==16) ? 84" +
          ": (b('soil') == 2) and(b('lulc')==17) ? 100" +
            ": (b('soil') == 3) and(b('lulc')==1) ? 73" +
              ": (b('soil') == 3) and(b('lulc')==2) ? 70" +
              ": (b('soil') == 3) and(b('lulc')==3) ? 77" +
              ": (b('soil') == 3) and(b('lulc')==4) ? 74" +
              ": (b('soil') == 3) and(b('lulc')==5) ? 77" +
              ": (b('soil') == 3) and(b('lulc')==6) ? 79" +
              ": (b('soil') == 3) and(b('lulc')==7) ? 86" +
              ": (b('soil') == 3) and(b('lulc')==8) ? 73" +
              ": (b('soil') == 3) and(b('lulc')==9) ? 77" +
              ": (b('soil') == 3) and(b('lulc')==10) ? 71" +
              ": (b('soil') == 3) and(b('lulc')==11) ? 95" +
              ": (b('soil') == 3) and(b('lulc')==12) ? 85" +
              ": (b('soil') == 3) and(b('lulc')==13) ? 87" +
              ": (b('soil') == 3) and(b('lulc')==14) ? 83" +
              ": (b('soil') == 3) and(b('lulc')==15) ? 100" +
              ": (b('soil') == 3) and(b('lulc')==16) ? 90" +
              ": (b('soil') == 3) and(b('lulc')==17) ? 100" +
              "  : (b('soil') == 4) and(b('lulc')==1) ? 79" +
                ": (b('soil') == 4) and(b('lulc')==2) ? 77" +
                ": (b('soil') == 4) and(b('lulc')==3) ? 83" +
                ": (b('soil') == 4) and(b('lulc')==4) ? 80" +
                ": (b('soil') == 4) and(b('lulc')==5) ? 83" +
                ": (b('soil') == 4) and(b('lulc')==6) ? 89" +
                ": (b('soil') == 4) and(b('lulc')==7) ? 89" +
                ": (b('soil') == 4) and(b('lulc')==8) ? 79" +
                ": (b('soil') == 4) and(b('lulc')==9) ? 83" +
                ": (b('soil') == 4) and(b('lulc')==10) ? 78" +
                ": (b('soil') == 4) and(b('lulc')==11) ? 95" +
                ": (b('soil') == 4) and(b('lulc')==12) ? 89" +
                ": (b('soil') == 4) and(b('lulc')==13) ? 89" +
                ": (b('soil') == 4) and(b('lulc')==14) ? 87" +
                ": (b('soil') == 4) and(b('lulc')==15) ? 100" +
                ": (b('soil') == 4) and(b('lulc')==16) ? 92" +
                ": (b('soil') == 4) and(b('lulc')==17) ? 100" +
                     ": (b('soil') == 0) ? 100" +
                    ": 0"
);
var CN2 = CN_whole.clip(aoi).rename('CN2');
Map.addLayer(CN2, {}, 'CN2 values', 0);

var CN1 = CN2.expression(
    'CN2 /(2.281-(0.0128*CN2))',{
      'CN2': CN2.select('CN2')
    }).rename('CN1'); 
    
var CN3 = CN2.expression(
    'CN2 /(0.427+(0.00573*CN2))',{
      'CN2': CN2.select('CN2')
    }).rename('CN3');  
  

var S_image1 = CN1.expression(
    '(25400/CN1)-254', {
      'CN1': CN1.select('CN1')
}).rename('S_value1');

var S_image2 = CN2.expression(
    '(25400/CN2)-254', {
      'CN2': CN2.select('CN2')
}).rename('S_value2');

var S_image3 = CN3.expression(
    '(25400/CN3)-254', {
      'CN3': CN3.select('CN3')
}).rename('S_value3');

Map.addLayer (S_image1, {}, 'S1', 0)
Map.addLayer (S_image2, {}, 'S2', 0)
Map.addLayer (S_image3, {}, 'S3', 0)

//var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
//                  .filter(ee.Filter.date('2019-08-01', '2019-08-03'))
//print (rainfall)
//Map.addLayer (rainfall, {}, 'Rainfall')

var rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                  .filter(ee.Filter.date(startDate, endDate))
//print (rainfall);
//Map.addLayer (rainfall, {}, 'Rainfall', 0);

var listOfImages = rainfall.toList(rainfall.size());
print ('No of Rainfall Images: ', listOfImages);

var calculated_list = listOfImages.map(function(img) {
    var index = listOfImages.indexOf(img)
    img = ee.Image(img);
    var firstIndex = ee.Algorithms.If(index.lte(3), index, index.subtract(4));
    var firstImage = ee.Image(listOfImages.get(firstIndex));
    var secondIndex = ee.Algorithms.If(index.lte(3), index, index.subtract(3));
    var secondImage = ee.Image(listOfImages.get(secondIndex));
    var thirdIndex = ee.Algorithms.If(index.lte(3), index, index.subtract(2));
    var thirdImage = ee.Image(listOfImages.get(thirdIndex));
    var fourthIndex = ee.Algorithms.If(index.lte(3), index, index.subtract(1));
    var fourthImage = ee.Image(listOfImages.get(fourthIndex));
    var change = ee.Image(firstImage.add(secondImage).add(thirdImage)
                  .add(fourthImage).add(img).copyProperties(img, ["system:time_start"]));
    return change;
})

//print (calculated_list)

var listOfAMC = calculated_list.size();
print ('No of AMC Images: ', listOfAMC);
var AMCcollection = ee.ImageCollection(calculated_list);
//print (AMCcollection)
Map.addLayer (AMCcollection, {}, 'AMCcollection', 0)

//joining Rainfall Collection and AMCcollection

// Define the join and filter
var Join = ee.Join.inner();
var FilterOnStartTime = ee.Filter.equals({'leftField': 'system:time_start', 
                                          'rightField': 'system:time_start'
                                         });

// Join the two collections, passing entries through the filter
var rain_AMC = Join.apply(rainfall, AMCcollection, FilterOnStartTime);

// A function to merge the bands together after a join
// the bands are referred to as the 'primary' and 'secondary' properties
var MergeBands = function(aRow) {
  var anImage = ee.Image.cat(aRow.get('primary'), aRow.get('secondary'));
  return anImage;
};


var merged = rain_AMC.map(MergeBands);
var MergedRain_AMC = ee.ImageCollection(merged);

print('MergedRain_AMC: ', MergedRain_AMC);
Map.addLayer (MergedRain_AMC, {}, 'MergedRain_AMC', 0);

var zeroImage = ee.Image(0);

// Defining function for Runoff .
var runoff_func = function(image) {
  
  var AMC = image.select('precipitation_1')
  var ppt = image.select('precipitation')
  var AMCreplaced = S_image2.where(AMC.lte(13), S_image1);
  var AMCreplaced2 = AMCreplaced.where(AMC.gt(28), S_image3)
  var s_value = AMCreplaced2.select('S_value2')

  var Q2 = image.expression(
    '((ppt-(0.2*S_image))**2)/(ppt-(0.2*S_image)+S_image)', {
      'ppt': image.select('precipitation'),
      'S_image': AMCreplaced2.select('S_value2')
});
  
  var Q3 = Q2.where(ppt.lt(s_value.multiply(0.2)), zeroImage)
  return Q3.clip(aoi).rename('runoff')
                .copyProperties(image, ["system:time_start"]);
};
var runoff =  MergedRain_AMC.map(runoff_func)
print (runoff)

// Joining Rainfall and Runoff
var Join = ee.Join.inner();
var FilterOnStartTime = ee.Filter.equals({'leftField': 'system:time_start', 
                                          'rightField': 'system:time_start'
                                         });

// Join the two collections, passing entries through the filter
var JoinedRR = Join.apply(rainfall, runoff, FilterOnStartTime);

// A function to merge the bands together after a join
// the bands are referred to as the 'primary' and 'secondary' properties
var MergeBands = function(aRow) {
  var anImage = ee.Image.cat(aRow.get('primary'), aRow.get('secondary')).clip(aoi);
  return anImage;
};


var RainfallRunoff1 = JoinedRR.map(MergeBands);
var RainfallRunoff = ee.ImageCollection(RainfallRunoff1);

//Visualization Parameters
var palettes = require('users/gena/packages:palettes');
var palette = palettes.colorbrewer.RdYlGn[9];

var pptVis = {
  min: 0,
  max: 2000,
  palette: palette,
};

Map.addLayer (RainfallRunoff, {}, 'RainfallRunoff',0)
Map.addLayer (RainfallRunoff.select('precipitation').sum(), pptVis, 'Rainfall')
Map.addLayer (RainfallRunoff.select('runoff').sum(), pptVis, 'runoff')


print(RainfallRunoff);

var chart = ui.Chart.image.series({
  imageCollection: RainfallRunoff, 
  region: aoi, 
  reducer: ee.Reducer.mean(), 
  scale: 500,
}).setOptions({
 title: 'Rainfall Runoff Time series (Mean)',
 vAxis: {title: 'Rainfall & Runoff in mm'},
 hAxis: {title: 'Dates'},
 });
print(chart);