const express = require("express");
const crypto = require ('node:crypto')
const cors = require('cors')
const movies = require('./movies.json');
const { validarMovie, validarMoviePartial } = require("./schemas/movieScheme");
const app = express();

app.disable("x-powered-by"); //desabilita el logo como quien dice

// Usa el puerto definido en el entorno, o 3000 por defecto
const PORT = process.env.PORT ?? 3000;

//middleware
app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'https://movies.com'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))




//todos los recursos de las movies
app.get("/movies", (req,res)=>{

    const {genre} = req.query
    if(genre){
        const filtradoMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
        )
        return res.json(filtradoMovies)
    }
    res.json(movies)
})



//recuperar solo por id
app.get('/movies/:id', (req, res) =>{
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)

    res.status(404).json({message: "Movie not Found"})
})



//mandar un recurso validado
app.post('/movies', (req, res) => {
    
    const result = validarMovie(req.body)

    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    //En base de datos
    const newMovie = {
        id: crypto.randomUUID(), //id random
        ... result.data
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})



//borrar un recurso por id
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })


  //actualizar un recurso parcial osea uno solo o varios del mismo id
app.patch('/movies/:id', (req, res) => {

    const result = validarMoviePartial(req.body)

    if(!result.success){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
   
    const {id} = req.params
    const movieIndex = movies.findIndex(movie =>movie.id === id)

    if(movieIndex === -1){
        return res.status(404).json({message: 'Movie no encontrada'})
    } 

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
   

})




//Mandar a llamar el servidor
app.listen(PORT, () =>
  console.log(`Example app listening on port http://localhost:${PORT}!`)
);
