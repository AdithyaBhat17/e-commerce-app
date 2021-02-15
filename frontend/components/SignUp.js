import Form from "./styles/Form";
import DisplayError from "./styles/ErrorMessage";
import useForm from "../lib/useForm";
import { gql, useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./User";

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP($name: String!, $email: String!, $password: String!) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      email
      name
    }
  }
`;

function SignIn() {
  const { inputs, handleInputChange, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const [signUp, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      ...inputs,
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const { name, email, password } = inputs;
    if ((!name, !email || !password)) return;
    try {
      await signUp();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h2>Create a new account</h2>
        {data?.createUser ? (
          <p>Signed up with {data.createUser.email}. Go ahead and sign in</p>
        ) : null}
        {error ? <DisplayError error={error} /> : null}
        <fieldset
          disabled={loading || !!data?.createUser?.email}
          aria-busy={loading}
        >
          <label htmlFor='name'>
            Name
            <input
              type='text'
              name='name'
              id='name'
              required
              value={inputs.name}
              autoComplete='name'
              onChange={handleInputChange}
            />
          </label>
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
        <button type='submit'>SIGN UP</button>
      </Form>
    </div>
  );
}

export default SignIn;
