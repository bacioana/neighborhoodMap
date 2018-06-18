import React, { Component } from 'react';

var markers=[], 
    google=window.google, 
    map;

class Map extends Component {
	state={
		locations:[
			{title:'Campus Universitar', location:{lat:47.0447631, lng:21.9181616}}, 
			{title:'Zoo', location:{lat:47.0506082, lng:21.9203707}}, 
			{title:'Primaria Oradea', location:{lat:47.0559162, lng:21.9274467}}, 
			{title:'Biblioteca Judeteana', location:{lat:47.0489117, lng:21.9216187}}, 
			{title:'Parcul Balcescu' , location:{lat:47.0510173, lng:21.9235386}} 
		]
	}

	initMap () {
		map= new google.maps.Map(document.getElementById('map'), {
		  center: {lat: 47.04650050000001, lng: 21.9189438},
		  zoom: 15
		}); 
		this.markersMaker();
		  
	}

	markersMaker() {
		var largeInfoWindow= new google.maps.InfoWindow();
		var bounds= new google.maps.LatLngBounds();

		this.state.locations.map((location)=> {
			var position= location.location;
			var title=location.title;
			var marker= new google.maps.Marker({
				map:map,
				position:position,
				title:title,
				animation:google.maps.Animation.DROP,
				id: location.title
			});
			markers.push(marker);
			bounds.extend(marker.position);
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfoWindow);
			});			
		});

		function populateInfoWindow (marker, infoWindow) {
			if (infoWindow.marker !== marker) {
				infoWindow.marker = marker;
				infoWindow.setContent('<div>'+marker.title+'</div>');
				infoWindow.open(map,marker);

				infoWindow.addListener('closeclick', function() {
					infoWindow.marker=null;
				});
			}
		}

		map.fitBounds(bounds);
	}

	

	render() {
		this.initMap();
		return (
			<div>I am here</div>
		);
	}
	
}

export default Map