import React, { Component } from 'react';

var google=window.google, 
    map;
    

class Map extends Component {
	state={
		locations:[
			{title:'Campus Universitar', location:{lat:47.0447631, lng:21.9181616}}, 
			{title:'Zoo', location:{lat:47.0506082, lng:21.9203707}}, 
			{title:'Primaria Oradea', location:{lat:47.0559162, lng:21.9274467}}, 
			{title:'Biblioteca Judeteana', location:{lat:47.0489117, lng:21.9216187}}, 
			{title:'Parcul Balcescu' , location:{lat:47.0510173, lng:21.9235386}} 
		],
		filteredLocations:[],
		markers:[]
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

		if(this.state.filteredLocations.length === 0){
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
				this.state.markers.push(marker);
				bounds.extend(marker.position);
				marker.addListener('click', function() {
					populateInfoWindow(this, largeInfoWindow);
				});			
			});
		} else {
			this.state.filteredLocations.map((location)=> {
				var position= location.location;
				var title=location.title;
				var marker= new google.maps.Marker({
					map:map,
					position:position,
					title:title,
					animation:google.maps.Animation.DROP,
					id: location.title
				});
				this.state.markers.push(marker);
				bounds.extend(marker.position);
				marker.addListener('click', function() {
					populateInfoWindow(this, largeInfoWindow);
				});			
			});
		}
		

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

	filterLocations(location) {		
		this.setState(state=>({
			filteredLocations: state.locations.filter((l) => l.title === location)			
		}))
		this.setState(state=>({
			markers: state.markers.filter((m)=> m.id === location)			
		}))
	}

	

	render() {
		this.initMap();

		var filteredLocations=this.state.filteredLocations;
    	var allLocations=this.state.locations;
		return (
			<div id='filterMenu'>
				<h2>Oradea Locations</h2>
				<select id='searchField' onChange={(e) => 
					this.filterLocations(e.target.value)}>
					<option value='Biblioteca Judeteana'>Biblioteca Judeteana</option>
					<option value='Campus Universitar'>Campus Universitar</option>
					<option value='Parcul Balcescu'>Parcul Balcescu</option>
					<option value='Primaria Oradea'>Primaria Oradea</option>
					<option value='Zoo'>Zoo</option>
				</select>
				<ul id='listedLocations'>
					{filteredLocations.length > 0 && (
						<div>
							{filteredLocations.map((location) => (
								<li key={location.title}>{location.title}</li>
							))}
						</div>
						
					)}
					{filteredLocations.length === 0 && (
						<div>
							{allLocations.map((location) => (
								<li key={location.title}>{location.title}</li>
							))}
						</div>
					)}
					
				</ul>
			</div>	
		);
	}
	
}

export default Map