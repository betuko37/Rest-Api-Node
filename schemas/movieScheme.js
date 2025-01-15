const z = require ('zod')


const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must a String',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0),
    poster: z.string().url({
        message: 'poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Movie genre is requerid.',
            invalid_type_error: 'Movie genre must be an array'
        }
    )
})


function validarMovie (object){
    return movieSchema.safeParse(object)
}


function validarMoviePartial (object){
    return movieSchema.partial().safeParse(object)
}


module.exports={
    validarMovie,
    validarMoviePartial
}
