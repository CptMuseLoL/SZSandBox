//Angular App Module and Controller
angular.module('SzDemo', [])
.controller('MapCtrl', function ($scope, $http) {
	
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(37.773285, -122.417725),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    var selectedMarker;
    var icon1 = "images/marker-default.png";
    var icon2 = "images/marker-hover.png";
    var icon3 = "images/marker-selected.png";
			
	getData();
	getCondition(38.49535370, -121.51647186);//default condition of California Department of Transportation
    
    var createMarker = function (info){
        

        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.lon),
            icon: icon1
        });
        
        marker.content = '<div class="infoWindowContent">Selected Cam: \n' + info.camid + '</div>';
          
        google.maps.event.addListener(marker, 'mouseover', function() {
            if(selectedMarker != marker)
                marker.setIcon(icon2);
            else
                marker.setIcon(icon3);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
            if(selectedMarker != marker)
                marker.setIcon(icon1);
            else
                marker.setIcon(icon3);
        });
				
		google.maps.event.addListener(marker, 'click', function(){
            resetMarkerIcons();
            infoWindow.setContent('<h4>' + marker.content + '</h4>');
            infoWindow.open($scope.map, marker);
            selectedMarker = marker;
			getCondition(info.lat, info.lon);
			$scope.linktext = info.linktext;
			$scope.city = info.city;
			$scope.state = info.state;
			$scope.lastUpdated = info.updated;
			$scope.CURRENTIMAGEURL = info.CURRENTIMAGEURL;
			marker.setIcon(icon3);//TODO
        });
        
        $scope.markers.push(marker);      
    }  
    
    function resetMarkerIcons() {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setIcon(icon1);
        }

    }
    
    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
		marker.setIcon(icon2);
    }
    
    function getData() {
    	$http.get("http://api.wunderground.com/api/cf5cd194f6a7c1b9/webcams/q/CA/San_Francisco.json")
        .success(function(response){
					$scope.locations = response;
					$scope.linktext = response.webcams[0].linktext;
					$scope.city = response.webcams[0].city;
					$scope.state = response.webcams[0].state;
					$scope.lastUpdated = response.webcams[0].updated;
					$scope.CURRENTIMAGEURL = response.webcams[0].CURRENTIMAGEURL;
					angular.forEach($scope.locations.webcams, function(webcam){
						createMarker(webcam);
					})
                 })
        .error(function () {
        	console.log(error.message)
        });
    }
	
	function getCondition(lat, lon){
		    	$http.get("http://api.wunderground.com/api/cf5cd194f6a7c1b9/conditions/q/" + lat + "," + lon + ".json")
        .success(function(response){
                 $scope.condition = response;
                 })
        .error(function () {
        	console.log(error.message)
        });
	}
	




});
