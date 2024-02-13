function password_Handeller() {
  const password = document.querySelector("#password");
  const confirm_password = document.querySelector("#confirm_password");
  console.log("hi");
  if (password.value != confirm_password.value) {
    password.classList.remove("matching");
    confirm_password.classList.remove("matching");

    password.classList.add("not_matching");
    confirm_password.classList.add("not_matching");
  } else {
    password.classList.remove("not_matching");
    confirm_password.classList.remove("not_matching");
    password.classList.add("matching");
    confirm_password.classList.add("matching");
  }
}
document
  .querySelector("#confirm_password")
  .addEventListener("input", password_Handeller);
