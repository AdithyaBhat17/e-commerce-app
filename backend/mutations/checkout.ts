/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { KeystoneContext } from '@keystone-next/types';
import { CartCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

export async function checkout(
  _root: unknown,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const { itemId: userId } = context.session;

  if (!userId) throw new Error('Sign in to create an order.');

  const user = await context.lists.User.findOne({
    where: {
      id: userId,
    },
    resolveFields: graphql`
        id
        name
        email
        cart {
          id
          quantity
          product {
            id
            name
            price
            description
            photo {
              id
              image {
                id
                publicUrlTransformed
              }
            }
          }
        }
      `,
  });

  const cartItems = user?.cart?.filter((cartItem) => cartItem.product);

  const amount = cartItems.reduce(
    (tally: number, cartItem: CartCreateInput) =>
      tally + cartItem.quantity * cartItem.product.price,
    0
  );

  const charge = await stripeConfig.paymentIntents
    .create({
      amount: amount * 100,
      payment_method: token,
      currency: 'INR',
      confirm: true,
    })
    .catch((error) => {
      throw new Error(error);
    });

  const orderItems = cartItems.map((cartItem) => ({
    name: cartItem.product.name,
    description: cartItem.product.description,
    price: cartItem.product.price,
    quantity: cartItem.quantity,
    photo: { connect: { id: cartItem.product.photo.id } },
  }));

  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount / 100,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });

  const cartItemIds = cartItems.map((cartItem) => cartItem.id);

  await context.lists.Cart.deleteMany({
    ids: cartItemIds,
  });

  return order;
}
