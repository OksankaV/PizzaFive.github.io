import {
  getCartFromSessionStorage,
  changeTotalCountCart,
} from "./cart-functions.js";
import { products } from "./main.js";

export function modalMenuWindow(itemName) {
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
    modal = $(".modal-" + itemName);
    if (event.target.classList.contains("btn-burger")) {
      modal = $(".modal-burger");
      modal.removeClass("hidden");
      $(".overlay").removeClass("hidden");
    } else {
      modal.removeClass("hidden");
      $(".overlay").removeClass("hidden");
    }
    $(".snack-add-ons").find("li").css("box-shadow", "none");

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

    switch (itemName) {
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
        $(".itemDescriptionModal").html("(" + itemCurrentObj.description + ")");
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
        $(".itemDescriptionModal").html("(" + itemCurrentObj.description + ")");
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
                " л / " +
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
        $(".itemDescriptionModal").html("(" + itemCurrentObj.description + ")");
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
      calculatePrice(itemCount, itemCurrentObj.price, cheeseBorder, addOnItem);
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
        itemGroup: itemName,
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
}
