const OMDB_KEY = "b782a99b";

// LOGIN
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  try {
    const res = await fetch("users.json");
    const users = await res.json();

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() &&
           u.password === password
    );

    if (user) {
      errorMsg.textContent = "";
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("moviePage").style.display = "block";
    } else {
      errorMsg.textContent = "Invalid email or password";
    }

  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Error loading users";
  }
}

// SEARCH MOVIES
async function searchMovies() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  const movieList = document.getElementById("movieList");

  if (!searchTerm) return;

  movieList.innerHTML = "Loading...";

  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(searchTerm)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      movieList.innerHTML = `<li>${data.Error}</li>`;
      return;
    }

    movieList.innerHTML = "";

    data.Search.forEach(movie => {
      const li = document.createElement("li");
      li.classList.add("movie-card");

      li.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200'}"
             onerror="this.src='https://via.placeholder.com/200'">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " trailer")}"
           target="_blank">
           ▶ Watch Trailer
        </a>
      `;

      movieList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    movieList.innerHTML = "<li>Network error</li>";
  }
}

// ENTER KEY SUPPORT
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput")
    .addEventListener("keypress", e => {
      if (e.key === "Enter") searchMovies();
    });
});