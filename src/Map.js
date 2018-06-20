 /* global google */
import React, { Component } from 'react';

var google,
	map,
    largeInfoWindow,
    bounds;

function populateInfoWindow (marker, infoWindow) {
	if (infoWindow.marker !== marker) {
		infoWindow.marker = marker;
		infoWindow.setContent('<div>'+marker.title+'</div>'+'<div>'+marker.address+'</div>');
		infoWindow.open(map,marker);

		infoWindow.addListener('closeclick', function() {
			infoWindow.marker=null;
		});
	}
}

class Map extends Component {
	state= {
		locations:[
			{title:'Campus Universitar', address:'Oradea', location:{lat:47.0447631, lng:21.9181616}}, 
			{title:'Zoo', address:'Calea Matei Basarab, nr.1 ', location:{lat:47.0506082, lng:21.9203707}}, 
			{title:'Primaria Oradea', address:'strada Primariei, nr. 1', location:{lat:47.0559162, lng:21.9274467}}, 
			{title:'Biblioteca Judeteana', address: 'strada Armatei Romane, nr. 1', location:{lat:47.0489117, lng:21.9216187}}, 
			{title:'Parcul Balcescu', address: 'strada Sucevei, nr. 79', location:{lat:47.0510173, lng:21.9235386}} 
		],
		filteredLocations:[],
		markers:[]
	}

	componentDidMount () {
		fetch('https://maps.googleapis.com/maps/api/js?key=AIzaSyDq3SNkJ763OHorapaGdrvFyekXBb64150&v=3', {
			method: 'GET',
			headers: {
		     "Access-Control-Allow-Origin": '*',
		     "Access-Control-Allow-Methods": 'GET'
		   }
		}).then(response=>console.log(response))
		.catch(err=>this.handleError(err));
	}

  	handleError (error) {
  		console.log(error);
  	}

 	initMap () { 		
		map= new google.maps.Map(document.getElementById('map'), {
		  center: {lat: 47.04650050000001, lng: 21.9189438},
		  zoom: 15
		});		
		this.markersMaker();
  	}

	markersMaker() {
		largeInfoWindow= new google.maps.InfoWindow();
		bounds= new google.maps.LatLngBounds();

		if(this.state.filteredLocations.length === 0){
			this.state.locations.map((location)=> {
				var position= location.location;
				var title= location.title;
				var address= location.address;
				var marker= new google.maps.Marker({
					map: map,
					position: position,
					title: title,
					address: address,
					animation: google.maps.Animation.DROP,
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
				var title= location.title;
				var address= location.address;
				var marker= new google.maps.Marker({
					map: map,
					position: position,
					title: title,
					address: address,
					animation: google.maps.Animation.DROP,
					id: location.title
				});
				this.state.markers.push(marker);
				bounds.extend(marker.position);
				marker.addListener('click', function() {
					populateInfoWindow(this, largeInfoWindow);
				});			
			});
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

	resetFilters() {
		this.setState(state=>({
			filteredLocations: []
		}))
	}

	handleClick(event) {		
		this.state.markers.map((marker)=>{			
			if(marker.title === event.textContent) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				populateInfoWindow(marker, largeInfoWindow);			
			} else {
				marker.setAnimation(google.maps.Animation.DROP);
			}			
		});
	}

	hamburgerMenuClick (e) {
		var menu= document.getElementById('filterMenu');
		menu.classList.add('open');
	}

	closeHamburgerMenu () {
		var menu= document.getElementById('filterMenu');
		menu.classList.remove('open');
	}


	

	render() {

		var filteredLocations=this.state.filteredLocations;
    	var allLocations=this.state.locations;
		return (
			<div>
				<div id='hamburgerMenu' onClick={(e)=>this.hamburgerMenuClick(e)}>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div id='filterMenu'>
					<button id='closeButton' onClick={(e)=>this.closeHamburgerMenu(e)}>X</button>
					<h2>Oradea Locations</h2>
					<select id='searchField' onChange={(e) => 
						this.filterLocations(e.target.value)}>
						<option value='Biblioteca Judeteana'>Biblioteca Judeteana</option>
						<option value='Campus Universitar'>Campus Universitar</option>
						<option value='Parcul Balcescu'>Parcul Balcescu</option>
						<option value='Primaria Oradea'>Primaria Oradea</option>
						<option value='Zoo'>Zoo</option>
					</select>
					<button id='resetFilters' onClick={()=>this.resetFilters()}>Reset</button>
					<ul id='listedLocations'>
						{filteredLocations.length > 0 && (
							<div>
								{filteredLocations.map((location) => (
									<li key={location.title} onClick={(e)=>this.handleClick(e.target)}>{location.title}</li>
								))}
							</div>
							
						)}
						{filteredLocations.length === 0 && (
							<div>
								{allLocations.map((location) => (
									<li key={location.title} onClick={(e)=>this.handleClick(e.target)}>{location.title}</li>
								))}
							</div>
						)}
						
					</ul>
				</div>	
			</div>
			
		);
	}
	
}

export default Map