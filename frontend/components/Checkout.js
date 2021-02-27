import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import SickButton from "./styles/SickButton";
import { useState } from "react";

import nProgress from "nprogress";
import { useCart } from "../context/cart";

const CheckoutError = styled.p`
  font-size: 12px;
  color: var(--red);
`;

const CheckoutStyles = styled.form`
  border-radius: 5px;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: grid;
  grid-gap: 1rem;
  padding: 1rem;
`;

export const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT($token: String!) {
    checkout(token: $token) {
      id
    }
  }
`;

// @ts-ignore
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const { setCartOpen } = useCart();

  const [checkout, { error: graphqlError }] = useMutation(CHECKOUT_MUTATION);

  /**
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    nProgress.start();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error);
      nProgress.done();
      setLoading(false);
      return;
    }

    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    }).catch(() => {
      nProgress.done();
      setLoading(false);
    });
    console.log(order);

    setCartOpen(false);
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutStyles onSubmit={handleSubmit}>
      {error ? <CheckoutError>{error.message}</CheckoutError> : null}
      {graphqlError ? (
        <CheckoutError>{graphqlError.message}</CheckoutError>
      ) : null}
      <CardElement />
      <SickButton disabled={loading}>Check out now!</SickButton>
    </CheckoutStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
