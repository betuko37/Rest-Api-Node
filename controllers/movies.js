import { validarMovie, validarMoviePartial } from "../schemas/movieScheme.js";
import { MovieModel } from "../models/movie.js";

export class MovieController{

    static async getAll(req, res){
        const {genre} = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }

    static async getById (req, res){
        const {id} = req.params
        const movie = await MovieModel.getById({id})
        if(movie) return res.json(movie)
    
        res.status(404).json({message: "Pelicula no Encontrada.."})
    }

    static async create (req, res) {
        
        const result = validarMovie(req.body)
    
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
    
       const newMovie = await MovieModel.create({input: result.data})
    
        res.status(201).json(newMovie)
    }

    static async delete (req, res) {
        const { id } = req.params
      
        const result = await MovieModel.delete({id})
      
        if(result === false){
            return res.status(404).json({message: 'Pelicula no Encontrada..'})
        }
    
        return res.json({ message: 'Pelicula Eliminada' })
    }

    static async update (req, res) {
        const result = validarMoviePartial(req.body)
    
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
       
        const {id} = req.params
        
        const updateMovie = await MovieModel.update({id, input: result.data})
    
        return res.json(updateMovie)
    }


}