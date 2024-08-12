import styled from "styled-components";

import lineIcon from "/images/line.png";
import twitterIcon from "/images/twitter.png";
import facebookIcon from "/images/facebook.png";

const Footer = () => {
  return (
    <FooterStyle>
      <FooterLinkContainer>
        <FooterLink href="#">關於 STYLiSH</FooterLink>
        <FooterSplit />
        <FooterLink href="#">服務條款</FooterLink>
        <FooterSplit />
        <FooterLink href="#">隱私政策</FooterLink>
        <FooterSplit />
        <FooterLink href="#">聯絡我們</FooterLink>
        <FooterSplit />
        <FooterLink href="#">FAQ</FooterLink>
      </FooterLinkContainer>
      <SocialMedia>
        <a href="#">
          <SocialMediaIcon src={lineIcon} />
        </a>
        <a href="#">
          <SocialMediaIcon src={twitterIcon} />
        </a>
        <a href="#">
          <SocialMediaIcon src={facebookIcon} />
        </a>
      </SocialMedia>
      <Copyright>&copy; 2018. All rights reserved.</Copyright>
    </FooterStyle>
  );
};

const FooterStyle = styled.footer`
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  padding-top: 23px;
  padding-bottom: 20px;
  margin-bottom: 60px;
  height: 146px;
  background-color: #313538;
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: center;
    height: 115px;
    width: 100vw;
    margin-bottom: 0px;
    padding-top: 46px;
    padding-bottom: 47px;
    background-color: #313538;
  }
`;

const FooterLinkContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(2, auto);
  grid-auto-flow: column dense;
  grid-row-gap: 8px;
  grid-column-gap: 36px;
  height: 76px;
  width: 177px;
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    grid-gap: 0;
    align-items: center;
    justify-content: stretch;
    margin-right: 101px;
    width: 670px;
    height: 22px;
  }
`;

const FooterLink = styled.a`
  display: block;
  padding: 0;
  border: none;
  height: 20px;
  background-color: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  text-overflow: clip;
  color: #d3d3d3;
  @media screen and (min-width: 1280px) {
    width: 134px;
    height: 22px;
    border: none;
    padding: 0;
    color: #d3d3d3;
    background-color: transparent;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    text-align: center;
  }
`;
const FooterSplit = styled.div`
  display: none;
  @media screen and (min-width: 1280px) {
    display: inline;
    border-left: 1px solid #808080;
    height: 16px;
  }
`;

const SocialMedia = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 88px;
  height: 20px;
  padding-top: 18px;
  margin-left: 31px;
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 210px;
    height: 50px;
    padding-top: 0;
    margin-left: 0;
  }
`;
const SocialMediaIcon = styled.img`
  width: 20px;
  height: 20px;
  @media screen and (min-width: 1280px) {
    width: 50px;
    height: 50px;
  }
`;
const Copyright = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 14px;
  color: #828282;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  text-align: center;
  @media screen and (min-width: 1280px) {
    width: 149px;
    height: 17px;
    margin-bottom: 0;
    margin-left: 30px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17.38px;
    text-align: center;
  }
`;

export default Footer;
