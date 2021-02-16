import Form from "./styles/Form";
import DisplayError from "./styles/ErrorMessage";
import useForm from "../lib/useForm";
import { gql, useMutation } from "@apollo/client";
import Link from "next/link";

export const RESET_MUTATION = gql`
  mutation RESET($email: String!, $password: String!, $token: String!) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      message
      code
    }
  }
`;

function ResetPassword({ token }) {
  const { inputs, handleInputChange, resetForm } = useForm({
    email: "",
    password: "",
    token,
  });

  const [resetPassword, { data, loading, error }] = useMutation(
    RESET_MUTATION,
    {
      variables: {
        ...inputs,
      },
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = inputs;
    if (!email || !password) return;
    try {
      await resetPassword();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h2>Request a Reset Password Link</h2>
        {error || data?.redeemUserPasswordResetToken ? (
          <DisplayError error={error || data?.sendUserPasswordResetLink} />
        ) : null}
        {data?.redeemUserPasswordResetToken === null ? (
          <p>Success! Login to the app with your new password.</p>
        ) : null}
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor='email'>
            Email
            <input
              type='email'
              name='email'
              id='email'
              required
              autoComplete='email'
              value={inputs.email}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor='password'>
            Password
            <input
              type='password'
              name='password'
              id='password'
              required
              autoComplete='password'
              value={inputs.password}
              onChange={handleInputChange}
            />
          </label>
        </fieldset>
        <button type='submit'>Reset Password</button>
      </Form>
    </div>
  );
}

export default ResetPassword;
