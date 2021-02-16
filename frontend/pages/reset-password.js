import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";

function ResetPasswordPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Oops! You forgot to supply a token to access this page.</p>
        <ForgotPassword />
      </div>
    );
  }
  return (
    <div>
      <ResetPassword token={query.token} />
    </div>
  );
}

export default ResetPasswordPage;
