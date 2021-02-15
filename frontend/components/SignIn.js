import Form from "./styles/Form";
import DisplayError from "./styles/ErrorMessage";
import useForm from "../lib/useForm";
import { gql, useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";

export const SIGNIN_MUTATION = gql`
  mutation SIGNIN($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
        code
      }
    }
  }
`;

function SignIn() {
  const { inputs, handleInputChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const [signIn, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: {
      ...inputs,
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const { email, password } = inputs;
    if (!email || !password) return;
    try {
      await signIn();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  const error =
    data?.authenticateUserWithPassword?.__typename ===
    "UserAuthenticationWithPasswordFailure"
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h2>Sign into your account</h2>
        {error ? <DisplayError error={error} /> : null}
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
        <button type='submit'>SIGN IN</button>
      </Form>
    </div>
  );
}

export default SignIn;
