import { list } from '@keystone-next/keystone/schema';
import { password, relationship, text } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    delete: permissions.canManageUsers,
  },
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
    role: relationship({
      ref: 'Role.assignedTo',
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
    }),
  },
});
