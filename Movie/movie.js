document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "d1d69919";
    const movieWrapper = document.getElementById("movie-wrapper");
    const SeitenButtons = document.querySelectorAll(".Knopf");
    const searchInput = document.getElementById("searchInput");
    const modal = document.getElementById("movieModal");
    const modalDetails = document.getElementById("modal-details");
    let currentPage = 1;
    const moviesPerPage = 26;
    let allMovies = [];

    const randomTitles = [
        "Joker", "Batman", "Inception", "Avengers", "Spiderman",
        "Titanic", "Matrix", "Gladiator", "Toy Story", "Interstellar",
        "Lion King", "Frozen", "The Godfather", "Lord of the Rings", "Harry Potter",
        "Terminator", "Shrek", "Finding Nemo", "Iron Man", "Deadpool",
        "Black Panther", "Django", "Pulp Fiction", "Pirates of the Caribbean", "Thor",
        "Mad Max", "John Wick", "The Dark Knight", "Guardians of the Galaxy", "Star Wars",
        "Fast and Furious", "Back to the Future", "Wonder Woman", "The Hangover", "The Matrix Reloaded",
        "Avatar", "The Wolf of Wall Street", "Sherlock Holmes", "Aquaman", "Doctor Strange", "The Revenant", "The Martian"
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function fetchRandomMovies() {
        allMovies = [];
        const shuffledTitles = shuffleArray([...randomTitles]);

        shuffledTitles.forEach(title => {
            fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.Search) {
                        allMovies.push(...data.Search);
                        if (allMovies.length >= moviesPerPage) {
                            displayMovies(1);
                        }
                    }
                })
                .catch(error => console.log("Fehler beim Abrufen der Daten: ", error));
        });
    }

    function searchMovies() {
        const query = searchInput.value.trim();
        if (!query) return;
        allMovies = [];
        movieWrapper.innerHTML = "";

        fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    allMovies.push(...data.Search);
                    displayMovies(1);
                } else {
                    movieWrapper.innerHTML = "<p>Keine Ergebnisse gefunden</p>";
                }
            })
            .catch(error => console.log("Fehler beim Abrufen der Daten: ", error));
    }

    function resetToRandomMovies() {
        searchInput.value = "";
        currentPage = 1;
        fetchRandomMovies();
    }

    function displayMovies(page) {
        movieWrapper.innerHTML = "";
        const startIndex = (page - 1) * moviesPerPage;
        const endIndex = page * moviesPerPage;
        const moviesToShow = allMovies.slice(startIndex, endIndex);

        moviesToShow.forEach(movie => {
            if (movie.Poster !== "N/A") {
                createMovieElement(movie.Poster, movie.Title, movie.imdbID);
            }
        });
        highlightActiveButton(page);
    }

    function createMovieElement(posterUrl, title, imdbID) {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        const imgElement = document.createElement("img");
        imgElement.src = posterUrl;
        imgElement.alt = title;

        movieElement.appendChild(imgElement);
        movieWrapper.appendChild(movieElement);

        movieElement.addEventListener("click", function () {
            fetchMovieDetails(imdbID);
        });
    }

    function fetchMovieDetails(imdbID) {
        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    modalDetails.innerHTML = `
                        <h2>${data.Title}</h2>
                        <p><strong>Release Year:</strong> ${data.Year}</p>
                        <p><strong>Metacritic:</strong> ${data.Metascore ? data.Metascore + "/100" : "N/A"}</p>
                        <p><strong>Runtime:</strong> ${data.Runtime}</p>
                        <p><strong>Genres:</strong> ${data.Genre}</p>
                        <p><strong>Languages:</strong> ${data.Language}</p>
                        <p><strong>Country:</strong> ${data.Country}</p>
                        <p><strong>Awards:</strong> ${data.Awards}</p>
                        <p><strong>Plot:</strong> ${data.Plot}</p>
                        <img src="${data.Poster}" alt="${data.Title}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
                    `;
                    modal.style.display = "block";
                }
            })
            .catch(error => console.log("Fehler beim Abrufen der Filmdetails: ", error));
    }


    function closeModal() {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    function highlightActiveButton(page) {
        SeitenButtons.forEach(button => {
            button.classList.remove("active");
            if (parseInt(button.getAttribute("data-page")) === page) {
                button.classList.add("active");
            }
        });
    }

    SeitenButtons.forEach(button => {
        button.addEventListener("click", function () {
            currentPage = parseInt(this.getAttribute("data-page"));
            displayMovies(currentPage);
        });
    });


    document.getElementById("closeModalButton").addEventListener("click", closeModal);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchMovies();
        }
    });

    const logoImg = document.getElementById("logoImg");
    logoImg.addEventListener("click", resetToRandomMovies);

    fetchRandomMovies();
});