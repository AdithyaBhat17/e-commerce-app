import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';

import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import { Cart } from './schemas/Cart';
import { Session } from './types';
import { insertSeedData } from './seed-data';
import { sendResetPasswordLink } from './mail';
import { extendGraphqlSchema } from './mutations';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/sickfits';

const sessionConfig = {
  maxAge: 60 * 60 * 24, // stay signed in for a day,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  // allow creating a new user for the first time.
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
  passwordResetLink: {
    async sendToken({ token, identity }) {
      await sendResetPasswordLink(token, identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data'))
          await insertSeedData(keystone);
      },
    },
    lists: createSchema({
      User,
      Product,
      ProductImage,
      Cart,
      Order,
      OrderItem,
    }),
    extendGraphqlSchema,
    ui: {
      // show keystone to users who pass the test.
      isAccessAllowed: ({ session }) => !!(session as Session)?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
  })
);
