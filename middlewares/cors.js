import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'https://rest-api-node-4ufv.onrender.com', // Tu dominio
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes GET desde cualquier origen
      if (origin && (acceptedOrigins.includes(origin) || !origin)) {
        return callback(null, true); // Permitir cualquier origen para GET
      }

      // Bloquear cualquier otro origen para otros métodos
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET'], // Permitir solo el método GET
  });

// Middleware para bloquear POST, PUT, DELETE, y otros métodos
export const blockWriteMethods = (req, res, next) => {
  const blockedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  // Si el método es uno de los bloqueados, respondemos con error
  if (blockedMethods.includes(req.method)) {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  next();
};
