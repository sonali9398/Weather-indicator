
// const API_key = "716b2e8248433725ba3f52aa1fb8d9e8";

// async function showWeather(){
//     try{
//         let city = "goa";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API_key}`);

//         const data =await response.json();
//         console.log("weather data:-> " +data);

//     }
//     catch(err){

//     }

//     // let latitude = 15.3333;
//     // let longitude = 74.0833;
    

//     // let newPara = document.createElement('p');
//     // newPara.textContent = `$ {data?.main?.temp.toFixed(2)} C`

//     // document.body.appendChild(newPara);

// }

// async function getCustomeWeather(){
//     let latitude = 15.33;
//     let longitude = 18.333;

//     let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API_key}`);
//     let data = await result.json();

//     console.log(data);
// }


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFoundImg = document.querySelector(".notFound");

let currentTab = userTab; //to open in default
const API_key = "716b2e8248433725ba3f52aa1fb8d9e8";
currentTab.classList.add("current-tab");  
getfromSessionStorage();


function switchTab(clickedTab){
    if (clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if(!localCordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const coordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);

    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");
    notFoundImg.classList.remove("active");

    //api cal;
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active"); 

        notFoundImg.classList.add("active");


    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed");
    const humidity = document.querySelector("[data-humidity");
    const cloudiness = document.querySelector("[data-cloudiness");

    console.log(weatherInfo);

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

// function undefined(){
//     const defi = document.querySelector("[data-defi]");
//     defi.src = `./not-found.png`;
// }

function getLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geo
        notFoundImg.classList.add("active");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
        
    if (cityName != "")   
        return notFoundImg.add("active");   
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFoundImg.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        
        notFoundImg.classList.add("active");
    }

}