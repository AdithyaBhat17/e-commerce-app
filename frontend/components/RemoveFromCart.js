import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART($id: ID!) {
    deleteCart(id: $id) {
      id
      __typename
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCart));
}

function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: {
      id,
    },
    update,
  });
  return (
    <BigButton
      disabled={loading}
      type='button'
      title='remove item'
      onClick={removeFromCart}
    >
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
