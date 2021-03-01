import CreateProduct from "../components/CreateProduct";
import SignIn from "../components/SignIn";
import { useUser } from "../components/User";

export default function SellPage() {
  const me = useUser();
  return <div>{me ? <CreateProduct /> : <SignIn />}</div>;
}
