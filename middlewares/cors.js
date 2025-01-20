import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',               // Si estás desarrollando en localhost
  'https://tu-frontend.com',             // Tu dominio público del front-end
  'https://rest-api-node-4ufv.onrender.com' // Tu propio dominio
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      // Permitir si el origen está en la lista aceptada
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Bloquear orígenes no permitidos
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET'], // Solo permite GET en la configuración de CORS
  });
