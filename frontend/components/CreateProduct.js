import useForm from "../lib/useForm";
import Form from "../components/styles/Form";
import DisplayError from "../components/styles/ErrorMessage";
import { ALL_PRODUCTS } from "./Products";

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import Router from "next/router";

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

function CreateProduct() {
  const router = useRouter();

  const { inputs, handleInputChange } = useForm({
    name: "",
    price: 0,
    description: "",
    image: "",
  });

  const [createProduct, { loading, error }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS }],
    }
  );

  async function submitForm(event) {
    event.preventDefault();
    const {
      data: { createProduct: product },
    } = await createProduct();
    if (product)
      Router.push({
        pathname: `/product/${product.id}`,
      });
  }

  return (
    <div>
      <Form onSubmit={submitForm}>
        <DisplayError error={error} />
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor='image'>
            Image
            <input
              type='file'
              id='image'
              required
              name='image'
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='name'>
            Name
            <input
              type='text'
              id='name'
              required
              name='name'
              value={inputs.name}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='price'>
            Price
            <input
              type='number'
              id='price'
              min={0}
              required
              name='price'
              value={inputs.price}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='description'>
            Description
            <textarea
              id='description'
              name='description'
              value={inputs.description}
              onChange={handleInputChange}
            />
          </label>
        </fieldset>
        <button type='submit'>+ Add Product</button>
      </Form>
    </div>
  );
}

export default CreateProduct;
