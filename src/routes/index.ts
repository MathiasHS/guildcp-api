import authRoutes from './auth';
import userRoutes from './user';
import guildRoutes from './guild';

export default [...authRoutes, ...userRoutes, ...guildRoutes];