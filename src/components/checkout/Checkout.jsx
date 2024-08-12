import { useState } from "react";

import Cart from "./Cart";
import CheckoutForm from "./CheckoutForm";

export default function Checkout() {
  const [subtotal, setSubtotal] = useState(0);
  const [cartItems, setCartItems] = useState(null);

  return (
    <>
      <Cart
        setSubtotal={setSubtotal}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      <CheckoutForm
        subtotal={subtotal}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </>
  );
}
