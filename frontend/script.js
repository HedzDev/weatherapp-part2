const cityList = document.querySelector("#cityList");
const addCity = document.querySelector("#addCity");
const inputName = document.querySelector("#cityNameInput");
const logout = document.querySelector("#logout");

const BASE_URL = "http://localhost:3000";

fetch(`${BASE_URL}/weather`, {
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    if (data && data.weather.length > 0) {
      data.weather.forEach((city) => {
        renderHtml(city);
      });
    }
  });

addCity.addEventListener("click", async () => {
  try {
    let cityName = inputName.value;

    if (!cityName) {
      return;
    }

    const response = await fetch(`${BASE_URL}/weather`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityName }),
    });
    const data = await response.json();
    if (data.result) {
      renderHtml(data.weather);
    }
  } catch (error) {
    console.error(error);
  }
});

function renderHtml(data) {
  const html = `
     <div class="cityContainer">
        <p class="name">${data.cityName}</p>
        <p class="description">${data.description}</p>
        <img class="weatherIcon" src="${data.imageUrl}" />
        <div class="temperature">
            <p class="tempMin">${data.tempMin}°C</p>
            <span>-</span>
            <p class="tempMax">${data.tempMax}°C</p>
        </div>
        <button class="deleteCity" id="${data.cityName}">Delete</button>
    </div>
    `;

  cityList.insertAdjacentHTML("afterbegin", html);

  deleteCity();
}

function deleteCity() {
  const deleteBtns = document.querySelectorAll(".deleteCity");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const response = await fetch(`${BASE_URL}/weather/${this.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.result) {
        this.parentNode.remove();
      }
    });
  });
}

logout.addEventListener("click", async () => {
  const response = await fetch(`${BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  const isDisconnected = await response.json();

  if (isDisconnected.result) {
    window.location.assign("login.html");
  }
});
