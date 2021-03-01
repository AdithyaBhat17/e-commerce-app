/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissions } from '../access';
import { permissionFields } from './fields';

export const Role = list({
  access: {
    create: permissions.canManageProducts,
    read: permissions.canManageProducts,
    update: permissions.canManageProducts,
    delete: permissions.canManageProducts,
  },
  ui: {
    isHidden: (args) => !permissions.canManageProducts(args),
    hideCreate: (args) => !permissions.canManageProducts(args),
    hideDelete: (args) => !permissions.canManageProducts(args),
  },
  fields: {
    name: text({
      isRequired: true,
    }),
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
    ...permissionFields,
  },
});
