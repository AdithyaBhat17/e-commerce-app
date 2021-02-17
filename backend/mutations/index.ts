import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import { KeystoneContext } from '@keystone-next/types';
import { addToCart } from './addToCart';

const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): Cart
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
    },
  },
});
