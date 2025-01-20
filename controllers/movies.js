import { validarMovie, validarMoviePartial } from "../schemas/movieScheme.js";

export class MovieController{

    constructor({movieModel}){
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
        const {genre} = req.query
        const movies = await this.movieModel.getAll({ genre })
        res.json(movies)
    }

    getById = async (req, res) => {
        const {id} = req.params
        const movie = await this.movieModel.getById({id})
        if(movie) return res.json(movie)
    
        res.status(404).json({message: "Pelicula no Encontrada.."})
    }

    create = async (req, res) => {
        
        const result = validarMovie(req.body)
    
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
    
       const newMovie = await this.movieModel.create({input: result.data})
    
        res.status(201).json(newMovie)
    }

    delete = async (req, res) => {
        const { id } = req.params
      
        const result = await this.movieModel.delete({id})
      
        if(result === false){
            return res.status(404).json({message: 'Pelicula no Encontrada..'})
        }
    
        return res.json({ message: 'Pelicula Eliminada' })
    }

    update = async (req, res) => {
        const result = validarMoviePartial(req.body)
    
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
       
        const {id} = req.params
        
        const updateMovie = await this.movieModel.update({id, input: result.data})
    
        return res.json(updateMovie)
    }


}


