import styled from "styled-components";
import { useEffect } from "react";
import PropTypes from "prop-types";

import trashcan from "/images/cart-remove.png";
import trashcanHover from "/images/cart-remove-hover.png";

const Cart = ({ setSubtotal, cartItems, setCartItems }) => {
  useEffect(() => {
    getCartItems();
    window.addEventListener("cartUpdate", getCartItems);
    return () => {
      window.removeEventListener("cartUpdate", getCartItems);
    };
  }, []);

  useEffect(() => {
    calculateSubtotal();
  }, [cartItems]);

  function getCartItems() {
    const stringCartItems = localStorage.getItem("itemsAddedToCart");
    if (stringCartItems !== null) {
      const arrCartItems = JSON.parse(stringCartItems);
      // an array of objects
      const mergedCartItems = arrCartItems.reduce((acc, item) => {
        const existingItem = acc.find(
          (accumulatedItem) =>
            accumulatedItem.id === item.id &&
            accumulatedItem.color.name === item.color.name &&
            accumulatedItem.size === item.size
        );
        if (existingItem) {
          existingItem.qty += item.qty;
        } else {
          acc.push({
            id: item.id,
            name: item.name,
            price: item.price,
            color: item.color,
            size: item.size,
            qty: item.qty,
            main_image: item.main_image,
            stock: item.stock,
          });
        }

        return acc;
      }, []); //reduce要有初始值
      console.log("Merged cart items:", mergedCartItems);
      setCartItems(mergedCartItems);
    } else {
      console.log("No items in cart.");
    }
  }

  function calculateSubtotal() {
    if (cartItems !== null) {
      const subtotal = cartItems.reduce(
        (acc, cartItem) => acc + cartItem.price * cartItem.qty,
        0
      );
      setSubtotal(subtotal);
      console.log("The subtotal is", subtotal);
    } else {
      setSubtotal(0);
    }
  }

  function changeQty(index, e) {
    const newQty = parseInt(e.target.value, 10);
    const newCartItems = [...cartItems];
    newCartItems[index].qty = newQty;

    localStorage.setItem("itemsAddedToCart", JSON.stringify(newCartItems));
    const event = new Event("cartUpdate");
    window.dispatchEvent(event);
  }

  function deleteCartItem(index) {
    const currentCartItems = [...cartItems];
    currentCartItems.splice(index, 1);
    localStorage.setItem("itemsAddedToCart", JSON.stringify(currentCartItems));
    const event = new Event("cartUpdate");
    window.dispatchEvent(event);
  }

  return (
    <CartContainer>
      <TitleBar>
        <CartTitle>購物車</CartTitle>
        <Title>數量</Title>
        <Title>單價</Title>
        <Title>小計</Title>
      </TitleBar>
      <CartItemContainer>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((cartItem, index) => (
            <CartItem key={index}>
              <ProductImg src={cartItem.main_image}></ProductImg>
              <ProductInfo>
                <ProductTitle>{cartItem.name}</ProductTitle>
                <ProductID>{cartItem.id}</ProductID>
                <ProductColor>顏色｜{cartItem.color.name}</ProductColor>
                <ProductSize>尺寸｜{cartItem.size}</ProductSize>
              </ProductInfo>
              <ProductQtySelectWrapper>
                <ProductQtySelect
                  value={cartItem.qty}
                  onChange={(e) => {
                    changeQty(index, e);
                  }}
                >
                  {Array.from({ length: cartItem.stock }, (_, i) => (
                    <QtyOption key={i + 1} value={i + 1}>
                      {i + 1}
                    </QtyOption>
                  ))}
                </ProductQtySelect>
              </ProductQtySelectWrapper>
              <ProductPrice>TWD.{cartItem.price}</ProductPrice>
              <ProductTotalPrice>
                TWD.{cartItem.price * cartItem.qty}
              </ProductTotalPrice>
              <RemoveItemBtn onClick={() => deleteCartItem(index)} />
            </CartItem>
          ))
        ) : (
          <NoCartItemAlert>購物車內無商品資料</NoCartItemAlert>
        )}
      </CartItemContainer>
    </CartContainer>
  );
};

Cart.propTypes = {
  setSubtotal: PropTypes.func,
  cartItems: PropTypes.array,
  setCartItems: PropTypes.func,
};

export default Cart;

const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1160px;
  margin: 191px auto 49px auto;
`;

const TitleBar = styled.div`
  display: flex;
  flex: row;
  width: 1160px;
  height: 35px;
`;

const CartTitle = styled.p`
  margin-right: auto;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
`;

const Title = styled.p`
  flex-basis: 192px;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: center;

  &:last-child {
    margin-right: 126px;
  }
`;

const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 1160px;
  border: 1px solid #979797;
  padding: 39px 30px 39px 29px;
`;

const NoCartItemAlert = styled.div`
  margin-top: 100px;
  margin-bottom: 100px;
  color: #3f3a3a;
  font-size: 30px;
  text-align: center;
`;

const CartItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 152px;
  width: 1100px;
`;

const ProductImg = styled.img`
  height: 152px;
`;

const ProductInfo = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  height: 152px;
`;

const ProductTitle = styled.p`
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  color: #3f3a3a;
`;

const ProductID = styled.p`
  margin-bottom: 22px;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  color: #000000;
`;

const ProductColor = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  color: #000000;
`;

const ProductSize = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  color: #000000;
`;

const ProductQtySelectWrapper = styled.div`
  position: relative;
  display: block;
  width: 80px;
  height: 32px;
  margin: 60px 56px 60px 56px;
  &:after {
    content: "ˇ";
    position: absolute;
    right: 8px;
    top: 20px;
    transform: translateY(-50%);
    pointer-events: none;
    color: #3f3a3a;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
  }
`;

const ProductQtySelect = styled.select`
  font-size: 14px;
  padding: 0px 0px 0px 15px;
  width: 80px;
  height: 32px;
  border: 1px solid #979797;
  border-radius: 8px;
  background-color: #f3f3f3;

  /* 新增 */
  appearance: none;
`;

const QtyOption = styled.option`
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
`;

const ProductPrice = styled.p`
  flex-basis: 192px;
  height: 16px;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: center;
`;

const ProductTotalPrice = styled.p`
  flex-basis: 192px;
  height: 16px;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: center;
`;

const RemoveItemBtn = styled.button`
  width: 44px;
  height: 44px;
  padding: 0px;
  margin-left: 52px;
  background-color: transparent;
  border: none;
  background-image: url(${trashcan});

  &:hover {
    background-image: url(${trashcanHover});
  }

  &:hover {
    cursor: pointer;
  }
`;
