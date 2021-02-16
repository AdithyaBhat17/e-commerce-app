import Form from "./styles/Form";
import DisplayError from "./styles/ErrorMessage";
import useForm from "../lib/useForm";
import { gql, useMutation } from "@apollo/client";
import Link from "next/link";

export const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      message
      code
    }
  }
`;

function ForgotPassword() {
  const { inputs, handleInputChange, resetForm } = useForm({
    email: "",
  });

  const [resetPasswordLink, { data, loading, error }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      variables: {
        ...inputs,
      },
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const { email } = inputs;
    if (!email) return;
    try {
      await resetPasswordLink();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h2>Request a Reset Password Link</h2>
        {error || data?.sendUserPasswordResetLink ? (
          <DisplayError error={error || data?.sendUserPasswordResetLink} />
        ) : null}
        {data?.sendUserPasswordResetLink === null ? (
          <p>Success! Check your email for the password reset link</p>
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
        </fieldset>
        <button type='submit'>Request link</button> <br />
      </Form>
    </div>
  );
}

export default ForgotPassword;
