window.onload = () => {
  let method = 'dynamic';

  // if you want to statically add places, de-comment following line:
  // method = 'static';
  if (method === 'static') {
      let places = staticLoadPlaces();
      return renderPlaces(places);
  }

  if (method !== 'static') {
      // first get current user location
      return navigator.geolocation.getCurrentPosition(function (position) {

          // than use it to load from remote APIs some places nearby
          dynamicLoadPlaces(position.coords)
              .then((places) => {
                  renderPlaces(places);
              })
      },
          (err) => console.error('Error in retrieving position', err),
          {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 27000,
          }
      );
  }
};

function staticLoadPlaces() {
  return [
      {
          name: "Your place name",
          location: {
              lat: 44.493271, // change here latitude if using static data
              lng: 11.326040, // change here longitude if using static data
          }
      },
  ];
}

// getting places from REST APIs
function dynamicLoadPlaces(position) {
  


  //Adding
  var posLat  = position.latitude  + 0.00010
  var posLong = position.longitude + 0.00010

  // Foursquare API
  let endpoint = `https://overpass.openstreetmap.fr/api/interpreter?data=[out:json];node(${position.latitude},${position.longitude},${posLat},${posLong});node(around:1000)[amenity=toilets];out;`;
  console.log(endpoint);
  return fetch(endpoint)
      .then((res) => {
          return res.json()
              .then((resp) => {
                // console.log(resp.elements);
                  return resp.elements;
              })
      })
      .catch((err) => {
          console.error('Error with places API', err);
      })
};

function renderPlaces(places) {
  let scene = document.querySelector('a-scene');

  places.forEach((place) => {
      let latitude = place.lat;
      let longitude = place.lon;

      // add place name
      
      // let text = document.createElement('a-link');
      // text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
      // text.setAttribute('gltf-model', './Assets/GLTF/toilet2.gltf');
      // text.setAttribute('scale', '45 45 45');
      // text.setAttribute('title', place.tags.name);
      // text.setAttribute('color', 'black');
  

      let text = document.createElement('a-text');
      text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
      text.setAttribute('gltf-model', './Assets/GLTF/toilet2.gltf');
      text.setAttribute('scale', '45 45 45');
      text.setAttribute('value', place.tags.name);
      text.setAttribute('color', 'black');
           
      

      let model = document.createElement('a-entity');
      model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
      model.setAttribute('gltf-model', './Assets/GLTF/toilet2.gltf');
      model.setAttribute('scale', '45 45 45');
      model.setAttribute('rotation', '0 180 0');
      
      


      model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
      });

      

      //scene.appendChild(model);
      scene.appendChild(text);
  });
}