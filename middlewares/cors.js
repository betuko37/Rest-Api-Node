import cors from 'cors';

const ACCEPTED_ORIGINS = [           
  'https://rest-api-node-4ufv.onrender.com' 
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      // Si el origen está en la lista, o si no se incluye un origen (por ejemplo, herramientas como Postman)
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true); // Permite la solicitud
      }

      // Bloquear otros orígenes
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET'], // Solo permitir GET
  });
