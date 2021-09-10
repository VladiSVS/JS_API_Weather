//2b0cb25f287b7f394bba52521a54c757
class CurrentWeather {
    constructor(city, tempCday, weatherDescr, weatherIcon) {
        this.city = city
        this.tempCday = tempCday
        this.weatherDescr = weatherDescr
        this.weatherIcon = weatherIcon
    }

    showCurrentWeather() {
        document.getElementById('sectionHead').innerHTML = `
        <div>
            <h1>${this.city}</h1>
            <p>${this.tempCday} <span>&#8451;</span></p>
            <p>${this.weatherDescr}</p>
        </div>
        <img src="assets/img/${this.weatherIcon}.png">
        `
    }
}

class FutureWeather {
    constructor(tempCday, tempCnight, weekday, day, month, weatherDescr, weatherIcon) {
        this.tempCday = tempCday
        this.tempCnight = tempCnight
        this.weekday = weekday
        this.day = day
        this.month = month
        this.weatherDescr = weatherDescr
        this.weatherIcon = weatherIcon
    }
    showFutureWeather() {

        document.getElementById('cards').innerHTML += `
        <article>
            <h1>${this.weekday}</h1>
            <p>${this.day} ${this.month}</p>
            <img src="assets/img/${this.weatherIcon}.png">
            <p>${this.weatherDescr}</p>
            <div>
                <p>${this.tempCday} <span>&#8451;</span></p>
                <p>${this.tempCnight} <span>&#8451;</span></p>
            </div>
        </article>
        `
    }
}

document.querySelector('input[type="text"]').addEventListener('keypress', (event) => {

    if (event.which === 13) {
        event.preventDefault()
        searchWeather()
        document.getElementById('searchCity').value = ' '
    }
})

async function searchWeather() {
    document.getElementById('cards').innerHTML = ''
    let searchCity = document.getElementById('searchCity').value

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity},DE&lang=de&appid=2b0cb25f287b7f394bba52521a54c757`)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            let city = data.name
            let tempKday = data.main.temp
            let weatherDescr = data.weather[0].description
            let weatherIcon = data.weather[0].icon
            let tempCday = (tempKday - 273.15).toFixed(0)
            let coordLat = data.coord.lat
            let coordLon = data.coord.lon
            let cityWeather = new CurrentWeather(city, tempCday, weatherDescr, weatherIcon)
            cityWeather.showCurrentWeather()
            geolocation(coordLat, coordLon)
        })

    geolocation = (lat, lon) => {
        let coordLat = lat
        let coordLon = lon

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordLat}&lon=${coordLon}&exclude=minutely,hourly&lang=de&appid=2b0cb25f287b7f394bba52521a54c757`)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                data.daily.forEach((elt) => {
                    let tempKday = elt.temp.day
                    let tempCday = (tempKday - 273.15).toFixed(0)
                    let tempKnight = elt.temp.night
                    let tempCnight = (tempKnight - 273.15).toFixed(0)
                    let time = new Date(elt.dt * 1000)
                    let weekday = time.toLocaleString("de", { weekday: 'short' })
                    let day = time.toLocaleString("de", { day: 'numeric' })
                    let month = time.toLocaleString("de", { month: 'long' })
                    let weatherDescr = elt.weather[0].description
                    let weatherIcon = elt.weather[0].icon
                    let cityWeather = new FutureWeather(tempCday, tempCnight, weekday, day, month, weatherDescr, weatherIcon)
                    cityWeather.showFutureWeather()
                })
            })
    }
}
