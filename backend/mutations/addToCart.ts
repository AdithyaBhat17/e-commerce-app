/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { KeystoneContext } from '@keystone-next/types';
import { CartCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export async function addToCart(
  _root: unknown,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartCreateInput> {
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  const allCartItems = await context.lists.Cart.findMany({
    where: {
      user: { id: session.itemId },
      product: { id: productId },
    },
    resolveFields: 'id,quantity',
  });
  const [existingItem] = allCartItems;
  if (existingItem) {
    console.log(
      'Item is already in cart, incrementing by ',
      existingItem.quantity
    );
    return context.lists.Cart.updateOne({
      id: existingItem.id,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      data: { quantity: existingItem.quantity + 1 },
    });
  }

  console.log('Adding to cart...');
  return context.lists.Cart.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
}
