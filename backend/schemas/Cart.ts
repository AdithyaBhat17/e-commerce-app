import { integer, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Cart = list({
  ui: {
    listView: { initialColumns: ['product', 'quantity', 'user'] },
  },
  fields: {
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({
      ref: 'Product',
    }),
    user: relationship({
      ref: 'User.cart',
    }),
  },
});