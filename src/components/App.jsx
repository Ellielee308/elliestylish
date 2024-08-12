import GlobalStyle from "./GlobalStyle";
import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import MobileTab from "./MobileTab";
import Product from "./Product";
import Checkout from "./checkout/Checkout";

const HomePageRedirect = () => {
  window.location.href = "/homepage";
  return null;
};

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<HomePageRedirect />} />
        <Route path="product" element={<Product />} />
        <Route path="checkout" element={<Checkout />} />
      </Routes>
      <MobileTab />
      <Footer />
    </>
  );
};

export default App;
