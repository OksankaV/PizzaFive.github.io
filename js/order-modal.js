export function showOrderModal(event) {
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