import { useEffect, useState } from "react";

import styled from "styled-components";

const Product = () => {
  const [productData, setProductData] = useState();
  const [colorIndexSelected, setColorIndexSelected] = useState(null);
  const [sizeIndexSelected, setSizeIndexSelected] = useState(null);
  const [btnText, setBtnText] = useState("請選擇顏色");
  const [quantitySelected, setQuantitySelected] = useState(0);
  const [availableItems, setAvailableItems] = useState([]);
  const [quantityAvailable, setQuantityAvailable] = useState(null);
  const [stockQty, setStockQty] = useState(0);

  //一開始拿資料
  useEffect(() => {
    getProductData().then((data) => {
      setProductData(data);
      setAvailableItems(data.variants);
      console.log(data);
      console.log(data.variants);
    });
  }, []);

  //如果顏色重選，已選尺寸、數量都歸0；紀錄variants中有庫存的選項
  useEffect(() => {
    setSizeIndexSelected(null);
    setQuantitySelected(0);
    if (productData && colorIndexSelected !== null) {
      const colorFilteredItems = productData.variants.filter(
        (availableItem) => {
          return (
            availableItem.color_code ==
            productData.colors[colorIndexSelected].code
          );
        }
      );
      const stockFilteredItems = colorFilteredItems.filter((filteredItem) => {
        return filteredItem.stock > 0;
      });
      setAvailableItems(stockFilteredItems);
      console.log(stockFilteredItems);
    }
  }, [productData, colorIndexSelected]);

  //如果尺寸重選，重設數量
  useEffect(() => {
    setQuantitySelected(0);
    if (availableItems.length > 0 && sizeIndexSelected !== null) {
      console.log(`The index of size selected is ${sizeIndexSelected}`);
      const sizeFilteredItem = availableItems.filter(
        (item) => item.size === productData.sizes[sizeIndexSelected]
      );
      console.log(sizeFilteredItem);
      console.log(`The stock quantity is ${sizeFilteredItem[0].stock}`);
      setStockQty(sizeFilteredItem[0].stock);
      if (sizeFilteredItem.length > 0) {
        const storedItems = localStorage.getItem("itemsAddedToCart");
        const storedItemsObject = storedItems ? JSON.parse(storedItems) : [];
        const matchingCartItems = storedItemsObject.filter((storedItem) => {
          return (
            storedItem.id === productID &&
            storedItem.color.code ===
              productData.colors[colorIndexSelected].code &&
            storedItem.size === productData.sizes[sizeIndexSelected]
          );
        });

        let availableQuantity = sizeFilteredItem[0].stock;
        if (matchingCartItems.length > 0) {
          const totalQty = matchingCartItems.reduce(
            (acc, item) => acc + item.qty,
            0
          );
          availableQuantity -= totalQty;
        }
        setQuantityAvailable(availableQuantity);
        console.log(`The available quantity is ${availableQuantity}`);
      }
    }
  }, [sizeIndexSelected, availableItems]);

  useEffect(() => {
    if (colorIndexSelected == null) {
      setBtnText("請選擇顏色");
    } else if (colorIndexSelected !== null && sizeIndexSelected == null) {
      setBtnText("請選擇尺寸");
    } else if (
      colorIndexSelected !== null &&
      sizeIndexSelected !== null &&
      quantitySelected == 0
    ) {
      setBtnText("請選擇數量");
    } else if (
      colorIndexSelected !== null &&
      sizeIndexSelected !== null &&
      quantitySelected > 0
    ) {
      setBtnText("加入購物車");
    }
  }, [colorIndexSelected, sizeIndexSelected, quantitySelected]);

  const urlParameter = new URLSearchParams(window.location.search);
  const productID = urlParameter.get("id");
  function getProductData() {
    const apiURL = `https://api.appworks-school.tw/api/1.0/products/details?id=${productID}`;
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    console.log(productID);
    console.log(apiURL);

    return fetch(apiURL, { signal })
      .then((response) => response.json())
      .then((result) => {
        clearTimeout(timeoutId);
        return result.data || [];
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          console.error(
            "Timeout: It took more than 3 seconds to load the product data."
          );
          alert("網路連線逾時，請重試！");
        } else {
          console.error("Network connection error.");
          alert("網路連線錯誤，請重新檢查網路連線！");
        }
        return [];
      });
  }

  function handleChooseColor(index) {
    if (colorIndexSelected === index) {
      setColorIndexSelected(null); //再次點擊取消選擇
    } else {
      setColorIndexSelected(index);
    }
  }

  function isSizeAvailable(size) {
    if (!productData || colorIndexSelected === null) {
      return false;
    }

    const storedItems = localStorage.getItem("itemsAddedToCart");
    const storedItemsObject = storedItems ? JSON.parse(storedItems) : [];

    const selectedColor = productData.colors[colorIndexSelected];
    if (!selectedColor) {
      return false;
    }

    const matchingCartItems = storedItemsObject.filter((storedItem) => {
      return (
        storedItem.id === productID &&
        storedItem.color.code === selectedColor.code &&
        storedItem.size === size
      );
    });

    const matchingAvailableItems = availableItems.filter(
      (item) => item.size === size
    );

    if (matchingCartItems.length > 0 && matchingAvailableItems.length > 0) {
      const matchingCartItemsTotalQty = matchingCartItems.reduce(
        (acc, item) => acc + item.qty,
        0
      );
      return matchingAvailableItems[0].stock > matchingCartItemsTotalQty;
    }
    return availableItems.some((item) => item.size === size);
  }

  function handleChooseSize(index) {
    if (sizeIndexSelected === index) {
      setSizeIndexSelected(null);
    } else {
      setSizeIndexSelected(index);
    }
  }

  function handleSizeClick(index, size) {
    if (colorIndexSelected !== null) {
      if (isSizeAvailable(size)) {
        handleChooseSize(index);
      }
    }
  }

  function handleQuantityIncrement() {
    if (colorIndexSelected !== null && sizeIndexSelected !== null) {
      if (quantitySelected < quantityAvailable)
        setQuantitySelected((prevQuantity) => prevQuantity + 1);
    }
  }

  function handleQuantityDecrement() {
    setQuantitySelected((prevQuantity) => {
      if (prevQuantity >= 1) {
        return prevQuantity - 1;
      }
    });
  }

  function handleAddToCart() {
    if (
      colorIndexSelected !== null &&
      sizeIndexSelected !== null &&
      quantitySelected > 0
    ) {
      setColorIndexSelected(null);
      const newItem = {
        id: productID,
        name: productData.title,
        price: productData.price,
        color: {
          code: productData.colors[colorIndexSelected].code,
          name: productData.colors[colorIndexSelected].name,
        },
        size: productData.sizes[sizeIndexSelected],
        qty: quantitySelected,
        main_image: productData.main_image,
        stock: stockQty,
      };

      const storedItems = localStorage.getItem("itemsAddedToCart");
      const storedItemsObject = storedItems ? JSON.parse(storedItems) : [];

      storedItemsObject.push(newItem);

      localStorage.setItem(
        "itemsAddedToCart",
        JSON.stringify(storedItemsObject)
      );

      //觸發自定義cartUpdate事件
      const event = new Event("cartUpdate");
      window.dispatchEvent(event);
    }
  }

  if (!productData) {
    return null;
  }
  return (
    <ProductContainer>
      <ProductBasicInfoContainer>
        <ProductImg src={productData.main_image} />
        <ProductName>{productData.title}</ProductName>
        <ProductSerialNumber>{productData.id}</ProductSerialNumber>
        <ProductPrice>TWD.{productData.price}</ProductPrice>
        <ProductInfoSplit />
        <ProductVariantContainer>
          <ColorSelection>
            <ColorHeadline>顏色｜</ColorHeadline>
            {productData.colors.map((color, index) => (
              <ColorOption
                key={index}
                $colorCode={`#${color.code}`}
                title={color.name}
                onClick={() => handleChooseColor(index)}
                $isSelected={colorIndexSelected === index}
              />
            ))}
          </ColorSelection>
          <SizeSelection>
            <SizeHeadline>尺寸｜</SizeHeadline>
            {productData.sizes.map((size, index) => (
              <SizeOption
                key={index}
                onClick={() => handleSizeClick(index, size)}
                $isSelected={sizeIndexSelected === index}
                $colorSelected={colorIndexSelected !== null}
                $isAvailable={isSizeAvailable(size)}
              >
                {size}
              </SizeOption>
            ))}
          </SizeSelection>
          <QuantitySelection>
            <QuantityHeadline>數量｜</QuantityHeadline>
            <QuantitySelectBar>
              <QuantityDecreaseBtn
                onClick={handleQuantityDecrement}
                $sizeSelected={sizeIndexSelected !== null}
              >
                -
              </QuantityDecreaseBtn>
              <Quantity>{quantitySelected || 0}</Quantity>
              {/* 0被視作falsy */}
              <QuantityIncreaseBtn
                onClick={handleQuantityIncrement}
                $sizeSelected={sizeIndexSelected !== null}
              >
                +
              </QuantityIncreaseBtn>
            </QuantitySelectBar>
          </QuantitySelection>
          <AddToCartBtn
            $quantitySelected={quantitySelected > 0}
            onClick={handleAddToCart}
          >
            {btnText}
          </AddToCartBtn>
        </ProductVariantContainer>
        <ProductDetails>
          <ProductNote>{productData.note}</ProductNote>
          <ProductTexture>{productData.texture}</ProductTexture>
          <ProductDescription>{productData.description}</ProductDescription>
          <ProductWash>清洗：{productData.wash}</ProductWash>
          <ProductPlace>產地：{productData.place}</ProductPlace>
        </ProductDetails>
      </ProductBasicInfoContainer>
      <MoreInfoSectionTitle>
        <MoreInfoSectionTitleText>更多產品資訊</MoreInfoSectionTitleText>
        <MoreInfoSectionTitleSplit />
      </MoreInfoSectionTitle>
      <ProductStory>{productData.story}</ProductStory>
      <ProductMoreImg src={productData.images[0]} />
      <ProductMoreImg src={productData.images[1]} />
    </ProductContainer>
  );
};

