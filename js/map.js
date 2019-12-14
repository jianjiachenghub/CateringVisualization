var map = new BMap.Map("chart_map"); 
var point = new BMap.Point(104.74, 31.47); 
map.centerAndZoom(point, 15);  
map.enableScrollWheelZoom(true)