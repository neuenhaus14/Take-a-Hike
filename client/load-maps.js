fetch('/api/googlemapskey') 
  .then(response => response.json())
  .then(data => {
    const {mapsApiKey} = data;
    console.log(mapsApiKey)
    loadMaps(mapsApiKey);
  })
  .catch(error => console.error('Error fetching API key:', error));

function loadMaps(mapsApiKey) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}