export default Product;

// PRODUCT CONTAINER //
const ProductContainer = styled.div`
  width: 100vw;
  margin-top: 102px;
  margin-bottom: 32px;
  @media screen and (min-width: 1280px) {
    margin: 205px auto 49px auto;
    width: 960px;
  }
`;

const ProductBasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media screen and (min-width: 1280px) {
    flex-wrap: wrap;
    column-gap: 40px;
    height: 750px;
  }
`;

const ProductImg = styled.img`
  width: 100%;
  @media screen and (min-width: 1280px) {
    width: 560px;
  }
`;

const ProductName = styled.div`
  margin-left: 24px;
  margin-top: 17px;
  color: #3f3a3a;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 4px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin-left: 0px;
    margin-top: 0px;
    font-size: 32px;
    font-weight: 400;
    line-height: 38px;
    letter-spacing: 6.4x;
  }
`;

const ProductSerialNumber = styled.p`
  margin-left: 24px;
  margin-top: 10px;
  color: #bababa;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: 3.2px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin-left: 0px;
    margin-top: 16px;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 4px;
  }
`;

const ProductPrice = styled.p`
  margin-left: 24px;
  margin-top: 20px;
  color: #3f3a3a;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin-left: 0px;
    margin-top: 40px;
    font-size: 30px;
    line-height: 36px;
  }
