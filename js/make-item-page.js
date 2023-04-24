export function pizzaMakeItem(item) {
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
    let pageMenuName = $(".page-menu-list").data("menu");
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

export function pastaMakeItem(item, index) {
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

export function snackMakeItem(item) {
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

export function drinkMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }

export function sauseMakeItem(item) {
    let returnedData = makeBaseHtml(item);
    let menuItemDiv = returnedData[0];
    let div = returnedData[1];
    div.appendTo(menuItemDiv);
    let aItem = returnedData[2];
    aItem.appendTo(menuItemDiv);
  }