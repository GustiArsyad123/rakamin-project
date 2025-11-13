import { config } from './config';
import app from './app';
import './queue';
import { logger } from './utils/logger';


app.listen(config.port, () => logger.info(`API on :${config.port}`));