`;

const ProductInfoSplit = styled.div`
  width: calc(100vw - 48px);
  margin: 10px auto 0px auto;
  border-top: 1px #3f3a3a solid;
  @media screen and (min-width: 1280px) {
    width: 360px;
  }
`;

const ProductVariantContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 24px 28px 24px;
  @media screen and (min-width: 1280px) {
    margin: 30px 0px 40px 0px;
  }
`;

const ColorSelection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  height: 36px;
`;

const ColorHeadline = styled.h3`
  margin: 0px;
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 2.8px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 4px;
  }
`;

const ColorOption = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 15px;
  border: 6px solid #ffffff;
  background-color: ${(props) => props.$colorCode};
  box-shadow: inset 0px 0px 0 1px #d3d3d3;
  outline: ${(props) => props.$isSelected && "1px solid #979797"};

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
  }
`;

const SizeSelection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 28px;
  height: 36px;
  @media screen and (min-width: 1280px) {
    margin-top: 30px;
  }
`;

const SizeHeadline = styled.h3`
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 2.8px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 4px;
  }
`;

const SizeOption = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 15px;
  font-size: 20px;
  font-weight: 400;
  line-height: 36px;
  text-align: center;
  opacity: ${(props) => {
    if (props.$colorSelected) {
      return props.$isAvailable ? "100%" : "25%";
    } else {
      return "25%";
    }
  }};

  background-color: ${(props) => (props.$isSelected ? "#000000" : "#ececec;")};
  color: ${(props) => (props.$isSelected ? "#FFFFFF" : "#3f3a3a;")};

  &:hover {
    cursor: ${(props) =>
      props.$colorSelected
        ? props.$isAvailable
          ? "pointer"
          : "not-allowed"
        : "not-allowed"};
  }

  &:last-child {
    margin-right: 0;
  }
`;

