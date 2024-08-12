import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import logo from "/images/logo.png";
import searchImg from "/images/search.png";
import cartImgDesktop from "/images/cart.png";
import memberIcon from "/images/member.png";

const Header = () => {
  const [isSearchBarMobileDisplayed, setIsSearchBarMobileDisplayed] =
    useState(false);
  const [isUserComposing, setIsUserComposing] = useState(false);
  const [totalQtyForEveryItem, setTotalQtyOfEveryItem] = useState(0);
  const searchBarMobileRef = useRef();

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

  function displaySearchBarMobile() {
    setIsSearchBarMobileDisplayed(true);
  }

  function hideSearchBarMobile() {
    setIsSearchBarMobileDisplayed(false);
  }

  useEffect(() => {
    if (isSearchBarMobileDisplayed && searchBarMobileRef.current) {
      searchBarMobileRef.current.focus();
    }
  }, [isSearchBarMobileDisplayed]);

  function handleCompositionStart() {
    setIsUserComposing(true);
  }

  function handleCompositionEnd() {
    setIsUserComposing(false);
  }

  function handleSearch(event) {
    if (!isUserComposing && event.key === "Enter") {
      window.location.href = `/homepage?q=${event.target.value}`;
    }
  }

  return (
    <HeaderStyle>
      <LogoContainer>
        <a href="/homepage">
          <Logo src={logo} />
        </a>
      </LogoContainer>
      <Categories>
        <StyleChoice>
          <CategoryLink href="/homepage?category=women">女裝</CategoryLink>
        </StyleChoice>
        <StyleSplit></StyleSplit>
        <StyleChoice>
          <CategoryLink href="/homepage?category=men">男裝</CategoryLink>
        </StyleChoice>
        <StyleSplit></StyleSplit>
        <StyleChoice>
          <CategoryLink href="/homepage?category=accessories">
            配件
          </CategoryLink>
        </StyleChoice>
      </Categories>
      <SearchMobileTrigger onClick={displaySearchBarMobile}>
        <SearchImg src={searchImg} />
      </SearchMobileTrigger>
      <SearchBarMobile
        ref={searchBarMobileRef}
        $show={isSearchBarMobileDisplayed}
        onBlur={hideSearchBarMobile}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleSearch}
      />
      <FunctionContainer>
        <SearchBar>
          <SearchInput
            placeholder="西裝"
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleSearch}
          />
          <SearchImg src={searchImg} />
        </SearchBar>
        <CartContainerDesktop>
          <Link to="/checkout">
            <CartImgDesktop src={cartImgDesktop} />
            <CartBadge $cartHasItems={totalQtyForEveryItem > 0}>
              {totalQtyForEveryItem}
            </CartBadge>
          </Link>
        </CartContainerDesktop>
        <MemberLink href="#">
          <MemberIcon src={memberIcon} />
        </MemberLink>
      </FunctionContainer>
    </HeaderStyle>
  );
};

export default Header;

/* HEADER STYLE */
const HeaderStyle = styled.header`
  z-index: 4;
  position: fixed;
  top: 0;
  width: 100vw;
  background-color: #ffffff;
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0px;
    width: 100vw;
    height: 140px;
    border: 0px 0px 40px 0px;
    border-bottom: 40px solid #313538;
  }
`;

/* LOGO STYLE */
const LogoContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 52px;
  background-color: #ffffff;
  @media screen and (min-width: 1280px) {
    justify-content: flex-start;
    margin-right: 57px;
    margin-left: 60px;
    width: 318px;
  }
`;

const Logo = styled.img`
  height: 24px;
  @media screen and (min-width: 1280px) {
    width: 258px;
    height: 48px;
  }
`;

/* NAV CATEGORIES STYLE */
const Categories = styled.nav`
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #313538;
  @media screen and (min-width: 1280px) {
    position: absolute;
    top: 45px;
    order: 1;
    margin-left: 375px;
    width: 451px;
    height: 28px;
    background-color: transparent;
  }
`;

const StyleChoice = styled.div`
  display: block;
  flex-grow: 1;
  flex-basis: 33%;
  height: 16px;
  text-decoration: none;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  @media screen and (min-width: 1280px) {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    width: 150px;
    height: 28px;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 30px;
    line-height: 28px;
    text-indent: 30px;
  }
`;
const CategoryLink = styled.a`
  color: #828282;
  text-decoration: none;

  &:hover {
    //pseudo-element 偽元素
    color: #ffffff;
    cursor: pointer;
  }

  @media screen and (min-width: 1280px) {
    color: #3f3a3a;

    &:hover {
      color: #8b572a;
    }
  }
`;

const StyleSplit = styled.div`
  border-left: 1px solid #808080;
  height: 20px;
  @media screen and (min-width: 1280px) {
    border-left: 1px solid #808080;
    height: 20px;
  }
`;
/* SEARCHBAR MOBILE */
const SearchBarMobile = styled.input`
  display: ${(props) => (props.$show ? "block" : "none")};
  position: fixed;
  top: 4px;
  padding: 6px 45px 6px 20px;
  margin-left: 10px;
  margin-right: 10px;
  width: calc(100vw - 20px);
  height: 44px;
  border-radius: 20px;
  border: 1px solid #979797;
  color: #8b572a;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  outline: none;
  @media screen and (min-width: 1280px) {
    display: none;
  }
`;

const SearchMobileTrigger = styled.button`
  position: absolute;
  top: 6px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  background-color: transparent;
  z-index: 3;
  @media screen and (min-width: 1280px) {
    display: none;
  }
`;
const SearchImg = styled.img`
  width: 40px;
  height: 40px;
  @media screen and (min-width: 1280px) {
    width: 44px;
    height: 44px;
    margin-right: 10px;
  }
`;

/* DESKTOP FUNCTION CONTAINER STYLE*/

const FunctionContainer = styled.div`
  display: none;
  position: relative;
  @media screen and (min-width: 1280px) {
    display: flex;
    order: 2;
    flex-direction: row;
    margin-right: 54px;
  }
`;
const SearchBar = styled.div`
  display: none;
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 214px;
    height: 44px;
    border-radius: 20px;
    border: 1px solid #979797;
  }
`;

const SearchInput = styled.input`
  @media screen and (min-width: 1280px) {
    border: none;
    padding: 15px 0px 10px 20px;
    width: 160px;
    background-color: transparent;
    color: #8b572a;
    font-size: 20px;
    font-weight: 400;
    line-height: 29px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #8b572a;
    }
  }
`;
const CartContainerDesktop = styled.div`
  display: none;
  @media screen and (min-width: 1280px) {
    /* align-self: center; */
    position: relative;
    display: inline-block;
    margin-right: 42px;
    margin-left: 42px;
  }
`;

const CartImgDesktop = styled.img``;
// 沒有特別的style要設定

const CartBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: ${(props) => (props.$cartHasItems ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px 10px;
  width: 24px;
  height: 24px;
  background-color: #8b572a;
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

const MemberLink = styled.a`
  display: block;
  height: 44px;
  width: 44px;
  order: 4;
  align-self: center;
`;

const MemberIcon = styled.img`
  display: none;
  @media screen and (min-width: 1280px) {
    display: block;
    align-self: center;
    height: 44px;
    width: 44px;
  }
`;
