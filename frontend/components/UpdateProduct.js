import { gql, useMutation, useQuery } from "@apollo/client";
import Router from "next/router";
import useForm from "../lib/useForm";
import { PRODUCT_QUERY } from "./SingleProduct";
import DisplayError from "./styles/ErrorMessage";
import Form from "./styles/Form";

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $name: String!
    $price: Int!
    $description: String # $image: Upload
  ) {
    product: updateProduct(
      id: $id
      data: {
        name: $name
        price: $price
        description: $description
        # image: $image
      }
    ) {
      id
      name
      description
      price
    }
  }
`;

function UpdateProduct({ id }) {
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { id },
  });

  const { inputs, handleInputChange } = useForm(data?.product);

  const [
    updateProduct,
    { data: updateData, updateLoading, updateError },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  async function updateForm(event) {
    event.preventDefault();
    const {
      data: { product },
    } = await updateProduct({
      variables: {
        id,
        name: inputs.name,
        price: inputs.price,
        description: inputs.description,
      },
      refetchQueries: [{ query: PRODUCT_QUERY, variables: { id } }],
    });
    if (product.id) {
      Router.push(`/product/${product.id}`);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <DisplayError error={error} />;

  return (
    <div>
      <Form onSubmit={updateForm}>
        <DisplayError error={error || updateError} />
        <fieldset
          disabled={updateLoading || loading}
          aria-busy={updateLoading || loading}
        >
          <label htmlFor='name'>
            Name
            <input
              type='text'
              name='name'
              id='name'
              required
              value={inputs.name || ""}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='price'>
            Price
            <input
              type='number'
              name='price'
              id='price'
              required
              min={0}
              value={inputs.price || 0}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='description'>
            Description
            <textarea
              name='description'
              id='description'
              value={inputs.description || ""}
              onChange={handleInputChange}
            />
          </label>
        </fieldset>
        <button type='submit'>✏️ Edit Product</button>
      </Form>
    </div>
  );
}

export default UpdateProduct;
