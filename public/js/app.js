const productContainer = document.querySelector(".productContainer");

let nextPage = 0;
let initialLoadComplete = false;
let isNextPageProductsLoading = false;
const urlParameter = new URLSearchParams(window.location.search); // URLSearchParams constructor

function getProductsData(paging = 0) {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  const category = urlParameter.get("category");
  const query = urlParameter.get("q");
  let dataURL;

  if (query) {
    dataURL = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${query}&paging=${paging}`;
  } else {
    dataURL = `https://api.appworks-school.tw/api/1.0/products/${
      category || "all"
    }?paging=${paging}`;
  }

  return fetch(dataURL, { signal })
    .then((response) => response.json())
    .then((result) => {
      clearTimeout(timeoutId);
      if (result.next_paging !== undefined) {
        nextPage = result.next_paging;
        console.log(nextPage);
      } else {
        nextPage = null;
      }
      return result.data || [];
      //如果 result.data 為 null 或 undefined，return 空[]。
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

const loadingIcon = document.querySelector("#loadingIcon");

function render(data) {
  let html = "";
  for (let i = 0; i < data.length; i++) {
    let product = data[i];
    let colorHTML = "";
    for (let y = 0; y < product.colors.length; y++) {
      colorHTML += `
          <button class="color" style="background-color: #${product.colors[y].code}"></button>
        `;
    }
    html += `
        <div class="product">
          <a class="productLink" href="/product?id=${product.id}" title="${product.title}">
            <img src="${product.main_image}">
            <div class="colorsContainer">
              ${colorHTML}
            </div>
            <h3 class="productName">${product.title}</h3>
            <p class="productPrice">TWD.${product.price}</p>
          </a>
        </div>
      `;
  }
  if (html === "" && urlParameter.has("q")) {
    loadingIcon.style.display = "none";
    alert("Sorry，沒有符合搜尋條件的商品！");
    window.location.href = `/homepage`;
  } else {
    loadingIcon.style.display = "none";
    productContainer.innerHTML += html;
  }
}

function initialLoad() {
  if (!initialLoadComplete) {
    getProductsData(nextPage).then((result) => {
      render(result);
      initialLoadComplete = true;
    });
  }
}

//Infinite scroll
function loadMore(data) {
  render(data);
  if (!nextPage) {
    window.removeEventListener("scroll", scrollHandler);
  }
}

function scrollHandler() {
  if (!initialLoadComplete || isNextPageProductsLoading || !nextPage) {
    return;
  }
  let reachBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight;

  if (reachBottom) {
    isNextPageProductsLoading = true;
    getProductsData(nextPage).then((result) => {
      loadMore(result);
      isNextPageProductsLoading = false;
    });
  }
}

// 手機版搜尋框出現、消失
const searchBarMobile = document.querySelector(".searchBarMobile");
document.querySelector("#searchMobile").addEventListener("click", () => {
  searchBarMobile.style.display = "block";
  //確保元素獲得焦點
  searchBarMobile.focus();
});

searchBarMobile.addEventListener("blur", () => {
  searchBarMobile.style.display = "none";
});

//搜尋功能，當頁面有focusin事件時，檢查事件發生對象是否為searchInput
document.addEventListener("focusin", (event) => {
  let searchInput = event.target;
  if (searchInput.classList.contains("searchInput")) {
    //檢查當前focus對象的class是否含有search input
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        let searchURI = `?q=${searchInput.value}`;
        window.location.href = `/homepage${searchURI}`;
      }
    });
  }
});

window.addEventListener("load", initialLoad);
//Infinite scroll
window.addEventListener("scroll", scrollHandler);

//更新購物車顯示數量
const updateCartQuantity = () => {
  const itemsAddedToCart = localStorage.getItem("itemsAddedToCart");
  const itemsAddedToCartObject = itemsAddedToCart
    ? JSON.parse(itemsAddedToCart)
    : [];
  console.log(`Items in Cart: ${itemsAddedToCart}`);
  const totalQtyOfEveryItem = itemsAddedToCartObject.reduce(
    (acc, item) => acc + item.qty,
    0
  );
  console.log(`Total Quantity: ${totalQtyOfEveryItem}`);
  const cartBadgeMobile = document.querySelector(".cart-badge-mobile");
  const cartBadgeDesktop = document.querySelector(".cart-badge");
  if (totalQtyOfEveryItem > 0) {
    cartBadgeMobile.style.display = "flex";
    cartBadgeDesktop.style.display = "flex";
  } else {
    cartBadgeMobile.style.display = "none";
    cartBadgeDesktop.style.display = "none";
  }
  cartBadgeMobile.innerText = totalQtyOfEveryItem;
  cartBadgeDesktop.innerText = totalQtyOfEveryItem;
};

updateCartQuantity();
window.addEventListener("cartUpdate", updateCartQuantity);

//新增carousel
function initializeCarousel() {
  return fetch("https://api.appworks-school.tw/api/1.0//marketing/campaigns")
    .then((response) => response.json())
    .then((result) => result.data)
    .then((data) => {
      const keyVisualContainer = document.querySelector(".keyVisualContainer");
      const carouselBtnContainer = document.querySelector(
        ".carouselBtnContainer"
      );
      const sloganContainer = document.querySelector(".sloganContainer");

      for (let i = 0; i < data.length; i++) {
        let newCampaignLink = document.createElement("a");
        newCampaignLink.setAttribute("class", "campaignLink");
        newCampaignLink.setAttribute(
          "href",
          `/product?id=${data[i].product_id}`
        );
        keyVisualContainer.appendChild(newCampaignLink);

        let newKeyVisualElement = document.createElement("img");
        newKeyVisualElement.setAttribute("class", "keyVisual");
        newKeyVisualElement.setAttribute("src", data[i].picture);
        newCampaignLink.appendChild(newKeyVisualElement);

        let newCampaignLinkForSlogan = document.createElement("a");
        newCampaignLinkForSlogan.setAttribute("class", "campaignLinkForSlogan");
        newCampaignLinkForSlogan.setAttribute(
          "href",
          `/product?id=${data[i].product_id}`
        );
        sloganContainer.appendChild(newCampaignLinkForSlogan);

        let newSloganElement = document.createElement("div");
        newSloganElement.setAttribute("class", "slogan");
        let story = convertCampaignStoryToHTML(data[i].story);
        newSloganElement.innerHTML = story;
        newCampaignLinkForSlogan.appendChild(newSloganElement);

        let newCarouselBtn = document.createElement("button");
        newCarouselBtn.setAttribute("class", "carouselBtn");
        carouselBtnContainer.appendChild(newCarouselBtn);
      }
      document.querySelector(".campaignLink").classList.add("active");
      document.querySelector(".keyVisual").classList.add("active");
      document.querySelector(".campaignLinkForSlogan").classList.add("active");
      document.querySelector(".slogan").classList.add("active");
      document.querySelector(".carouselBtn").classList.add("active");
    });
}

function convertCampaignStoryToHTML(text) {
  let lines = text.split("\r\n");
  let paragraph = `<p>${lines.slice(0, -1).join("<br>")}</p>`;
  let heading = `<h2>${lines[lines.length - 1]}</h2>`;
  return paragraph + heading;
}

function slideCarousel() {
  const campaignLinks = document.querySelectorAll(".campaignLink");
  const keyVisuals = document.querySelectorAll(".keyVisual");
  const campaignLinksForSlogan = document.querySelectorAll(
    ".campaignLinkForSlogan"
  );
  const slogans = document.querySelectorAll(".slogan");
  const carouselBtns = document.querySelectorAll(".carouselBtn");

  let interval = setInterval(run, 5000);
  let id = 0;

  function changeImage() {
    document.querySelector(".campaignLink.active").classList.remove("active");
    document.querySelector(".keyVisual.active").classList.remove("active");
    document
      .querySelector(".campaignLinkForSlogan.active")
      .classList.remove("active");
    document.querySelector(".slogan.active").classList.remove("active");
    document.querySelector(".carouselBtn.active").classList.remove("active");

    if (id > keyVisuals.length - 1) {
      id = 0;
    }
    campaignLinks[id].classList.add("active");
    keyVisuals[id].classList.add("active");
    campaignLinksForSlogan[id].classList.add("active");
    slogans[id].classList.add("active");
    carouselBtns[id].classList.add("active");
  }

  document
    .querySelector(".carouselBtnContainer")
    .addEventListener("click", (event) => {
      const carouselBtnClicked = event.target;
      if (carouselBtnClicked.classList.contains("carouselBtn")) {
        clearInterval(interval);
        id = Array.from(carouselBtns).indexOf(carouselBtnClicked);
        changeImage();
        interval = setInterval(run, 5000);
      }
    });

  function run() {
    id++;
    changeImage();
  }
}

initializeCarousel().then(() => slideCarousel());
