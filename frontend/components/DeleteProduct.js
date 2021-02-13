import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

function DeleteProduct({ children, id }) {
  const [deleteProduct, { loading, error }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    {
      variables: { id },
      update,
    }
  );

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteProduct().catch((error) => alert(error));
    }
  }

  return (
    <button disabled={loading} onClick={handleDelete} type='button'>
      {children}
    </button>
  );
}

export default DeleteProduct;
