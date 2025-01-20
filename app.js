import express, { json } from "express";
import { corsMiddleware, methodMiddleware } from "./middlewares/cors.js";
import { createMovieRouter } from "./routes/movies_routes.js";


export const createApp = ({movieModel})=>{

  const app = express();
  app.disable("x-powered-by"); //desabilita el logo como quien dice
  
  //middleware
  app.use(json())
  app.use(corsMiddleware()); // Aplica el CORS
  app.use(methodMiddleware); // Bloquea métodos no permitidos
  app.use('/movies', createMovieRouter({movieModel}))
  
  // Usa el puerto definido en el entorno, o 3000 por defecto
  const PORT = process.env.PORT ?? 3000;
  
  //Mandar a llamar el servidor
  app.listen(PORT, () =>
    console.log(`Example app listening on port http://localhost:${PORT}!`)
  );
}



