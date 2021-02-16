import ForgotPassword from "../components/ForgotPassword";
import Head from "next/head";

function ForgotPasswordPage() {
  return (
    <div>
      <Head>
        <title>SickFits | Reset Password Link</title>
      </Head>
      <ForgotPassword />
    </div>
  );
}

export default ForgotPasswordPage;
