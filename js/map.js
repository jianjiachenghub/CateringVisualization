var SampleJSONData = [
    {
        "id": '73A64FDAFFC',
        "title": "总裁办",
                "subs": [
            {
                "id": '73At4FDoFFC',
                "title": "张三"
            },
                        {
                "id": '73At4FpAFFC',
                "title": "李四"
            },
            {
                "id": '73AtwFDAFFC',
                "title": "数据中心",
                "subs": [
                    {
                        "id": '13At4FDAFFC',
                        "title": "王五"
                    },
                    {
                        "id": '83At4FDAFFC',
                        "title": "赵武"
                    },
                                        {
                        "id": '83Al4FDAFFC',
                        "title": "通讯中心",
                                                "subs": [
                                                    {
                                            "id": '73At4FmAFFC',
                                            "title": "谢一"
                                        },
                                                    {
                                            "id": '73At4FpAFFC',
                                            "title": "谢四"
                                        }
                                                ]
                    }
                ]
            }
        ]
    },
    {
        "id": '72A64FDAFFC',
        "title": "技术部",
        "subs": [
            {
                "id": '73At4FDAFFC',
                "title": "赵小刚"
            },
            {
                "id": '73AtuFDAFFC',
                "title": "李小刚"
            },
            {
                "id": '73yt4FDAFFC',
                "title": "王小刚"
            }
        ]
    }
];
var gData=[]
var colorArrays = []
for(let i=0;i<24;i++){
    colorArrays.push('#' + Math.random().toString(16).substr(2, 6).toUpperCase())
}
console.log(colorArrays)
var map = new BMap.Map("chart_map"); 
var point = new BMap.Point(104.74, 31.47); 
map.centerAndZoom(point, 15);  
map.enableScrollWheelZoom(true)
map.setMapStyle({style:'midnight'});  

  //localSearch.enableAutoViewport(); //允许自动调节窗体大小
 // 然后我们就可以开始做最关键的一步了，就是获取地址的具体经纬度：
  
 function searchByStationName(keyword,path,type) {
    //map.clearOverlays();//清空原来的标注
    (function(keyword){
        var localSearch = new BMap.LocalSearch(map);
        localSearch.setSearchCompleteCallback(function (searchResult) {
          let poi = searchResult.getPoi(0);
          if(!poi)return
          let result = poi.point.lng + "," + poi.point.lat;
          console.log(result)
          map.centerAndZoom(poi.point, 13);
          var myIcon = new BMap.Icon("../icon/"+type+'.png', new BMap.Size(32, 32), {
        });
        // 创建标注对象并添加到地图 

          let marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat),{icon: myIcon});  // 创建标注，为要查询的地址对应的经纬度
          map.addOverlay(marker);
 /*          let label = new BMap.Label(keyword,{offset:new BMap.Size(20,-10)})
          marker.setLabel(label); */
          var data = '<div class="maptips"><div class="maptips_title" style="color:#3f292e;font-size:14px;font-weight:bold;margin-bottom: 10px;">'
          +keyword.split(" ")[1]      
          +'</div><div class="maptips_address" style="font-size:12px;" ><b>描述：</b>'
          +path
            +'</div></div>';
          var infoWindow = new BMap.InfoWindow(data);
          marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
      });
        localSearch.search(keyword);
    })(keyword)
    

}

function centerPath(keyword) {
    var localSearch = new BMap.LocalSearch(map);
    map.clearOverlays();//清空原来的标注
    localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);
        if(!poi){
            window.alert("没有该位置信息")
            return
        }
        var point = new BMap.Point(poi.point.lng, poi.point.lat)
        let marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地址对应的经纬度
        map.addOverlay(marker);
         let label = new BMap.Label(keyword,{offset:new BMap.Size(20,-10)})
         label.setStyle({ 

            　　color : "white", //字体颜色
            　　fontSize : "16px",//字体大小 　　
            
            　　backgroundColor :"0.05", //文本标注背景颜色　
            
            　　border :"0", 　　
            
            　　fontWeight :"bold",//字体加粗
            
            });
        marker.setLabel(label);
        map.centerAndZoom(point, 15);  
    });
    localSearch.search(keyword);

}



function ZoomControl(location,id){    
    // 设置默认停靠位置和偏移量  
    this.id = id
    this.defaultAnchor = location;    
    this.defaultOffset = new BMap.Size(10, 10);    
}    
// 通过JavaScript的prototype属性继承于BMap.Control   
ZoomControl.prototype = new BMap.Control();
ZoomControl.prototype.initialize = function(map){    
    // 创建一个DOM元素   
    var div = document.createElement("div");
  
    div.setAttribute('id',this.id)

    // 添加DOM元素到地图中   
    map.getContainer().appendChild(div);  

    // 将DOM元素返回  
    return div;    
 }

 var myZoomCtrl = new ZoomControl(BMAP_ANCHOR_TOP_LEFT,'tree');    
 var myZoomCtrl2 = new ZoomControl(BMAP_ANCHOR_TOP_RIGHT,'clear');    
// 添加到地图当中    
map.addControl(myZoomCtrl);
map.addControl(myZoomCtrl2);

$('#clear').append('<img class="vis" src="../icon/删除.png" </img>')
$('#clear').click(function(e){
    map.clearOverlays();//清空原来的标注
}
)
$('#clear').poshytip({
    className: 'tip-yellowsimple',
    content:'清理所有标记',
    showTimeout: 1,
    alignTo: 'target',
    alignX: 'center',
    offsetY: 5,
    allowTipHover: false

     });


$.ajax({
    url: '../data/shop.json',
    success: function (data) {
        gData = data
        let aaa = $('#tree').comboTree({
            map:map,
            source : data,
            isMultiple: false,
            isFirstClassSelectable:false, //第一级是否可选
            cascadeSelect: true,
            selectedlength:3 //最多可选
        });
/*         data.forEach((value,index)=>{
            value.children.forEach((value)=>{
                value.children.forEach((value,index)=>{
                    console.log(value.name)
                    searchByStationName("绵阳市"+value.name)
                })
            })
        }) */

    }
});

function area(e){

    let name = e.id.split('-')[1]
    var point = new BMap.Point(104.74, 31.47); 
        map.centerAndZoom(point, 15);  
    data = gData.filter((value)=>{
        return value.name == name
    })[0].children
    centerPath('绵阳市 '+name)
    data.forEach((value)=>{
        let type = $.trim(value.type)
        value.children.forEach((value)=>{
            (function(value){
                var data = value
                let path = "绵阳市 "+data.name;
                // 这里for循环同时执行了多个异步函数
                searchByStationName(path,value.path,type)
            })(value)
            

 
            
        })
    })
}

function type(e){
    window.event.cancelBubble =true;
    let name = e.id.split('-')[1]
    let type = e.id.split('-')[2]
    areaData = gData.filter((value)=>{
        return value.name == name
    })[0].children
    console.log(name)
    console.log(type)
    console.log(areaData)
    typeData = areaData.filter((value)=>{
        return value.type == type+' '
    })[0].children
    typeData.forEach((value)=>{

            var data = value
            let path = "绵阳市 "+data.name;
            // 这里for循环同时执行了多个异步函数
            searchByStationName(path,value.path,type)
 
        


        
    })
    
    
    
}

function where(e){
    let name = e.id
    centerPath('绵阳市 '+name)
}





