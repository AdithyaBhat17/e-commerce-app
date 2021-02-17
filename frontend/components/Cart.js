import { useUser } from "./User";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import CartItem from "./CartItem";
import { formatMoney } from "../lib/formatMoney";
import { calculateTotalPrice } from "../lib/calculateTotalPrice";
import { useCart } from "../context/cart";

function Cart() {
  const me = useUser();
  const { isCartOpen, setCartOpen } = useCart();
  if (!me) return null;
  return (
    <div>
      <CartStyles open={isCartOpen}>
        <header>
          <Supreme>{me.name}'s Cart</Supreme>
          <CloseButton onClick={() => setCartOpen(false)}>&times;</CloseButton>
        </header>
        <ul>
          {me.cart.map((cartItem) => (
            <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </ul>
        <footer>
          <p>{formatMoney(calculateTotalPrice(me.cart))}</p>
        </footer>
      </CartStyles>
    </div>
  );
}

export default Cart;
