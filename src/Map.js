import React, { Component } from 'react'

var google,
	map,
    largeInfoWindow,
    bounds;

function populateInfoWindow (marker, infoWindow) {

	if (infoWindow.marker !== marker) {
		infoWindow.marker = marker;
		var title='';
		if(marker.wikiTitle.length>0) {
			title=marker.wikiTitle;
			infoWindow.setContent(`<div>${title}</div><div>Info by Wikipedia</div>`);
		} else {
			title=marker.title;
			infoWindow.setContent(`<div>${title}</div><div>${marker.address}</div>`);
		}
		
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
		const fetchGoogleMaps= require('fetch-google-maps');
		fetchGoogleMaps({
			apiKey: 'AIzaSyDq3SNkJ763OHorapaGdrvFyekXBb64150',
			language: 'en',
			libraries: ['geometry']
		}).then((maps) => {
			map= new maps.Map(document.getElementById('map'), {
			  center: {lat: 47.04650050000001, lng: 21.9189438},
			  zoom: 15
			});	
			this.initMap(map,maps);
		}).catch(err=>this.handleError(err))		
	}

  	handleError (error) {
  		const errorHTML='<span>An error occured while loading the map.</span>';
  		document.getElementByTagName('body').insertAdjacentHTML(errorHTML);
  	}

 	initMap (map,maps) { 
 		google = maps;
		this.markersMaker();
  	}

  	makeMarkerVariables(location) {
  		var position= location.location;
		var title= location.title;
		var address= location.address;
		var lat=location.location.lat;
		var long= location.location.lng;
		var marker= new google.Marker({
			map: map,
			position: position,
			title: title,
			address: address,
			animation: google.Animation.DROP,
			id: location.title
		});
		// fetch informations from wikipedia about this location
		fetch('https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord='+lat+'|'+long+'&gsradius=10000&gslimit=10&format=json&formatversion=2&origin=*', {
			method: 'GET',
			dataType: 'json; charset=utf-8'			
			}).then(data=>data.json()).then(data=>data.query.geosearch).then((data)=>{
				if(data.length>0) {
					marker.wikiTitle=data[0].title;
				}
			})

		this.state.markers.push(marker);		
		bounds.extend(marker.position);	
		marker.addListener('click', function() {
			populateInfoWindow(marker, largeInfoWindow);		
		});	
  	}

	markersMaker() {
		largeInfoWindow= new google.InfoWindow();
		bounds= new google.LatLngBounds();

		if(this.state.filteredLocations.length === 0){
			this.state.locations.map((location)=> {
				this.makeMarkerVariables(location);		
			});
		} else {
			this.state.filteredLocations.map((location)=> {
				this.makeMarkerVariables(location);		
			});
		}
		map.fitBounds(bounds);
	}		

	filterLocations(location) {	
		this.setState(state=>({
			filteredLocations: state.locations.filter((l) => l.title === location)									
		}))

	}

	resetFilters() {
		this.setState(state=>({
			filteredLocations: []
		}))
		this.state.markers.map((marker)=>{				
			marker.setAnimation(google.Animation.DROP);	
		})
	}

	handleClick(event) {
		this.state.markers.map((marker)=>{		
			if(marker.title === event.textContent) {
				marker.setAnimation(google.Animation.BOUNCE);
				populateInfoWindow(marker, largeInfoWindow);			
			} else if(marker.animation === google.Animation.BOUNCE){
				marker.setAnimation(google.Animation.DROP);
			}			
		})
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
						{this.state.filteredLocations.length > 0 && (
							<div>
								{this.state.filteredLocations.map((location) => (
									<li key={location.title} onClick={(e)=>this.handleClick(e.target)}>{location.title}</li>
								))}
							</div>
							
						)}
						{this.state.filteredLocations.length === 0 && (
							<div>
								{this.state.locations.map((location) => (
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