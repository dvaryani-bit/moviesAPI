const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

app.get("/", (req, res) => {
  message = `

    Welcome to movies app:
    <br>
    1) Shows list of APIs:
    <br>  
        GET         http://localhost:${port}/         
    <br>
    <br>
    2) Return the full list of the movies (no sorting specified)
    GET        http://localhost:${port}/api/movies
    <br>
    this API can accept sorting queryStrings 
    <br>
    GET     Example:     http://localhost:${port}/api/movies?sort=title&order=asc
    <br>
    sort=title|year|rating
    <br>
    order=asc|desc 
    <br>
    <br>
    3) Search for movies matches or partially matches the title
    <br>
    GET        http://localhost:${port}/api/movies/search?q=(insert_movie_title_here)
    <br>
    <br>
    4) Returns a movie by id
    <br>
    GET        http://localhost:${port}/api/movies/:id
    <br>
    <br>
    5) Insert a new movie submitted in the request body
    POST       http://localhost:${port}/api/movies
    <br>
    <br>
    6) Update an existing movie id with the submitted data in the request body
    <br>
    PUT:    http://localhost:${port}/api/movies/:id
    <br>
    <br>
    7)deletes the movie by id
    <br>
    DELETE:    http://localhost:${port}/api/movies/:id


    
    `;
  res.send(message);
});

app.get("/api/movies", (req, res) => {
  const data = require("./MOCK_DATA.json");
  //console.log(data)

  const sort = req.query.sort;
  const order = req.query.order;
  console.log(sort);
  console.log(order);
  //res.send([sort,order])

  if (sort) {
    if (order) {
      if (order === "asc") {
        data.sort((a, b) => a[sort] - b[sort]);
      } else {
        data.sort((a, b) => b[sort] - a[sort]);
      }
    } else {
      data.sort((a, b) => a[sort] - b[sort]);
    }
  }
  res.send(data);
});

app.get("/api/movies/search", (req, res) => {
  const search = req.query.q.toLowerCase();
  const data = require("./MOCK_DATA.json");
  if (search) {
    const results = data.filter((x) => x.title.toLowerCase().includes(search));
    res.send(results);
  } else {
    res.send("No search term included");
  }
});

app.get("/api/movies/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id = parseInt(req.params.id);
  const result = data.find((x) => x.id === id);
  if (result) {
    res.send([result]);
  } else {
    res.status(404).send("Movie ID not in data");
  }
});

app.post("/api/movies", (req, res) => {
  if (!req.body.title) {
    res.status(400).send("No movie title entered");
  }

  const data = require("./MOCK_DATA.json");
  const movie = {
    id: data.length + 1,
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
    genres: req.body.genres,
  };
  data.push(movie);
  res.send(movie);
});

app.put("/api/movies/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id = parseInt(req.params.id);
  const movie = data.find((x) => x.id === id);
  if (!movie) {
    res.status(404).send("Movie ID not in data");
  }
  if (!req.body.title) {
    res.status(400).send("No movie title entered");
  }
  movie.title = req.body.title;
  res.send(movie);
  // add the other records too
  // use uuid
});

app.delete("/api/movies/:id", (req, res) => {
  const data = require("./MOCK_DATA.json");
  const id = parseInt(req.params.id);
  const movie = data.find((x) => x.id === id);
  if (!movie) {
    res.status(404).send("Movie ID not in data");
  }
  const index = data.indexOf(movie);
  data.splice(index, 1);
  res.send(movie);
});
