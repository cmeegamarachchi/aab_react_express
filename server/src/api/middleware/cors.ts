import cors from "cors";

interface CorsOptions {
  origin: string;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default cors(corsOptions);
