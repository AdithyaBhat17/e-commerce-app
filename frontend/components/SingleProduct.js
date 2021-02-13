import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import DisplayError from "./styles/ErrorMessage";
import Head from "next/head";
import styled from "styled-components";

export const PRODUCT_QUERY = gql`
  query PRODUCT_QUERY($id: ID!) {
    product: Product(where: { id: $id }) {
      name
      price
      description
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <DisplayError error={error} />;

  const { product } = data;

  return (
    <ProductStyles>
      <Head>
        <title>Sick Fits | {product.name}</title>
      </Head>
      <img
        src={product.photo.image.publicUrlTransformed}
        alt={product.photo.altText}
      />
      <div className='details'>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
      </div>
    </ProductStyles>
  );
}

export default SingleProduct;

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  justify-content: center;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;
