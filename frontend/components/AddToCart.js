import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";
import { useCart } from "../context/cart";

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

function AddToCart({ id }) {
  const { setCartOpen } = useCart();
  const [addToCart, { loading, error }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button
      disabled={loading}
      onClick={async () => {
        await addToCart();
        setCartOpen(true);
      }}
    >
      Add{loading && "ing"} To Cart
    </button>
  );
}

export default AddToCart;
