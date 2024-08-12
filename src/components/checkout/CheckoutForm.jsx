import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CheckoutForm = ({ subtotal, cartItems, setCartItems }) => {
  const shippingFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + shippingFee;
  const [customerInput, setCustomerInput] = useState({
    recipientName: "",
    recipientCellphoneNum: "",
    recipientAddress: "",
    recipientEmail: "",
    recipientDeliveryTime: "not-specified",
    payerCardNum: "",
    payerCardExpirationDate: "",
    payerCardCVC: "",
  });

  const [notFilledInput, setNotFilledInput] = useState([]);

  useEffect(() => {
    if (!cartItems || cartItems.length <= 0) {
      setNotFilledInput([]);
    }
  }, [cartItems]);

  function handleSubmit() {
    if (!cartItems || cartItems.length <= 0) {
      alert("購物車內無商品資料！");
      setCustomerInput({
        recipientName: "",
        recipientCellphoneNum: "",
        recipientAddress: "",
        recipientEmail: "",
        recipientDeliveryTime: "not-specified",
        payerCardNum: "",
        payerCardExpirationDate: "",
        payerCardCVC: "",
      });
      return;
    }

    // 收集所有未填寫的輸入框
    const newNotFilledInput = [];

    if (customerInput.recipientName === "")
      newNotFilledInput.push("recipientName");
    if (customerInput.recipientCellphoneNum === "")
      newNotFilledInput.push("recipientCellphoneNum");
    if (customerInput.recipientAddress === "")
      newNotFilledInput.push("recipientAddress");
    if (customerInput.recipientEmail === "")
      newNotFilledInput.push("recipientEmail");
    if (customerInput.recipientDeliveryTime === "")
      newNotFilledInput.push("recipientDeliveryTime");
    if (customerInput.payerCardNum === "")
      newNotFilledInput.push("payerCardNum");
    if (customerInput.payerCardExpirationDate === "")
      newNotFilledInput.push("payerCardExpirationDate");
    if (customerInput.payerCardCVC === "")
      newNotFilledInput.push("payerCardCVC");

    setNotFilledInput(newNotFilledInput);

    // 如果有未填寫的輸入框，則停止執行
    if (newNotFilledInput.length > 0) {
      return;
    }

    // submit邏輯
    setCartItems(null);
    localStorage.removeItem("itemsAddedToCart");
    const event = new Event("cartUpdate");
    window.dispatchEvent(event);

    setCustomerInput({
      recipientName: "",
      recipientCellphoneNum: "",
      recipientAddress: "",
      recipientEmail: "",
      recipientDeliveryTime: "not-specified",
      payerCardNum: "",
      payerCardExpirationDate: "",
      payerCardCVC: "",
    });
    return;
  }

  return (
    <CheckoutFormContainer onSubmit={(e) => e.preventDefault()}>
      <BuyerInfoForm>
        <InfoFormTitle>訂購資料</InfoFormTitle>
        <FormSplit />
        <FormQuestionContainer>
          <FormLabel for="name">收件人姓名</FormLabel>
          <FormInput
            type="text"
            id="name"
            name="recipientName"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.recipientName}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientName: e.target.value,
              });
            }}
          />
          <FormInstruction>
            務必填寫完整收件人姓名，避免包裹無法順利簽收
          </FormInstruction>
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="cellphoneNum">手機</FormLabel>
          <FormInput
            type="tel"
            id="cellphoneNum"
            name="recipientCellphoneNum"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.recipientCellphoneNum}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientCellphoneNum: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="address">地址</FormLabel>
          <FormInput
            type="text"
            id="address"
            name="recipientAddress"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.recipientAddress}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientAddress: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="email">Email</FormLabel>
          <FormInput
            type="email"
            id="email"
            name="recipientEmail"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.recipientEmail}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientEmail: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="time">配送時間</FormLabel>
          <FormDeliveryTimeInput
            type="radio"
            id="morning"
            name="time"
            value="morning"
            checked={customerInput.recipientDeliveryTime === "morning"}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientDeliveryTime: e.target.value,
              });
            }}
          />
          <FormDeliveryTimeLabel for="morning">
            08:00-12:00
          </FormDeliveryTimeLabel>
          <FormDeliveryTimeInput
            type="radio"
            id="afternoon"
            name="time"
            value="afternoon"
            checked={customerInput.recipientDeliveryTime === "afternoon"}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientDeliveryTime: e.target.value,
              });
            }}
          />
          <FormDeliveryTimeLabel for="afternoon">
            14:00-18:00
          </FormDeliveryTimeLabel>
          <FormDeliveryTimeInput
            type="radio"
            id="not-specified"
            name="time"
            value="not-specified"
            checked={customerInput.recipientDeliveryTime === "not-specified"}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                recipientDeliveryTime: e.target.value,
              });
            }}
          />
          <FormDeliveryTimeLabel for="not-specified">
            不指定
          </FormDeliveryTimeLabel>
        </FormQuestionContainer>
      </BuyerInfoForm>
      <PaymentInfoForm>
        <InfoFormTitle>付款資料</InfoFormTitle>
        <FormSplit />
        <FormQuestionContainer>
          <FormLabel for="creditCardNum">信用卡號碼</FormLabel>
          <FormInput
            type="text"
            id="creditCardNum"
            name="payerCardNum"
            placeholder="**** **** **** ****"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.payerCardNum}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                payerCardNum: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="expirationDate">有效期限</FormLabel>
          <FormInput
            type="text"
            id="expirationDate"
            name="payerCardExpirationDate"
            placeholder="MM / YY"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.payerCardExpirationDate}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                payerCardExpirationDate: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
        <FormQuestionContainer>
          <FormLabel for="cardCVC">安全碼</FormLabel>
          <FormInput
            type="text"
            id="cardCVC"
            name="payerCardCVC"
            maxlength="3"
            placeholder="後三碼"
            required
            $isNotFilled={notFilledInput}
            value={customerInput.payerCardCVC}
            onChange={(e) => {
              setCustomerInput({
                ...customerInput,
                payerCardCVC: e.target.value,
              });
            }}
          />
        </FormQuestionContainer>
      </PaymentInfoForm>
      <OrderSummary>
        <TotalItem>
          <TotalTitle>總金額</TotalTitle>
          <CurrencyUnit>NT.</CurrencyUnit>
          <Subtotal>{subtotal}</Subtotal>
        </TotalItem>
        <TotalItem>
          <TotalTitle>運費</TotalTitle>
          <CurrencyUnit>NT.</CurrencyUnit>
          <ShippingFee>{shippingFee}</ShippingFee>
        </TotalItem>
        <OrderSummarySplit />
        <TotalItem>
          <TotalTitle>應付金額</TotalTitle>
          <CurrencyUnit>NT.</CurrencyUnit>
          <Total>{total}</Total>
        </TotalItem>
        <ConfirmCheckoutBtn value="確認付款" onClick={handleSubmit}>
          確認付款
        </ConfirmCheckoutBtn>
      </OrderSummary>
    </CheckoutFormContainer>
  );
};

