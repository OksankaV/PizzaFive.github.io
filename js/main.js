import { modalMenuWindow } from "./item_modal.js";
import { changeTotalCountCart, openShopCartModal } from "./cart-functions.js";
import {
  pizzaMakeItem,
  pastaMakeItem,
  snackMakeItem,
  drinkMakeItem,
  sauseMakeItem,
} from "./make-item-page.js";

import {products} from "./data.js";


$(function () {
  //index first-view slick-slider
  $(".slick-slider").slick({
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    useTransform: false,
    responsive: [
      {
        breakpoint: 1439,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1279,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  changeTotalCountCart();

  if ($(".page-menu-list") !== undefined && $(".page-menu-list") !== null) {
    let pageMenuName = $(".page-menu-list").data("menu");
    switch (pageMenuName) {
      case "pizza":
        products.pizza.forEach(pizzaMakeItem);
        break;
      case "pasta":
        products.pasta.forEach(pastaMakeItem);
        break;
      case "snack":
        products.snack.forEach(snackMakeItem);
        break;
      case "drink":
        products.drink.forEach(drinkMakeItem);
        break;
      case "sause":
        products.sause.forEach(sauseMakeItem);
        break;
      default:
        break;
    }
    if ($(".order-button") !== undefined && $(".order-button") !== null) {
      modalMenuWindow(pageMenuName);
    }
  }

  $(".header-shoppingcart-box").on("click", openShopCartModal);
});
