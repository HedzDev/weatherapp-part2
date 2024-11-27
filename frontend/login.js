const registerName = document.querySelector("#registerName");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const register = document.querySelector("#register");
const connectionEmail = document.querySelector("#connectionEmail");
const connectionPassword = document.querySelector("#connectionPassword");
const connection = document.querySelector("#connection");

const BASE_URL = "http://localhost:3000";

register.addEventListener("click", async () => {
  const registeringData = {
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value,
  };

  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registeringData),
  });

  const isRegistered = await response.json();

  if (isRegistered.result) {
    window.location.assign("index.html");
  }
});

connection.addEventListener("click", async () => {
  const connectingData = {
    email: connectionEmail.value,
    password: connectionPassword.value,
  };

  const response = await fetch(`${BASE_URL}/users/connect`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connectingData),
  });

  const isConnected = await response.json();

  if (isConnected.result) {
    window.location.assign("index.html");
  }
});
