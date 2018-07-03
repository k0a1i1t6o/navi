var map, start, end, pos, arr, radius, type, distance=50, count=0, i=0, infoWindow, directionsService, directionsDisplay;

$(function() {
    $('.root_btn').click(function(e) {
        e.preventDefault();         // hrefが無効になり、画面遷移が行わない

        start = $('#start').val();
        end = $('#end').val();

        google.maps.event.addDomListener(window, 'load', initMap());
        google.maps.event.addDomListener(window, 'load', calculateAndDisplayRoute(start, end));
        // $('#btn').trigger('click');
    });

    $("#currentPosition").click(function(){
        google.maps.event.addDomListener(window, 'load', initMap());
    });
    
    $(".search_btn").on("click", function(){
        search();
        count++;
        console.log(arr.length);
        if(count < arr.length){
            setTimeout(function(){
                $(".search_btn").click();
            },250);
        }else{
            alert("検索終了");
            count=0;
            i=0;
        }
    });

    setSubCategory();
    $("#select_box").on("change", setSubCategory);

    $(".near_btn").on("click", function(){
        switch(distance){
            case 100:
                distance = 50;
                break;
            case 150:
                distance = 100;
                break;
            case 500:
                distance = 150;
                break;
            case 1000:
                distance = 500;
                break;
        }   

        target = document.getElementById("merter");
        target.innerHTML = distance;
    });

    $(".distant_btn").on("click", function(){
        switch(distance){
            case 50:
                distance = 100;
                break;
            case 100:
                distance = 150;
                break;
            case 150:
                distance = 500;
                break;
            case 500:
                distance = 1000;
                break;
        }

        target = document.getElementById("merter");
        target.innerHTML = distance;
    });

    target = document.getElementById("merter");
    target.innerHTML = distance;



    
});

function initMap() {
couny=0;
i=0;
directionsService = new google.maps.DirectionsService;
directionsDisplay = new google.maps.DirectionsRenderer();

map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {lat: 41.85, lng: -87.65}
});
infoWindow = new google.maps.InfoWindow();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);

        //現在地に大きい円と小さい円を描く
        bigCircle = {
            center: pos,
            radius: 50,
            map: map,
            strokeColor: '#44BBFF',
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: '#44BBFF',
            fillOpacity: 0.2
        },
        smallCircle = {
            center: pos,
            radius: 3,
            map: map,
            strokeColor: '#44BBFF',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#44BBFF',
            fillOpacity: 0.8
        },
        circle1 = new google.maps.Circle(bigCircle),
        circle2 = new google.maps.Circle(smallCircle);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

directionsDisplay.setMap(map);
}

function calculateAndDisplayRoute(start, end) {
    count=0;
    i=0;
    if(start == "現在地"){
        start = new google.maps.LatLng(pos);
    }
    var request = {
        origin: start,         // 開始地点
        destination: end,      // 終了地点
        travelMode: google.maps.TravelMode.DRIVING,     // [自動車]でのルート
        // avoidHighways: false,        // 高速道路利用フラグ
    };
 
    // インスタンス作成
    directionsService = new google.maps.DirectionsService();
 
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            arr = response.routes[0].overview_path; // ルートを表す座標配列
        } else {
            alert('ルートが見つかりませんでした…');
        }
    });

}

function search(){
    // for (var i in arr) {
        var service = new google.maps.places.PlacesService(map);
        type = $("#select_subbox > option:selected").text();
        setType();
        console.log("i="+i);
        var request = {
            location:　arr[i],
            radius: distance,
            types: [type]
        };

        console.log(distance);
        service.nearbySearch(request, callback);
    // }
    i++;
}

var k=0;
function callback(results, status) {
    // console.log(results[0].name);
    k++;
    console.log("k="+k);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var j = 0; j < results.length; j++) {
            console.log(results.length);                     
            createMarker(results[j]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    console.log(placeLoc);
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc
    });
    google.maps.event.addListener(marker, 'click', function() {
        // console.log(place.name);
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
        });
}

google.maps.event.addDomListener(window, 'load', function() {
    initMap();
    calculateAndDisplayRoute(start, end);
});

function autoComplete() {
    var latlngFrom = new google.maps.LatLng(33.889577, 130.885284);
    var latlngTo   = new google.maps.LatLng(33.989577, 130.985284);
    //プレイスを検索する領域
    var bounds = new google.maps.LatLngBounds(latlngFrom, latlngTo);
    //検索文字列を取得
    var input = document.getElementById('start');
    var input2 = document.getElementById('end');
    //検索オプション
    var options = {
    bounds: bounds,
    types: ['address'],
    componentRestrictions: {country: 'jp'}
    };
    //オートコンプリート
    autocomplete = new google.maps.places.Autocomplete(input,options);
    autocomplete2 = new google.maps.places.Autocomplete(input2,options);
}
window.onload = autoComplete;

function setSubCategory(){
    var subList = [
        ["コンビニ", "スーパー", "銀行", "デパート"],
        ["喫茶店", "ファミリーレストラン", "ファーストフード"],
        ["ガソリンスタンド", "レンタカー"]
    ];

    var i = $("#select_box > option:selected").val();

    var sub = $("#select_subbox");
    sub.empty();

    for(var j=0; j < subList[i].length; j++){
        sub.append("<option value='" + j + "'>" + subList[i][j] + "</option>");
    }

}

function setType(){
    switch(type){
        case "コンビニ":
            type = "convenience_store";
            break;
        case "スーパー":
            type = "grocery_or_supermarket";
            break;
        case "銀行":
            type = "bank";
            break;
        case "デパート":
            type = "department_store";
            break;
        case "喫茶店":
            type = "cafe";
            break;
        case "ファミリーレストラン":
            type = "restaurant";
            break;
        case "ファーストフード":
            type = "meal_takeaway";
            break;
        case "ガソリンスタンド":
            type = "gas_station";
            break;
        case "レンタカー":
            type = "car_rental";
            break;
    }
}