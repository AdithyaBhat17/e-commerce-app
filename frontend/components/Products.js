import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import Product from "./Product";

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export const ALL_PRODUCTS = gql`
  query ALL_PRODUCTS {
    allProducts {
      id
      name
      description
      price
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Products() {
  const { data, loading, error } = useQuery(ALL_PRODUCTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load products...</div>;

  return (
    <div>
      <ProductsListStyles>
        {data.allProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductsListStyles>
    </div>
  );
}
