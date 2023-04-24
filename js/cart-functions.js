import { showOrderModal } from "./order-modal.js";
import {products} from "./main.js";

export function getCartFromSessionStorage() {
  try {
    return JSON.parse(sessionStorage.getItem("cart"));
  } catch (error) {
    return null;
  }
}
export function changeTotalCountCart() {
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
}

export function openShopCartModal(event) {
  event.preventDefault();
  $(".modal-shopping-cart").removeClass("hidden");
  $(".overlay").removeClass("hidden");
  let cart = getCartFromSessionStorage();
  makeCartListHTML();
  

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
            newAddOnItemsArray.push("сирний борт (" + value.cheeseBorder + ")");
          }
          addOnList =
            '<p class="addOnList">(' + newAddOnItemsArray.join(", ") + ")</p>";
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
    $(".make-order-button").on("click", showOrderModal);
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
                  let itemToDelete = $(event.currentTarget).parent().attr("id");
                  delete cart.items.splice(itemToDelete, 1);
                  sessionStorage.setItem("cart", JSON.stringify(cart));
                  makeCartListHTML();
                } else {
                  itemCount = 1;
                  $(event.currentTarget).next("span").html(itemCount);
                  let itemToChange = $(event.currentTarget).parent().attr("id");
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
