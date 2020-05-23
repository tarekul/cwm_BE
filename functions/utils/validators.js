const emailValidator = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const isEmpty = i => {
  if (i.trim() === "") return true;
  else return false;
};

exports.validateSignUp = (email, password, confirmPassword, name) => {
  const errors = {};
  if (isEmpty(email)) errors.email = "Must enter an email";
  else if (!emailValidator(email))
    errors.email = "Email is formatted incorrectly";

  if (isEmpty(password)) errors.password = "Must enter password";
  else if (password !== confirmPassword)
    errors.password = "passwords must match";

  if (isEmpty(name)) errors.name = "Must enter handle";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLogin = (email, password) => {
  const errors = {};
  if (isEmpty(email)) errors.email = "Must enter an email";
  else if (!emailValidator(email))
    errors.email = "Must enter correctly formatted email";

  if (isEmpty(password)) errors.password = "Must enter password";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateRecipeDetails = source_url => {
  const errors = {};
  if (isEmpty(source_url)) errors.source_url = "url cannot be empty";
  else if (!validURL(source_url))
    errors.source_url = "url is not formatted correctly";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
