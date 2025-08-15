import cors from "cors";
import configManager from "../../config/config-manager";

interface CorsOptions {
  origin: string;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

const corsConfig = configManager.getCorsConfig();

const corsOptions: CorsOptions = {
  origin: corsConfig.origin,
  methods: corsConfig.methods,
  allowedHeaders: corsConfig.allowedHeaders,
  credentials: corsConfig.credentials,
};

export default cors(corsOptions);
