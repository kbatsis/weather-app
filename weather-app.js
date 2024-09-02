$(function() {
    $("#inputBtn").on("click", function() {
        reset()
        fetchData($("#cityInput").val().trim())
    })

    $("#cityInput").on("keyup", function(e) {
        if (e.key === "Enter") {
            reset()
            fetchData($("#cityInput").val().trim())
        }
    })
})

function fetchData(city) {
    if (!city) return

    const xhr  = new XMLHttpRequest()
    let apiKey;

    xhr.open("GET", `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`, true)
    xhr.timeout = 5000
    xhr.ontimeout = () => showErrorApi()
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handleResults(JSON.parse(xhr.responseText))
            } else if (xhr.status === 404) {
                showErrorNotFound()
            } else {
                showErrorApi()
            }
        }
    }
    xhr.send()
}

function handleResults(response) {
    const data24h = get24hData(response.list)
    showForecast(data24h)   
}

function get24hData(data) {
    return data.slice(0, 8)
}

function showForecast(data) {
    data.forEach(item => {
        const date = new Date(item.dt * 1000)
        const hour = date.getHours()
        const icon = item.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`
        const description = item.weather[0].description
        const temperature = Math.round(item.main.temp - 273.15)
        const humidity = item.main.humidity
        const windSpeed = item.wind.speed
        const windDirection = item.wind.deg

        let clone = $(".forecast.hidden").clone().removeClass("hidden")
        clone.find("#time").html(`${hour}:00`)
        clone.find("#icon").attr("src",iconUrl)
        clone.find("#description").text(description)
        clone.find("#temperature").html(`${temperature}°C`)
        clone.find("#humidity").html(`${humidity}% RH`)
        clone.find("#wind").html(`${Math.round(windSpeed * 3.6)} km/h, ${windDirection}°`)
        clone.appendTo(".forecast-wrapper")
    })
}

function reset() {
    $(".forecast-wrapper").empty()
}

function showErrorApi() {
    $("#errorApi").clone().removeClass("hidden").appendTo(".forecast-wrapper")
}

function showErrorNotFound() {
    $("#errorNotFound").clone().removeClass("hidden").appendTo(".forecast-wrapper")
}