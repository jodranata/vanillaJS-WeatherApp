//  set weather
const locationText = document.querySelector('.location h1');
const tempContainer = document.querySelector('.temperature');
const tempNumber = document.querySelector('.temperature h2');
const tempDegree = document.querySelector('.temperature .degree');
const condition = document.querySelector('.weather-condition h2');
const iconCanvas = document.querySelector('.icon');
const weatherCondition = document.querySelector('.weather-condition h3');

function displayIcon(icon, canvas) {
  const skycons = new Skycons({ color: 'white' });
  const iconsID = icon.replace(/-/g, '_').toUpperCase();
  skycons.play();
  skycons.set(canvas, Skycons[iconsID]);
}

function displayWeather(temperature, summary, location) {
  const celcius = ((temperature - 32) * (5 / 9)).toFixed(2);
  locationText.textContent = location;
  condition.textContent = summary;
  tempNumber.textContent = celcius;
  tempContainer.addEventListener('click', () => {
    tempDegree.textContent = tempDegree.innerHTML === 'C' ? 'F' : 'C';
    tempNumber.textContent =
      tempDegree.innerHTML === 'C' ? celcius : temperature;
  });
}

function changeBackground(weather) {
  document.body.style.setProperty(
    'background-image',
    `var(--${weather}-bg-color)`
  );
}

function setWeather() {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        long = pos.coords.longitude;
        lat = pos.coords.latitude;
        const proxy = `https://cors-anywhere.herokuapp.com/`;
        const endpoint = `${proxy}https://api.darksky.net/forecast/b14c657d8184187eb717333b996ee2ef/${lat},${long}`;
        const weather = fetch(endpoint)
          .then(blob => blob.json())
          .then(data => {
            console.log(data);
            const { temperature, summary, icon } = data.currently;
            const locationZone = data.timezone;
            const celcius = ((temperature - 32) * (5 / 9)).toFixed(2);
            //  display the weather into the DOM
            displayWeather(temperature, summary, locationZone);
            displayIcon(icon, iconCanvas);
            changeBackground(icon);
            weatherCondition.textContent = icon
              .replace(/-/g, ' ')
              .toUpperCase();
          });
      },
      err => {
        console.error('LOCATION DISABLED');
      }
    );
  }
}

window.addEventListener('load', setWeather);