const QuantitySelection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 44px;
  margin-top: 30px;
  @media screen and (min-width: 1280px) {
    margin-top: 22px;
  }
`;

const QuantityHeadline = styled.h3`
  display: none;
  @media screen and (min-width: 1280px) {
    display: inline;
    color: #3f3a3a;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 4px;
    text-align: left;
  }
`;

const QuantitySelectBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  border: 1px #979797 solid;
  padding: 11px 0px 11px 0px;
  @media screen and (min-width: 1280px) {
    width: 160px;
    height: 44px;
    padding: 6px 0px 6px 0px;
  }
`;

const QuantityDecreaseBtn = styled.div`
  padding-right: 35px;
  padding-left: 35px;
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    cursor: ${(props) => (props.$sizeSelected ? "pointer" : "not-allowed")};
  }

  @media screen and (min-width: 1280px) {
    padding-right: 15px;
    padding-left: 15px;
  }
`;

const QuantityIncreaseBtn = styled.div`
  padding-right: 35px;
  padding-left: 35px;
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;

  &:hover {
    cursor: ${(props) => (props.$sizeSelected ? "pointer" : "not-allowed")};
  }

  @media screen and (min-width: 1280px) {
    padding-right: 15px;
    padding-left: 15px;
  }
`;

const Quantity = styled.div`
  color: #8b572a;
  font-size: 20px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`;

const AddToCartBtn = styled.div`
  width: 100%;
  height: 44px;
  margin-top: 10px;
  padding-top: 7px;
  padding-bottom: 7px;
  color: #ffffff;
  background-color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 3.2px;
  text-align: center;
  @media screen and (min-width: 1280px) {
    margin-top: 26px;
    width: 360px;
    height: 64px;
    padding-top: 17px;
    padding-bottom: 17px;
    font-size: 20px;
    letter-spacing: 4px;
  }

  &:hover {
    cursor: ${(props) => (props.$quantitySelected ? "pointer" : "not-allowed")};
  }
`;

const ProductDetails = styled.div`
  width: 140px;
  margin-left: 24px;
  @media screen and (min-width: 1280px) {
    width: 200px;
    margin-left: 0px;
  }
`;

const ProductNote = styled.p`
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

const ProductTexture = styled.p`
  margin-top: 24px;
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin-top: 35px;
    font-size: 20px;
    line-height: 30px;
  }
`;

const ProductDescription = styled.p`
  white-space: pre-line;
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

const ProductWash = styled.p`
  margin-top: 24px;
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin-top: 35px;
    font-size: 20px;
    line-height: 30px;
  }
`;

const ProductPlace = styled.p`
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

const MoreInfoSectionTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 28px 24px 12px 24px;
  @media screen and (min-width: 1280px) {
    margin: 50px 0 28px 0;
  }
`;

const MoreInfoSectionTitleText = styled.div`
  height: 30px;
  color: #8b572a;
  letter-spacing: 3.2px;
  font-size: 16px;
  font-weight: 400;
  line-height: 30px;
  @media screen and (min-width: 1280px) {
    font-size: 20px;
    letter-spacing: 3px;
  }
`;

const MoreInfoSectionTitleSplit = styled.div`
  width: calc(100% - 112px - 35px);
  border-top: 1px solid #3f3a3a;
  @media screen and (min-width: 1280px) {
    width: 761px;
  }
`;

const ProductStory = styled.p`
  margin: 0 24px 0 24px;
  color: #3f3a3a;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  text-align: left;
  @media screen and (min-width: 1280px) {
    margin: 0;
    font-size: 20px;
    line-height: 30px;
  }
`;

const ProductMoreImg = styled.img`
  width: calc(100vw - 48px);
  margin: 20px 24px 0px 24px;
  @media screen and (min-width: 1280px) {
    margin: 30px 0 0 0;
    width: 100%;
  }
`;