CheckoutForm.propTypes = {
  subtotal: PropTypes.number,
  cartItems: PropTypes.array,
  setCartItems: PropTypes.func,
};

export default CheckoutForm;

const CheckoutFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 1160px;
  height: 951px;
  margin: 0px auto 148px auto;
`;

const BuyerInfoForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 1160px;
  height: 363px;
  margin-bottom: 50px;
`;

const InfoFormTitle = styled.p`
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  margin-top: 1px;
`;

const FormSplit = styled.div`
  width: 1160px;
  border-top: solid 1px #3f3a3a;
  margin-top: 15px;
  margin-bottom: 25px;
`;

const FormQuestionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 1160px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

const FormLabel = styled.label`
  width: 120px;
  height: 19px;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: left;
`;

const FormInput = styled.input`
  padding: 0 8px;
  width: 576px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #979797;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #979797;
  }

  border: ${(props) =>
    props.$isNotFilled && props.$isNotFilled.includes(props.name)
      ? "1px solid #ff1111"
      : "1px solid #979797;"};
`;

const FormInstruction = styled.div`
  width: 696px;
  margin-top: 10px;
  color: #8b572a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  text-align: right;
`;

const FormDeliveryTimeInput = styled.input`
  width: 16px;
  height: 16px;
  border: 1px solid #979797;
  border-radius: 25%;
  margin-right: 8px;
`;

const FormDeliveryTimeLabel = styled.label`
  margin-right: 32px;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
`;
// Payment Info

const PaymentInfoForm = styled.form`
  width: 1160px;
  height: 216px;
  margin-bottom: 41px;
`;

// Order Total

const OrderSummary = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 282px;
`;

const TotalItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  width: 240px;
  height: 36px;
`;

const TotalTitle = styled.p`
  margin-top: 1px;
  margin-right: auto;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
`;

const CurrencyUnit = styled.p`
  margin-right: 8px;
  color: #3f3a3a;
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
`;

const Subtotal = styled.p`
  padding-right: 5px;
  color: #3f3a3a;
  font-size: 30px;
  font-weight: 400;
  line-height: 36px;
`;

const ShippingFee = styled.p`
  padding-right: 3px;
  color: #3f3a3a;
  font-size: 30px;
  font-weight: 400;
  line-height: 36px;
`;

const OrderSummarySplit = styled.div`
  width: 240px;
  border-top: 1px solid #3f3a3a;
  margin-bottom: 19px;
`;

const Total = styled.p`
  color: #3f3a3a;
  font-size: 30px;
  font-weight: 400;
  line-height: 36px;
`;

const ConfirmCheckoutBtn = styled.button`
  margin-top: 30px;
  width: 240px;
  height: 64px;
  border: 0;
  padding: 0;
  padding-left: 3px;
  padding-top: 2px;
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 4px;
  &:hover {
    cursor: pointer;
  }
`;
