import cors from 'cors';

const ACCEPTED_ORIGINS = [           
  'https://rest-api-node-4ufv.onrender.com' 
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => 
  cors({
    origin: (origin, callback) => {
      // Permitir si el origen está en la lista aceptada
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Permitir solicitudes sin origen (Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Bloquear cualquier otro origen no permitido
      return callback(new Error('Not allowed by CORS'));
    },
  });
