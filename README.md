<h1 align="center">Watchlistr</h1>

![Watchlistr Login Page](/React/src/styles/Screenshots/Screenshots/LoginPage.png)
![Watchlistr Popular Movies](/React/src/styles/Screenshots/Screenshots/PopularMovies.png)
![Watchlistr Top Rated TV Shows](/React/src/styles/Screenshots/Screenshots/TopRatedTVShows.png)

Watchlistr is a web application that allows users to search for and discover popular and top-rated movies and TV shows, as well as TV shows airing today (updates periodically). Users can also save movies and TV shows to their own watchlist!

### Built With
* ReactJS
* Node.js
* Express.js
* Axios
* The Movie Database (TMDB) API

### Getting Started

To get started with the app, follow these steps:

1. Clone the repo to your local machine using ```git clone https://github.com/devzano/watchlistr-app.git```
2. Install dependencies using ```npm install```
3. Make sure to have PostgreSQL installed, you can download at https://www.postgresql.org/download/
4. Obtain an API key from TMDB by signing up for an account at https://www.themoviedb.org/account/signup
5. In the root directory create a file called ***.env*** add the line below & your TMDB API key: ```REACT_APP_TMDB_API_KEY=YOUR-API-KEY```
6. To run the app, server & the database use ```npm run dev```


### Features

* __Popular Movies and TV Shows__ - displays a list of popular movies and TV shows, which users can click on to view more details.
* __Top-Rated Movies and TV Shows__ - displays a list of top-rated movies and TV shows, which users can click on to view more details.
* __TV Shows Airing Today__ - displays a list of TV shows airing today in the US, which users can click on to view more details.
* __Search__ - allows users to search for specific movies and TV shows by entering keywords into the search bar.
* __Watchlist__ - allows users to save the movie or TV show to a watchlist.

### Contributions

Contributions to the app are welcome! If you would like to contribute, please fork the repo and submit a pull request.

#### License

Copyright © 2023 devzano. All rights reserved.

##### Credits

* The TMDB API for providing movies and tv shows data.
* Running ```create-react-app``` for the initial app setup.