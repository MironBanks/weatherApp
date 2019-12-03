const wDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const wMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

window.addEventListener('load', () => {
  let long;
  let lat;
  const resultsHTML = '';
  const tableHTML = '';
  const location = document.querySelector('#location');
  const dayTime = document.querySelector('#dayTime');
  const tempDescription = document.querySelector('#summary');
  const currentTemp = document.querySelector('#currentTemp');
  const showTemp = document.querySelector('.temperature span');
  const currentHumidty = document.querySelector('#humidty');
  const currentWind = document.querySelector('#wind');
  const currentPrecip = document.querySelector('#perciptation');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}${dsApi}${lat},${long}`;
      fetch(api)
        .then(respomse => {
          return respomse.json();
        })
        .then(data => {
          console.log(data);
          const {
            icon,
            temperature,
            summary,
            humidity,
            windSpeed,
            precipProbability
          } = data.currently;
          const ts = new Date(data.currently.time * 1000);
          const forecastDate = `${wDay[ts.getDay()]} ${
            wMonth[ts.getMonth()]
          } ${ts.getDate()}`;
          const celsius = (temperature - 32) * (5 / 9);

          // Set DOM elements from API
          /*currentTemp.textContent =
            `${Math.round((temperature - 32) * (5 / 9))}` + ` C`;*/
          currentTemp.textContent = `${Math.round(celsius)}` + ` C`;
          tempDescription.textContent = summary;
          dayTime.textContent = `${wDay[ts.getDay()]} ${
            wMonth[ts.getMonth()]
          } ${ts.getDate()}`;
          location.textContent = data.timezone;
          currentHumidty.textContent = `Humidity ${Math.round(humidity * 10)}%`;
          currentWind.textContent = `Winds ${Math.round(windSpeed)} mph`;
          currentPrecip.textContent = `Precipitation ${precipProbability *
            100}%`;

          //set icon
          setIcons(icon, document.querySelector('#weatherIcon'));

          //

          //render the forcasts tabs
          document.getElementById(
            'dailyForecast'
          ).innerHTML = renderWeeklyForecast(data.daily);
          document.getElementById(
            'weeklyForecast'
          ).innerHTML = renderDailyForecast(data.hourly);
        });
    });
  }
  // render icon from skycon
  function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: 'white' });
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});

//render the daily forecast
function renderDailyForecast(fcData) {
  let resultsHTML =
    '<tr><th>Time</th><th>Conditions</th><th>Temp</th><th>Precip</th></tr>';
  rowcount = fcData.data.length;
  if (rowcount > 8) {
    rowcount = 8;
  }

  for (i = 0; i < rowcount; i++) {
    let ts = new Date(fcData.data[i].time * 1000);
    let summary = '';
    let tempHigh = 0;
    let timeValue;

    //unix time needs to be formatted for display
    let hours = ts.getHours();
    if (hours > 0 && hours <= 12) {
      timeValue = '' + hours;
    } else if (hours > 12) {
      timeValue = '' + (hours - 12);
    } else if (hours == 0) {
      timeValue = '12';
    }
    timeValue += hours >= 12 ? ' PM' : ' AM'; // get AM/PM

    summary = fcData.data[i].summary;
    tempHigh = `${Math.round(fcData.data[i].temperature - 32 * (5 / 9))}&deg`;
    let precipProbability = `${Math.round(
      fcData.data[i].precipProbability * 100
    )}%`;
    resultsHTML += renderRow(timeValue, summary, tempHigh, precipProbability);
  }

  return resultsHTML;
}

//render the weekly forecast
function renderWeeklyForecast(fcData) {
  let resultsHTML =
    '<tr><th>Day</th><th>Conditions</th><th>Hi</th><th>Lo</th></tr>';
  rowcount = fcData.data.length;
  if (rowcount > 8) {
    rowcount = 8;
  }

  for (i = 0; i < rowcount; i++) {
    let ts = new Date(fcData.data[i].time * 1000);

    let dayTime = wDay[ts.getDay()];
    let summary = fcData.data[i].summary;
    let tempHigh = `${Math.round(
      fcData.data[i].temperatureHigh - 32 * (5 / 9)
    )}&deg`;
    let tempLow = `${Math.round(
      fcData.data[i].temperatureLow - 32 * (5 / 9)
    )}&deg`;

    resultsHTML += renderRow(dayTime, summary, tempHigh, tempLow);
  }

  return resultsHTML;
}

//template function to render grid colums
function renderRow(dayTime, summary, tempHigh, colVal4) {
  return `<tr><td>${dayTime}</td><td>${summary}</td><td>${tempHigh}</td><td>${colVal4}</td></tr>`;
}
