import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

export const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT {
    endSession
  }
`;

function SignOut({ children }) {
  const [signOut] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button onClick={signOut} type='button'>
      {children}
    </button>
  );
}

export default SignOut;
