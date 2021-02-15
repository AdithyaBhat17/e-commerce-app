import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Head from "next/head";
import styled from "styled-components";

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

function SignInPage() {
  return (
    <GridStyles>
      <Head>
        <title>SickFits | Sign In</title>
      </Head>
      <SignIn />
      <SignUp />
    </GridStyles>
  );
}

export default SignInPage;
