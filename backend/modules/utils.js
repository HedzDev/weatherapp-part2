function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function checkBody(body, keys) {
  let isValid = true;

  keys.forEach((key) => {
    if (!body[key] || body[key] === "") {
      isValid = false;
    }
  });

  return isValid;
}

module.exports = { capitalize, checkBody };
