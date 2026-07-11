import { registerAs } from '@nestjs/config';

export default registerAs('tokens', () => ({
  user: {
    access: process.env.USER_ACCESS_SECRET,
    refresh: process.env.USER_REFRESH_SECRET,
  },
  company: {
    access: process.env.COMPANY_ACCESS_SECRET,
    refresh: process.env.COMPANY_REFRESH_SECRET,
  },
  admin: {
    access: process.env.ADMIN_ACCESS_SECRET,
    refresh: process.env.ADMIN_REFRESH_SECRET,
  },
}));
