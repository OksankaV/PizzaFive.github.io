import { modalMenuWindow } from "./item_modal.js";
import { getCartFromSessionStorage } from "./cart-functions.js";
import {pizzaMakeItem, pastaMakeItem, snackMakeItem, drinkMakeItem, sauseMakeItem} from "./make-item-page.js";

const products = JSON.parse(localStorage.getItem("data"));

$(function () {
  //index first-view slick-slider
  $(".slick-slider").slick({
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
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

  /*function changeTotalCountCart() {
    let cart = getCartFromSessionStorage();
    let totalCountCart = 0;
    if (cart === null || cart.items.length == 0) {
      totalCountCart = 0;
    } else {
      cart.items.forEach((value) => {
        totalCountCart += value.itemCount;
      });
    }
    $(".header-shoppingcart span").html("(" + totalCountCart + ")");
  }*/

  let pageMenuName;
  if ($(".page-menu-list") !== undefined && $(".page-menu-list") !== null) {
    pageMenuName = $(".page-menu-list").data("menu");
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

  /*  function getCartFromSessionStorage() {
    try {
      return JSON.parse(sessionStorage.getItem("cart"));
    } catch (error) {
      return null;
    }
  }*/

  function openShopCartModal(event) {
    event.preventDefault();
    $(".modal-shopping-cart").removeClass("hidden");
    $(".overlay").removeClass("hidden");
    let cart = getCartFromSessionStorage();
    makeCartListHTML();
    $(".make-order-button").on("click", showOrderModal);

    function makeCartListHTML() {
      if (cart === null || cart.items.length == 0) {
        $(".main-flex-container-sc")
          .html("<h3>Кошик порожній</h3>")
          .append('<img class="empty-cart-img" src="images/empty-cart.png">');
        $(".modal-shopping-cart").css("height", "250px");
      } else {
        $(".main-flex-container-sc").html("");
        let maxHeight = 800;
        let height = cart.items.length * 164;
        if (height < maxHeight) {
          maxHeight = height;
        }
        $(".modal-shopping-cart").css("height", maxHeight + 220 + "px");
        $(".main-flex-container-sc").css("height", height + 150 + "px");
        let totalPrice = 0;
        $.each(cart.items, (index, value) => {
          let item = products[value.itemGroup].find(
            ({ id }) => id === value.itemId
          );

          let addOnList = "";
          let newAddOnItemsArray = [];

          if (value.addOnItemsArray.length === 0 && value.cheeseBorder === 0) {
            addOnList = "";
          } else {
            newAddOnItemsArray = value.addOnItemsArray.slice();
            if (value.cheeseBorder != 0) {
              newAddOnItemsArray.push(
                "сирний борт (" + value.cheeseBorder + ")"
              );
            }
            addOnList =
              '<p class="addOnList">(' +
              newAddOnItemsArray.join(", ") +
              ")</p>";
          }
          let itemCartName = "";
          if (value.itemGroup === "pizza") {
            itemCartName = 'Піца "' + item.name + '"';
          } else if (value.itemGroup === "pasta") {
            if (item.id.includes("burger")) {
              itemCartName = item.name;
            } else {
              itemCartName = 'Паста "' + item.name + '"';
            }
          } else {
            itemCartName = item.name;
          }
          let itemCartWeight;
          let itemCartPrice;
          if (value.itemGroup === "drink") {
            itemCartWeight = value.volumeDrink + " л.";
            itemCartPrice = item.volumePrice[value.volumeDrink];
          } else {
            itemCartWeight = item.weight;
            itemCartPrice = item.price;
          }
          totalPrice +=
            itemCartPrice * value.itemCount +
            value.itemCount * value.addOnItemsArray.length * 10 +
            value.cheeseBorder * 10;
          $(".main-flex-container-sc").append(
            '<div class="item-flex-container-sc"><img src="' +
              item.image +
              '" alt=""><div class="description-flex-container-sc" ><p>' +
              itemCartName +
              "</p><p>" +
              itemCartWeight +
              " / " +
              itemCartPrice +
              " грн.</p><p>Додаткові інгредієнти: <span>(" +
              (parseInt(value.addOnItemsArray.length) +
                parseInt(value.cheeseBorder)) +
              ")</span></p>" +
              addOnList +
              '<div class="quantity-changer-box" id="' +
              index +
              '"><a class="quantity-changer-minus" href="#"></a><span>' +
              value.itemCount +
              '</span><a class="quantity-changer-plus" href="#"></a></div></div></div>'
          );
        });
        let deliveryPrice;
        if (totalPrice >= 500) {
          deliveryPrice = 0;
        } else {
          deliveryPrice = 50;
        }
        $(".main-flex-container-sc").append(
          '<div class="total-sc"><p>Доставка: ' +
            deliveryPrice +
            " грн.</p><p>Всього: " +
            (totalPrice + deliveryPrice) +
            ' грн.</p></div><div class="make-order-button"><button>Оформити замовлення</button></div>'
        );
      }
      changeQuantityInCart();
    }

    function changeQuantityInCart() {
      $(".description-flex-container-sc .quantity-changer-box").each(
        (index, value) => {
          $(value)
            .find(".quantity-changer-minus")
            .on("click", (event) => {
              let itemCount = $(event.currentTarget).next("span").html();
              if (itemCount > 0) {
                if (itemCount == 1) {
                  let deleteItem = confirm(
                    "Ви справді хочете видалити даний продукт з корзини?"
                  );

                  if (deleteItem) {
                    let itemToDelete = $(event.currentTarget)
                      .parent()
                      .attr("id");
                    delete cart.items.splice(itemToDelete, 1);
                    sessionStorage.setItem("cart", JSON.stringify(cart));
                    makeCartListHTML();
                  } else {
                    itemCount = 1;
                    $(event.currentTarget).next("span").html(itemCount);
                    let itemToChange = $(event.currentTarget)
                      .parent()
                      .attr("id");
                    cart.items[itemToChange].itemCount = itemCount;
                    sessionStorage.setItem("cart", JSON.stringify(cart));
                    makeCartListHTML();
                  }
                } else {
                  let itemToChange = $(event.currentTarget).parent().attr("id");

                  console.log(itemCount, cart.items[itemToChange].cheeseBorder);
                  if (itemCount == cart.items[itemToChange].cheeseBorder) {
                    cart.items[itemToChange].cheeseBorder = itemCount - 1;
                  }
                  itemCount--;
                  $(event.currentTarget).next("span").html(itemCount);
                  cart.items[itemToChange].itemCount = itemCount;
                  sessionStorage.setItem("cart", JSON.stringify(cart));
                  makeCartListHTML();
                }
                //calculatePrice(itemCount, price, cheeseBorder, addOnItem);
              }
            });
        }
      );
      $(".description-flex-container-sc .quantity-changer-box").each(
        (index, value) => {
          $(value)
            .find(".quantity-changer-plus")
            .on("click", (event) => {
              let itemCount = $(event.currentTarget).prev("span").html();
              itemCount++;
              $(event.currentTarget).prev("span").html(itemCount);
              let itemToChange = $(event.currentTarget).parent().attr("id");
              cart.items[itemToChange].itemCount = itemCount;
              sessionStorage.setItem("cart", JSON.stringify(cart));
              makeCartListHTML();

              //$("#itemQuantity").val(itemCount);
              //calculatePrice(itemCount, price, cheeseBorder, addOnItem);
            });
        }
      );
    }

    //close modal
    $(".close-button").on("click", modalClose);

    $(document).on("keydown", function (e) {
      if (
        e.key === "Escape" &&
        !$(".modal-shopping-cart").classList.contains("hidden")
      ) {
        modalClose();
      }
    });

    $(".overlay").on("click", modalClose);

    function modalClose() {
      $(".modal-shopping-cart").addClass("hidden");
      $(".overlay").addClass("hidden");
    }
  }

  function showOrderModal(event) {
    event.preventDefault();
    $(".modal-shopping-cart").addClass("hidden");
    $(".modal-order-form").removeClass("hidden");
    $(".required-input-mark").addClass("hidden");
    $("#empty-error").addClass("hidden");
    $("#correct-error").addClass("hidden");
    $("#payment-button-cash").attr("checked", "checked");
    $("#result-payment-0").removeClass("hidden");

    $("input[type='radio']").on("change", (event) => {
      let radioIndex = $(event.target).val();
      $(".result-payment-box").addClass("hidden");
      $("#result-payment-" + radioIndex).removeClass("hidden");
    });

    //close modal
    $(".close-button").on("click", modalClose);

    $(document).on("keydown", function (e) {
      if (
        e.key === "Escape" &&
        !$(".modal-order-form").classList.contains("hidden")
      ) {
        modalClose();
      }
    });

    $(".overlay").on("click", modalClose);

    function modalClose() {
      $(".modal-order-form").addClass("hidden");
      $(".overlay").addClass("hidden");
    }

    //submit order form
    let validEmpty = true;
    let validCorrect = true;
    let errorMessageArray = [];
    $("#order-form-submit").on("click", () => {
      validEmpty = true;
      validCorrect = true;
      errorMessageArray = [];
      validateEmpty("#input-name");
      validateEmpty("#input-tel");
      validateEmpty("#input-address");
      validateEmpty("#input-building");
      validateCorrect(
        "#input-name",
        /^[a-z\u0430-\u0491\s\D]+$/i,
        "Ім'я вказано неправильно"
      );
      validateCorrect(
        "#input-tel",
        /^\+38\(?0\(?\d{2}\)?\d{7}$/,
        "Телефон вказано неправильно"
      );
      if (validEmpty) {
        $("#empty-error").addClass("hidden");
      }
      if (validCorrect) {
        $("#correct-error").addClass("hidden");
      }
      if (validEmpty && validCorrect) {
        sessionStorage.removeItem("cart");
        location.href = "./order_confirmation_page.html";
      }
    });

    function validateCorrect(inputId, regExp, errorMessage) {
      if (!$(inputId).val().match(regExp)) {
        $(inputId).css("border-width", "3px");
        $(inputId).next("span").removeClass("hidden");
        errorMessageArray.push(errorMessage);
        $("#correct-error")
          .removeClass("hidden")
          .html(errorMessageArray.join(", "));
        validCorrect = false;
      } else {
        $(inputId).css("border-width", "2px");
      }
    }

    function validateEmpty(inputId) {
      if ($(inputId).val() === "") {
        $(inputId).css("border-width", "3px");
        $(inputId).next("span").removeClass("hidden");
        $("#empty-error").removeClass("hidden");
        validEmpty = false;
      } else {
        $(inputId).next("span").addClass("hidden");
        $(inputId).css("border-width", "2px");
      }
    }
  }

  /*function pizzaMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.append(
      $("<span></span>").html(item.weight + " г / " + item.price + " грн.")
    );
    div.appendTo(menuItemDiv);
    let pItem = $("<p></p>")
      .attr("class", "descripton-height-pizza")
      .html("(" + item.description + ")");
    pItem.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

  function makeBaseHtml(item, index) {
    let menuItemDiv = $("<div></div>")
      .attr("class", "menu-item-flex-container")
      .attr("id", item.id);
    $(".page-menu-list ul").append($("<li></li>").append(menuItemDiv));
    $(".menu-item-flex-container")
      .last()
      .append($("<img>").attr("src", item.image).attr("alt", item.id));
    let div = $("<div></div>")
      .attr("class", "name-and-price")
      .append($("<h4></h4>").html(item.name));
    let aItem;
    if (pageMenuName === "pasta") {
      if (index < 3) {
        aItem = $("<a></a>")
          .attr("class", "order-button btn-pasta")
          .attr("href", "#")
          .html("Замовити");
      } else {
        aItem = $("<a></a>")
          .attr("class", "order-button btn-burger")
          .attr("href", "#")
          .html("Замовити");
      }
    } else {
      aItem = $("<a></a>")
        .attr("class", "order-button")
        .attr("href", "#")
        .html("Замовити");
    }

    return [menuItemDiv, div, aItem];
  }

  function pastaMakeItem(item, index) {
    let returnedData = makeBaseHtml(item, index);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.append(
      $("<span></span>").html(item.weight + " г / " + item.price + " грн.")
    );
    div.appendTo(menuItemDiv);
    let pItem = $("<p></p>")
      .attr("class", "descripton-height-pasta")
      .html("(" + item.description + ")");
    pItem.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

  function snackMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.append(
      $("<span></span>").html(
        item.weight + " г / " + item.sauseWeight + " / " + item.price + " грн."
      )
    );
    div.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

  function drinkMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

  function sauseMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

  function modalMenuWindow(itemName) {
    let modal = $(".modal-" + itemName);
    let itemTotalPrice = 0;
    //open modal
    $(".order-button").each((index, currentValue) => {
      $(currentValue).on("click", openModal);
    });
    let itemCount = 1;
    let cheeseBorder = 0;
    let addOnItem = 0;

    function openModal(event) {
      if (event.target.classList.contains("btn-burger")) {
        modal = $(".modal-burger");
        modal.removeClass("hidden");
        $(".overlay").removeClass("hidden");
      } else {
        modal.removeClass("hidden");
        $(".overlay").removeClass("hidden");
      }

      const itemParentDiv = $(event.target).parent();
      const itemId = itemParentDiv.attr("id");
      let itemCurrentObj = {};
      let drinkCount0 = 1;
      let drinkCount1 = 0;
      let drinkCount2 = 0;

      itemCount = 1;
      cheeseBorder = 0;
      addOnItem = 0;

      $(modal).find("*").off();
      $(".count-span-item").html(itemCount);
      $(".count-span").html(cheeseBorder);
      $("input:checkbox").each((index, value) => {
        if ($(value).prop("checked")) {
          $(value).removeAttr("checked");
        }
      });

      function changeQuantity(containerClass, price) {
        $(containerClass)
          .find(".quantity-changer-minus")
          .on("click", (event) => {
            if (itemCount > 1) {
              if (itemCount === cheeseBorder) {
                cheeseBorder--;
                $("#cheese-border").html(cheeseBorder);
                $("#borderQuantity").val(cheeseBorder);
              }
              itemCount--;

              $(event.currentTarget).next("span").html(itemCount);
              $("#itemQuantity").val(itemCount);
              calculatePrice(itemCount, price, cheeseBorder, addOnItem);
            }
          });
        $(containerClass)
          .find(".quantity-changer-plus")
          .on("click", (event) => {
            itemCount++;
            $(event.currentTarget).prev("span").html(itemCount);
            $("#itemQuantity").val(itemCount);
            calculatePrice(itemCount, price, cheeseBorder, addOnItem);
          });
      }

      switch (pageMenuName) {
        case "pizza":
          products.pizza.forEach((value) => {
            if (itemId === value.id) {
              itemCurrentObj = value;
            }
          });

          calculatePrice(
            itemCount,
            itemCurrentObj.price,
            cheeseBorder,
            addOnItem
          );

          $(".itemPriceModal").html(
            itemCurrentObj.weight + " г / " + itemCurrentObj.price + " грн."
          );
          $(".itemDescriptionModal").html(
            "(" + itemCurrentObj.description + ")"
          );
          $(".pizza-add-ons li").each((index, value) => {
            $(value).on("click", { imgClick: false }, toggleCheckbox);
          });

          changeQuantity(".order-item-flex-container", itemCurrentObj.price);

          $(".order-item-flex-container2")
            .find(".quantity-changer-minus")
            .on("click", (event) => {
              if (cheeseBorder > 0) {
                cheeseBorder--;
              }
              $(event.currentTarget).next("span").html(cheeseBorder);
              $("#borderQuantity").val(cheeseBorder);
              calculatePrice(
                itemCount,
                itemCurrentObj.price,
                cheeseBorder,
                addOnItem
              );
            });
          $(".order-item-flex-container2")
            .find(".quantity-changer-plus")
            .on("click", (event) => {
              if (cheeseBorder < itemCount) {
                cheeseBorder++;
                $(event.currentTarget).prev("span").html(cheeseBorder);
                $("#borderQuantity").val(cheeseBorder);
                calculatePrice(
                  itemCount,
                  itemCurrentObj.price,
                  cheeseBorder,
                  addOnItem
                );
              }
            });

          $(".add-to-shopping-cart button").on("click", (event) => {
            addToShoppingCart(itemCurrentObj.id);
          });

          break;
        case "pasta":
          products.pasta.forEach((value) => {
            if (itemId === value.id) {
              itemCurrentObj = value;
            }
          });
          $(".itemPriceModal").html(
            itemCurrentObj.weight + " г / " + itemCurrentObj.price + " грн."
          );
          $(".itemDescriptionModal").html(
            "(" + itemCurrentObj.description + ")"
          );
          $(".pizza-add-ons li").each((index, value) => {
            $(value).on("click", { imgClick: false }, toggleCheckbox);
          });
          $(".snack-add-ons img").each((index, value) => {
            $(value).on("click", { imgClick: true }, toggleCheckbox);
          });

          changeQuantity(".order-item-flex-container", itemCurrentObj.price);
          calculatePrice(
            itemCount,
            itemCurrentObj.price,
            cheeseBorder,
            addOnItem
          );
          $(".add-to-shopping-cart button").on("click", (event) => {
            addToShoppingCart(itemCurrentObj.id);
          });

          break;
        case "snack":
          products.snack.forEach((value) => {
            if (itemId === value.id) {
              itemCurrentObj = value;
            }
          });
          $(".itemPriceModal").html(
            itemCurrentObj.weight +
              " г / " +
              itemCurrentObj.sauseWeight +
              " / " +
              itemCurrentObj.price +
              " грн."
          );
          $(".snack-add-ons img").each((index, value) => {
            $(value).on("click", { imgClick: true }, toggleCheckbox);
          });
          calculatePrice(
            itemCount,
            itemCurrentObj.price,
            cheeseBorder,
            addOnItem
          );
          changeQuantity(".order-item-flex-container", itemCurrentObj.price);
          $(".add-to-shopping-cart button").on("click", (event) => {
            addToShoppingCart(itemCurrentObj.id);
          });

          break;
        case "drink":
          products.drink.forEach((value) => {
            if (itemId === value.id) {
              itemCurrentObj = value;
            }
          });

          $(".quantity-changer-column").each((index, value) => {
            $(value)
              .find("h4")
              .html(
                itemCurrentObj.volume[index] +
                  " мл / " +
                  itemCurrentObj.price[index] +
                  " грн."
              );
          });

          $("#drinkCount0").html(drinkCount0);

          calculateDrinkPrice(
            drinkCount0,
            drinkCount1,
            drinkCount2,
            itemCurrentObj.price
          );

          $(".order-item-flex-container2-drink")
            .find(".quantity-changer-minus")
            .on("click", (event) => {
              decreaseDrinkCount(
                $(event.currentTarget),
                $(event.currentTarget).next("span").html()
              );

              calculateDrinkPrice(
                drinkCount0,
                drinkCount1,
                drinkCount2,
                itemCurrentObj.price
              );
            });
          $(".order-item-flex-container2-drink")
            .find(".quantity-changer-plus")
            .on("click", (event) => {
              inceraseDrinkCount(
                $(event.currentTarget),
                $(event.currentTarget).prev("span").html()
              );

              calculateDrinkPrice(
                drinkCount0,
                drinkCount1,
                drinkCount2,
                itemCurrentObj.price
              );
            });
          $(".add-to-shopping-cart button").on("click", (event) => {
            if (drinkCount0 > 0) {
              addToShoppingCart(itemCurrentObj.id, 0);
            }
            if (drinkCount1 > 0) {
              addToShoppingCart(itemCurrentObj.id, 1);
            }
            if (drinkCount2 > 0) {
              addToShoppingCart(itemCurrentObj.id, 2);
            }
          });
          break;
        case "sause":
          products.sause.forEach((value) => {
            if (itemId === value.id) {
              itemCurrentObj = value;
            }
          });
          $(".itemPriceModal").html(
            itemCurrentObj.weight + " г / " + itemCurrentObj.price + " грн."
          );
          $(".itemDescriptionModal").html(
            "(" + itemCurrentObj.description + ")"
          );
          calculatePrice(
            itemCount,
            itemCurrentObj.price,
            cheeseBorder,
            addOnItem
          );
          changeQuantity(".modal-sause", itemCurrentObj.price);
          $(".add-to-shopping-cart button").on("click", (event) => {
            addToShoppingCart(itemCurrentObj.id);
          });
          break;
        default:
          break;
      }

      function decreaseDrinkCount(item, drinkCount) {
        if (drinkCount > 0) {
          drinkCount--;
          item.next("span").html(drinkCount);
          item.parent().find("input[type=text]").val(drinkCount);

          if (item.next("span").attr("id") === "drinkCount0") {
            drinkCount0--;
          } else if (item.next("span").attr("id") === "drinkCount1") {
            drinkCount1--;
          } else if (item.next("span").attr("id") === "drinkCount2") {
            drinkCount2--;
          }
        }
      }
      function inceraseDrinkCount(item, drinkCount) {
        drinkCount++;
        item.prev("span").html(drinkCount);
        item.parent().find("input[type=text]").val(drinkCount);
        if (item.prev("span").attr("id") === "drinkCount0") {
          drinkCount0++;
        } else if (item.prev("span").attr("id") === "drinkCount1") {
          drinkCount1++;
        } else if (item.prev("span").attr("id") === "drinkCount2") {
          drinkCount2++;
        }
      }

      function calculatePrice(
        itemQuantity,
        price,
        borderQuantity,
        addOnQuantity
      ) {
        itemTotalPrice =
          itemQuantity * price +
          borderQuantity * 10 +
          addOnQuantity * 10 * itemQuantity;
        $(".add-to-shopping-cart button span").html(itemTotalPrice);
      }

      function calculateDrinkPrice(
        item0Quantity,
        item1Quantity,
        item2Quantity,
        price
      ) {
        itemTotalPrice =
          item0Quantity * price[0] +
          item1Quantity * price[1] +
          item2Quantity * price[2];
        $(".add-to-shopping-cart button span").html(itemTotalPrice);
      }

      function toggleCheckbox(event) {
        let currenCheckbox;
        if (event.data.imgClick) {
          currenCheckbox = $(event.currentTarget).parent().find("input");
        } else {
          currenCheckbox = $(event.currentTarget).find("input");
        }
        currenCheckbox.attr("checked", !currenCheckbox.attr("checked"));
        if (currenCheckbox.prop("checked")) {
          $(event.currentTarget).css("box-shadow", "none");
          $(event.currentTarget).css("color", "#FF5722");
          $(event.currentTarget).parent().find("label").css("color", "#FF5722");
          addOnItem++;
        } else {
          $(event.currentTarget).css("box-shadow", "0px 4px 10px #FF5722");
          $(event.currentTarget).css("color", "#151212");
          $(event.currentTarget).parent().find("label").css("color", "#151212");
          addOnItem--;
        }
        $(".ingridients-count span").html(addOnItem);
        calculatePrice(
          itemCount,
          itemCurrentObj.price,
          cheeseBorder,
          addOnItem
        );
      }

      function addToShoppingCart(itemId, drinkVolumeIndex = undefined) {
        //alert(itemId +  + cheeseBorder + addOnItem);
        const addOnItemsArray = $(".add-ons input")
          .filter((_, value) => $(value).is(":checked"))
          .map((_, value) => $(value).attr("value").toLowerCase());
        let selectedItem;
        let drinkCount = [drinkCount0, drinkCount1, drinkCount2];
        let itemVolume;
        if (drinkVolumeIndex !== undefined) {
          itemCount = drinkCount[drinkVolumeIndex];
          itemVolume = itemCurrentObj.volume[drinkVolumeIndex];
        }

        selectedItem = {
          itemId: itemId,
          volumeDrink:
            itemCurrentObj.volume === undefined ? undefined : itemVolume,
          itemCount: itemCount,
          cheeseBorder: cheeseBorder,
          addOnItemsArray: addOnItemsArray.toArray(),
          itemGroup: pageMenuName,
        };

        let cart = getCartFromSessionStorage();
        if (cart === null) {
          cart = {
            items: [],
          };
        }
        let repetedItem = false;
        cart.items.forEach((value, index) => {
          if (value.itemId == selectedItem.itemId) {
            if (
              value.addOnItemsArray.toString() ===
              selectedItem.addOnItemsArray.toString()
            ) {
              if (value.cheeseBorder == selectedItem.cheeseBorder) {
                if (value.volumeDrink == selectedItem.volumeDrink) {
                  cart.items[index].itemCount++;
                  repetedItem = true;
                }
              }
            }
          }
        });
        if (!repetedItem) {
          cart.items.push(selectedItem);
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        modalClose();
      }

      $(".itemImageModal")
        .attr("src", itemCurrentObj.image)
        .attr("alt", itemCurrentObj.id);
      $(".itemNameModal").html(itemCurrentObj.name);
    }
    //close modal
    $(".close-button").on("click", modalClose);

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modalClose();
      }
    });

    $(".overlay").on("click", modalClose);

    function modalClose() {
      $(modal).addClass("hidden");
      $(".overlay").addClass("hidden");
      $(".add-ons li")
        .css("box-shadow", "0px 4px 10px #FF5722")
        .css("color", "#151212");

      changeTotalCountCart();
    }
  }*/
});
