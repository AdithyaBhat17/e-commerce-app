/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data?.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

export const rules = {
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageUsers({ session })) return true;

    return { id: session.itemId };
  },
  canManageProducts({
    session,
  }: ListAccessArgs): boolean | { user: { id: string } } {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true;

    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs): boolean | { user: { id: string } } {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;

    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;

    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs): boolean | { status: string } {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true;

    return { status: 'AVAILABLE' };
  },
};
