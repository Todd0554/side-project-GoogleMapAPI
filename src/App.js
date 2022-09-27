import React, {useEffect} from 'react'
import {Center, Input, Button, ShowData} from './components/searchBox'
import './App.css';
import { Loader } from '@googlemaps/js-api-loader';

function App() {

  const runSpinner = () => {
    const splash = document.createElement('div')
    const lo = document.createElement('h1')
    lo.innerText = 'LOADING...'
    lo.id = 'loader'
    splash.classList.add('splash')
    const body = document.querySelector('body')
    body.prepend(splash)
    splash.appendChild(lo)
  }
  
  const stopSpinner = () => {
    const splash = document.querySelector('.splash')
    splash.remove()
  }
  
  const loader = new Loader({
    apiKey: "AIzaSyAI1thVh0FcREXtm-2zfheIoU9yBTNBZbE",
    libraries: ["places"]
  });
  
  useEffect(() => {
    loader
    .load()
    .then((google) => {
      initAutocomplete(google)
    })
    .catch(e => {
      console.log(e.message)
    });
  })
  
  
  
  
  const initAutocomplete = (x) => {
    const input = document.getElementById("searchbar");
    const autocomplete = new x.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const {lat, lng} = autocomplete.getPlace().geometry.location
      runSpinner()
      showWeather(lat(), lng())
      
      })
  }
  
  const showWeather = async (lat, lng) => {
      const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=1bdac9b23bd412c0b4695b226bf7a4c6`
      await fetch(weatherAPI)
                              .then(response => response.json())
                              .then(data => {
                                setData(data)
                                
                                stopSpinner()
                              })
                              .catch(err => console.log(err))
  }
  
  const setData = (data) => {
    
    document.getElementById("description").innerHTML = "Description: <br/>" + data.weather[0].description
  
    
    switch(data.weather[0].main.toLowerCase()) {
      case "clear":
        document.getElementById("mainWeather").innerHTML = '<i class="fa-solid fa-sun"></i>' + data.weather[0].main;
        break
      case "clouds":
        document.getElementById("mainWeather").innerHTML = '<i class="fa-solid fa-cloud"></i>' + data.weather[0].main;
        break
      default:
        document.getElementById("mainWeather").innerHTML = '<i class="fa-solid fa-face-smile"></i>';
    }
  }
  
  const searchBtn = async (google, e) => {
    var sydney = new google.maps.LatLng(-33.867, 151.195);
    var map = new google.maps.Map(document.getElementById('map'), {center: sydney, zoom: 15});
    var service = new google.maps.places.PlacesService(map);
    var request = {
      query: e.target.children[0].value,
      fields: ['name', 'geometry'],
    };

    await service.findPlaceFromQuery(request, function(results) {
      const {lat, lng} = results[0].geometry.location
      showWeather(lat(), lng());
  })
  }


  const setForm = (e) => {
    e.preventDefault()
    
    loader
    .load()
    .then(google => {
      searchBtn(google, e)
  })

    .catch(e => {
      console.log(e.message)
    });


}
  



  return (
    <Center>
      <form 
      onSubmit={setForm}
      >
        <Input id="searchbar" type="search" placeholder="Enter location..." />
        <Button id="search-button" ><i className="fa fa-search"></i></Button>
      </form>


      <div>
        <ShowData style={{margin:"auto"}} id="mainWeather"></ShowData>
      </div>
           
      <div style={{margin:"auto", width: "400px",textAlign: "center", height:"50px", border:"1px solid black"}} id="description"></div>
      <div id="map" style={{margin:"auto", width:"100px", height:"150px"}}></div>
    </Center>
  );
}

export default App;
