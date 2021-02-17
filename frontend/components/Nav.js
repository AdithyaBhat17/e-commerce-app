import Link from "next/link";
import { useCart } from "../context/cart";
import CartCount from "./CartCount";
import SignOut from "./SignOut";
import NavStyles from "./styles/NavStyles";
import { useUser } from "./User";

export default function Nav() {
  const user = useUser();

  const { setCartOpen } = useCart();
  return (
    <NavStyles>
      <Link href='/products'>Products</Link>
      {user ? (
        <>
          <Link href='/sell'>Sell</Link>
          <Link href='/orders'>Orders</Link>
          <Link href='/account'>Account</Link>
          <SignOut>Sign Out</SignOut>
          <button type='button' onClick={() => setCartOpen(true)}>
            My Cart{" "}
            <CartCount
              count={user.cart.reduce(
                (tally, cartItem) => tally + cartItem.quantity,
                0
              )}
            />
          </button>
        </>
      ) : (
        <>
          <Link href='/signin'>Sign In</Link>
        </>
      )}
    </NavStyles>
  );
}
