import { list } from '@keystone-next/keystone/schema';
import { password, relationship, text } from '@keystone-next/fields';

export const User = list({
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'Cart.user',
      many: true,
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'edit',
        },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
    }),
  },
});
