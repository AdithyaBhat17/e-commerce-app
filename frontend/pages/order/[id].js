import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import OrderStyles from "../../components/styles/OrderStyles";
import ErrorMessage from "../../components/styles/ErrorMessage";

import Head from "next/head";
import { formatMoney } from "../../lib/formatMoney";

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        quantity
        price
        description
        name
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

function SingleOrderPage({ query }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: query.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { order } = data;

  return (
    <OrderStyles>
      <Head>
        <title>SickFits - {query.id}</title>
      </Head>
      <p>
        <span>Order ID:</span>
        <span>{order?.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order?.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order?.total / 100)}</span>
      </p>
      <p>
        <span>Item count:</span>
        <span>{order?.items?.length}</span>
      </p>
      <div className='items'>
        {order?.items?.map((item) => (
          <div className='order-item' key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.name} />
            <div className='order-details'>
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.quantity * item.price)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

export default SingleOrderPage;
