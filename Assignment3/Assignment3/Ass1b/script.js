document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector("input[name='gender']:checked").value;
  const hobbies = Array.from(document.querySelectorAll("input[name='hobbies']:checked"))
                       .map(h => h.value);

  // Open new page with results
  const newPage = window.open("", "_blank");
  newPage.document.write("<h2>Registration Details</h2>");
  newPage.document.write(`<p><strong>Name:</strong> ${name}</p>`);
  newPage.document.write(`<p><strong>Mobile:</strong> ${mobile}</p>`);
  newPage.document.write(`<p><strong>Email:</strong> ${email}</p>`);
  newPage.document.write(`<p><strong>Password:</strong> ${password}</p>`);
  newPage.document.write(`<p><strong>Address:</strong> ${address}</p>`);
  newPage.document.write(`<p><strong>City:</strong> ${city}</p>`);
  newPage.document.write(`<p><strong>DOB:</strong> ${dob}</p>`);
  newPage.document.write(`<p><strong>Gender:</strong> ${gender}</p>`);
  newPage.document.write(`<p><strong>Hobbies:</strong> ${hobbies.join(", ")}</p>`);
});