import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import cartIcon from "/images/cart-mobile.png";
import memberMobileIcon from "/images/member-mobile.png";

const MobileTab = () => {
  const [totalQtyForEveryItem, setTotalQtyOfEveryItem] = useState(0);

  useEffect(() => {
    const updateCartQuantity = () => {
      const itemsAddedToCart = localStorage.getItem("itemsAddedToCart");
      const itemsAddedToCartObject = itemsAddedToCart
        ? JSON.parse(itemsAddedToCart)
        : [];
      // console.log(`Items in Cart: ${itemsAddedToCart}`);
      setTotalQtyOfEveryItem(
        itemsAddedToCartObject.reduce((acc, item) => acc + item.qty, 0)
      );
      // console.log(
      //   `Total Quantity: ${itemsAddedToCartObject.reduce(
      //     (acc, item) => acc + item.qty,
      //     0
      //   )}`
      // );
    };

    updateCartQuantity();

    window.addEventListener("cartUpdate", updateCartQuantity);

    return () => {
      window.removeEventListener("cartUpdate", updateCartQuantity);
    };
  }, []);

  return (
    <Tab>
      <ShoppingCart>
        <Link to="/checkout">
          <ShoppingCartMobileLink>
            <CartContainerMobile>
              <CartIcon src={cartIcon} />
              <CartBadgeMobile $cartHasItems={totalQtyForEveryItem > 0}>
                {totalQtyForEveryItem}
              </CartBadgeMobile>
            </CartContainerMobile>
            <TabTextMobile>購物車</TabTextMobile>
          </ShoppingCartMobileLink>
        </Link>
      </ShoppingCart>
      <TabSplit />
      <MemberMobile>
        <Link>
          <MemMobileLink>
            <MemberIcon src={memberMobileIcon} />
            <TabTextMobile>會員</TabTextMobile>
          </MemMobileLink>
        </Link>
      </MemberMobile>
    </Tab>
  );
};

export default MobileTab;

/* MOBILE FUNCTION TAB */

const Tab = styled.div`
  width: 100vw;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0px 8px 0px;
  background-color: #313538;
  @media screen and (min-width: 1280px) {
    display: none;
  }
`;
const ShoppingCart = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  flex-basis: 50%;
`;
const ShoppingCartMobileLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;
const CartContainerMobile = styled.div`
  position: relative;
  display: inline-block;
  height: 44px;
  width: 44px;
`;
const CartIcon = styled.img`
  height: 44px;
  width: 44px;
`;

const CartBadgeMobile = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: ${(props) => (props.$cartHasItems ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 5px 10px;
  background-color: #8b572a;
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

const TabTextMobile = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
`;

const TabSplit = styled.div`
  height: 24px;
  border-left: solid #828282 1px;
`;
const MemberMobile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  flex-basis: 50%;
`;

const MemMobileLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
`;

const MemberIcon = styled.img`
  width: 44px;
  height: 44px;
`;
