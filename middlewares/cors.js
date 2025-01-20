import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://movies.com'
]


export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {
      
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  })