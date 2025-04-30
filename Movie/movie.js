document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchButton").addEventListener("click", performSearch);
    document.getElementById("firstPage").addEventListener("click", firstPage);
    const apiKey = "d1d69919";
    const movieWrapper = document.getElementById("movie-wrapper");
    const SeitenButtons = document.querySelectorAll(".Knopf");
    const searchInput = document.getElementById("searchInput");
    const modal = document.getElementById("movieModal");
    let currentPage = 1;
    let currentQuery = "";
    const moviesPerPageRandom = 26;
    const moviesPerPageSearch = 10;
    let allMovies = [];
    createPageButtons(currentPage);

    const randomTitles = [
        "Joker", "Batman", "Inception", "Avengers", "Spiderman",
        "Titanic", "Matrix", "Gladiator", "Toy Story", "Interstellar",
        "Lion King", "Frozen", "The Godfather", "Lord of the Rings", "Harry Pötter",
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

    function saveSearchInput(query) {
        document.cookie = `Suche=${query};`;

        sessionStorage.setItem("Suche", query);

        localStorage.setItem("Suche", query);
    }

    function fetchRandomMovies() {
        allMovies = [];
        const shuffledTitles = shuffleArray([...randomTitles]);
        const promises = shuffledTitles.map(title =>
            fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.Search) {
                        allMovies.push(...data.Search);
                    }
                })
                .catch(error => console.error("Fehler beim Abrufen der Daten:", error))
        );

        Promise.all(promises).then(() => {
            displayMovies(1, moviesPerPageRandom);
        });
    }

    function searchMovies(query, page) {
        fetch(`http://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    allMovies = data.Search;
                    displayMovies(1, moviesPerPageSearch);
                    highlightActiveButton(page);
                } else {
                    movieWrapper.innerHTML = "<p>Keine Ergebnisse gefunden</p>";
                }
            })
            .catch(error => console.error("Fehler beim Abrufen der Daten:", error));
    }

    function displayMovies(page, moviesPerPage) {
        movieWrapper.innerHTML = "";
        const startIndex = (page - 1) * moviesPerPage;
        const endIndex = page * moviesPerPage;
        const moviesToShow = allMovies.slice(startIndex, endIndex);

        if (moviesToShow.length === 0) {
            movieWrapper.innerHTML = "<p>Keine Filme gefunden.</p>";
            return;
        }

        moviesToShow.forEach(movie => {
            if (movie.Poster !== "N/A") {
                createMovieElement(movie.Poster, movie.Title, movie.imdbID);
            }
        });

        highlightActiveButton(page);
    }

    function createPageButtons(currentPage) {
        const buttonContainer = document.getElementById("Seite");
        buttonContainer.innerHTML = "";

        const totalButtons = 6;

        const startPage = currentPage - Math.floor(totalButtons / 2);
        const endPage = currentPage + Math.floor(totalButtons / 2);

        for (let i = startPage; i <= endPage; i++) {
            if (i < 1) continue;

            const button = document.createElement("button");
            button.classList.add("Knopf");
            button.setAttribute("data-page", i);
            button.textContent = i;

            if (i === currentPage) {
                button.classList.add("active");
            }

            button.addEventListener("click", function () {
                currentPage = parseInt(this.getAttribute("data-page"));
                if (currentQuery) {
                    searchMovies(currentQuery, currentPage);
                } else {
                    displayMovies(currentPage, moviesPerPageRandom);
                }
                createPageButtons(currentPage);
            });

            buttonContainer.appendChild(button);
        }
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
                    document.getElementById('movieTitle').textContent = data.Title;
                    document.getElementById('releaseYear').textContent = data.Year;
                    document.getElementById('metacritic').textContent = data.Metascore ? `${data.Metascore}/100` : "N/A";
                    document.getElementById('runtime').textContent = data.Runtime;
                    document.getElementById('genres').textContent = data.Genre;
                    document.getElementById('languages').textContent = data.Language;
                    document.getElementById('country').textContent = data.Country;
                    document.getElementById('awards').textContent = data.Awards;
                    document.getElementById('plot').textContent = data.Plot;
                    document.getElementById('moviePoster').src = data.Poster;

                    modal.style.display = "block";
                }
            })
            .catch(error => console.error("Fehler beim Abrufen der Filmdetails:", error));
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

    document.getElementById("closeModalButton").addEventListener("click", closeModal);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            currentQuery = searchInput.value.trim();
            if (currentQuery) {
                currentPage = 1;
                searchMovies(currentQuery, currentPage);
                createPageButtons(currentPage);

                saveSearchInput(currentQuery);
            }
        }
    });

    document.getElementById("logoImg").addEventListener("click", function () {
        currentQuery = "";
        currentPage = 1;
        fetchRandomMovies();
        createPageButtons(currentPage);
    });

    function firstPage() {
        currentPage = 1;
        if (currentQuery) {
            searchMovies(currentQuery, currentPage);
        } else {
            displayMovies(currentPage, moviesPerPageRandom);
        }
        createPageButtons(currentPage);
    };



    function performSearch() {
        console.log("Suchbutton wurde geklickt!");
        currentQuery = document.getElementById("searchInput").value.trim();
        if (currentQuery) {
            currentPage = 1;
            searchMovies(currentQuery, currentPage);
            createPageButtons(currentPage);
        }
    }

    fetchRandomMovies();
});