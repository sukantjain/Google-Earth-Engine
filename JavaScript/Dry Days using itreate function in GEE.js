// Watch Video Tutorial  https://youtu.be/PcayDDiyXWY


var viz = {"opacity":0.63,"bands":["precipitation"],"min":0,"max":250,"palette":["280eff","0cffe9","6cff10","fff80e","ff4108"]},
    rain = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY");

var data = rain.filter(ee.Filter.calendarRange(2017,2017,'year'));
var init = ee.Image.constant(0)
          .rename('precipitation')
          .cast({'precipitation':'long'})

function calcDryDays(current, previous){
  var mask = current.remap([0],[1],0);
  var lastImage = ee.Image(ee.List(previous).get(-1));
  var updated = lastImage.add(mask).multiply(mask)
  return ee.List(previous).add(updated)
}
var result = ee.List(data.iterate(calcDryDays,ee.List([init])))
var resultCollection = ee.ImageCollection(result)
print (resultCollection.first())

Map.addLayer (resultCollection.max(),viz,'max')

