// Fetch and display posts when the page loads or after a new post is submitted
window.onload = fetchPosts;
async function fetchPosts() {
  try {
    const response = await fetch("http://localhost:8000/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Display posts based on the structure
    displayPosts(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function appendPost(post) {
  const container = document.querySelector(".otherPipContainer");

  const template = document.querySelector("#otherPipTemplate");
  if (!template) {
    console.error("Template not found!");
    return;
  }

  console.log("runs");

  const clone = template.content.cloneNode(true);
  clone.querySelector(".pipText").textContent = post.message;
  clone.querySelector(".avatarClone").src = post.image;
  clone.querySelector("#pipID").textContent = post.primaryKeys.length + 1;

  container.prepend(clone);
}

document.getElementById("pipButton").addEventListener("click", async (event) => {
  event.preventDefault();

  // Fetch primary keys from the server
  let primaryKeys = [];
  try {
    const response = await fetch("http://localhost:8000/posts"); // Ensure the URL is correct
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    primaryKeys = data.primaryKeys; // Extract the primary keys
  } catch (error) {
    console.error("Error fetching primary keys:", error);
    return; // Exit if there's an error fetching keys
  }

  // Get user input values
  const message = document.getElementById("message").value;
  const username = document.getElementById("username").value;

  // Prepare the data for the POST request, including primary keys
  const postData = {
    username: username,
    image: "./images/adventurer-1730982256035.svg",
    message: message,
    primaryKeys: primaryKeys, // Include the primary keys in the POST request data
  };

  const url = "http://localhost:8000/posts";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("result: ", result);
    console.log("postData: ", postData);

    // Append the new post directly to the DOM
    appendPost(postData);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Limit the number of characters
function LimitChars() {
  let text = document.getElementById("message").value;
  if (text.length >= 254) {
    document.getElementById("message").value = text.substring(0, 254);
  }
  document.getElementById("textLimit").innerHTML = `Limit: ${text.length}/255`;
}

document.getElementById("message").addEventListener("input", LimitChars);

// Clear the message
let flag = true;
function clearMessage() {
  if (flag) {
    document.getElementById("message").value = "";
    flag = false;
  }
}

document.getElementById("message").addEventListener("click", clearMessage);

// Function to display posts (handles different object structures)
function displayPosts(data) {
  const container = document.querySelector(".otherPipContainer");
  container.innerHTML = ""; // Clear the existing posts

  const posts = Array.isArray(data.posts) ? data.posts : Object.values(data);

  posts.forEach((post) => {
    const template = document.querySelector("#otherPipTemplate");
    if (!template) {
      console.error("Template not found!");
      return;
    }

    const clone = template.content.cloneNode(true);
    clone.querySelector(".pipText").textContent = post.message || "No message";
    clone.querySelector(".avatarClone").src = post.image || "default-image.jpg";
    clone.querySelector("#pipID").textContent = post.idpips;
    container.appendChild(clone);
  });
}

document.querySelector("#message").addEventListener("click", modal);
document.querySelector("#username").addEventListener("click", modal);
document.querySelector(".modal").addEventListener("click", modalOff);

//modal function
function modal() {
  document.querySelector(".modal").style.visibility = "visible";
}

function modalOff() {
  document.querySelector(".modal").style.visibility = "hidden";
}
