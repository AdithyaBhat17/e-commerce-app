import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import ErrorMessage from "../components/styles/ErrorMessage";
import OrderItemStyles from "../components/styles/OrderItemStyles";

import Link from "next/link";
import { formatMoney } from "../lib/formatMoney";
import styled from "styled-components";
import Head from "next/head";

const OrderUl = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 20px;
`;

export const USER_ORDERS = gql`
  query USER_ORDERS {
    allOrders {
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

function countItemsInAnOrder(order, type) {
  let count = order.items.reduce((tally, item) => tally + item.quantity, 0);
  count += ` ${type}`;
  return count === 1 ? count : `${count}s`;
}

function OrdersPage() {
  const { data, loading, error } = useQuery(USER_ORDERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Your orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders?.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className='order-meta'>
                  <p>{countItemsInAnOrder(order, "item")}</p>
                  <p>{order.items.length} products</p>
                  <p>{formatMoney(order.total / 100)}</p>
                </div>
                <div className='images'>
                  {order.items?.map((item) => (
                    <img
                      key={`image-${item.id}`}
                      src={item.photo?.image?.publicUrlTransformed}
                      alt={item?.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}

export default OrdersPage;
