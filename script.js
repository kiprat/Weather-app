const userTab = document.querySelector("[user-tab]");
const searchTab = document.querySelector("[search-tab]");
const grantLocation = document.querySelector("[grant-location]");
const searchForm = document.querySelector("[data-search-form]");
const loading = document.querySelector("[data-loading]");
const userInfo = document.querySelector("[user-info]");
const weatherCont = document.querySelector("[weather-cont]");


let currentTab = userTab;

const apiKey = "9637f16dc30fffcfde3327d3646a99f1";

currentTab.classList.add("current-tab");

searchForm.classList.add("active");
loading.classList.add("active");
// grantLocation.classList.add("active");
userInfo.classList.add("active");

//getSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        
        if(searchForm.classList.contains("active")){
            userInfo.classList.add("active");
            searchForm.classList.remove("active");
            grantLocation.classList.add("active");
        }
        else{
            searchForm.classList.add("active");
            userInfo.classList.add("active");
            getSessionStorage();
        }
    }
}
userTab.addEventListener("click",() => {
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getSessionStorage(){

    
    let coordinates = sessionStorage.getItem("user-coordinates");
    if(!coordinates){
        grantLocation.classList.remove("active");
    }
    else{
        myCoordinates = JSON.parse(coordinates);
        fetchMyWeatherInfo(myCoordinates);
    }
}

async function fetchMyWeatherInfo(myCoordinates){
    const {lat,lon} = myCoordinates;
    grantLocation.classList.add("active");
    loading.classList.remove("active");

    try{
        const weatherInfoJson = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        const data = await weatherInfoJson.json();
        loading.classList.add("active");

        userInfo.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(e){
        console.log("ERROR");
    }
}

function renderWeatherInfo(data){
    let placeName = document.getElementById("place");
    let countryIcon = document.getElementById("place-icon");
    let weatherIcon = document.getElementById("weather-type-icon");
    let desc = document.getElementById("weather-type");
    let windSpeed = document.querySelector("[wind-speed]");
    let humidity = document.querySelector("[humidity-percent]");
    let cloud = document.querySelector("[cloud-percent]");
    let temperature = document.getElementById("temp");

    placeName.innerText = data?.name;
    let g = data?.sys?.country.toLowerCase();
    countryIcon.src = `https://flagcdn.com/144x108/${g}.png`;

    desc.innerText = data?.weather[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;

    temperature.innerText = data?.main?.temp + "°C";
    windSpeed.innerText = data?.wind?.speed + "m/s";
    humidity.innerText = data?.main?.humidity + "%";
    cloud.innerText = data?.clouds?.all + "%";
}

const dataGrantBtn = document.querySelector("[data-grant-access]");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}

function showPosition(position){
    const myCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(myCoordinates));
    fetchMyWeatherInfo(myCoordinates);
}

dataGrantBtn.addEventListener("click",getLocation());

const searchInput = document.querySelector("[data-input-form]");

searchForm.addEventListener("submit",(e)=>{
    
    let cityName = searchInput.value;
    if(cityName !== "") {
        e.preventDefault();
        fetchWeatherSearch(cityName);
    }
});

async function fetchWeatherSearch(cityName){
    loading.classList.remove("active");
    userInfo.classList.add("active");
    grantLocation.classList.add("active");
    try{
        let dataWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);

        let dataJson = await dataWeather.json();
        loading.classList.add("active");
        userInfo.classList.remove("active");
        renderWeatherInfo(dataJson);
    }
    catch(e){

    }
}