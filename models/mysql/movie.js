import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'bjqz85uqlbi0atapak3j-mysql.services.clever-cloud.com',
  user: 'u7twlmxuudqdoilk',
  port: 3306,
  password: 'YUgJZkBRTHZp8BNd2INx',
  database: 'bjqz85uqlbi0atapak3j'
};


const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  
  static async getAll ({ genre }) {
    console.log('getAll')

    if (genre) {

      const lowerCaseGenre = genre.toLowerCase()

        //obtener id y nombre del genero en minusculas
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // si no encuentra el genero devolver array vacio
      if (genres.length === 0) return []

      // obtener el id del primer resultado de genero 
      const [{ id }] = genres

      // get all movies ids from database table
      // la query a movie_genres
      // join
      // y devolver resultados..
      return []
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async delete({ id }) {
    // La consulta DELETE correcta para borrar por ID
    const [result] = await connection.query(
      `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
    );
  
    if (result.affectedRows === 0) {
      throw new Error('Movie not found');
    }
  
    return { message: 'Movie deleted successfully' };
  }
  

  static async update({ id, input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input;
  
    // Actualizar la película por ID
    const [result] = await connection.query(
      `UPDATE movie
      SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
      WHERE id = UUID_TO_BIN(?);`,
      [title, year, director, duration, poster, rate, id]
    );
  
    if (result.affectedRows === 0) {
      throw new Error('Movie not found');
    }
  
    return { message: 'Movie updated successfully' };
  }
  
}