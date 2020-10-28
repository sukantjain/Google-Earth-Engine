import ee
from ee_plugin import Map

#Define AOI
point = ee.Geometry.Point(77.411,23.283)

# Load an image Collection. Landsat 8
LandsatCollection = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")\
        .filterDate('2019-01-01', '2020-01-01')\
        .filterBounds(point)

Landsatmean = LandsatCollection.mean()

# Define visualization parameters.
vizParam1 = {'bands': ['B5', 'B4', 'B3'],
             'min': 500, 'max': 4000, 'gamma': 1.3}
Map.addLayer(Landsatmean, vizParam1, 'Landsat 8 ')

# Load an image Collection. Sentinel 2
S2collection = ee.ImageCollection("COPERNICUS/S2_SR")\
        .filterDate('2019-01-01', '2020-01-01')\
        .filterBounds(point)

S2mean = S2collection.mean()


vizParam2 = {'bands': ['B8', 'B4', 'B3'],
             'min': 2000, 'max': 5000, 'gamma': 1.3}
Map.addLayer(S2mean, vizParam2, 'Sentinel 2 ')
