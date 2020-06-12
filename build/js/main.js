'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var callPopup = document.querySelector('.modal--callback');
  var successPopup = document.querySelector('.modal--success');
  var callPopupCloseButton = callPopup.querySelector('.modal__close');
  var successPopupCloseButton = successPopup.querySelector('.modal__close');
  var successPopupConfirmButton = successPopup.querySelector('.modal__success-button');
  var callButton = document.querySelector('.header__button');

  var onEscPress = function (evt) {
    var popupElement = document.querySelector('.modal--show');
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup(popupElement);
    }
  };

  var closePopup = function (popup) {
    popup.classList.remove('modal--show');
    document.removeEventListener('keydown', onEscPress);
  };

  var closeAnyActivePopup = function () {
    while (document.querySelector('.modal--show')) {
      document.querySelector('.modal--show').classList.remove('modal--show');
      document.removeEventListener('keydown', onEscPress);
    }
  };

  var openSuccessPopup = function () {
    successPopup.classList.add('modal--show');
    successPopupConfirmButton.addEventListener('click', function () {
      closePopup(successPopup);
    });
    successPopupCloseButton.addEventListener('click', function () {
      closePopup(successPopup);
    });
    successPopup.addEventListener('click', function (e) {
      if (e.target === successPopup) {
        closePopup(successPopup);
      }
    });
    document.addEventListener('keydown', onEscPress);
  };

  var onSubmit = function (evt) {
    evt.preventDefault();
    closeAnyActivePopup();
    openSuccessPopup();
  };

  var onCallButtonClick = function () {
    callPopup.classList.add('modal--show');
    callPopup.querySelector('input[type="text"]').value = '';
    callPopup.querySelector('input[type="tel"]').value = '';
    callPopup.querySelector('input[type="checkbox"]').checked = false;
    callPopupCloseButton.addEventListener('click', function () {
      closePopup(callPopup);
    });
    callPopup.addEventListener('click', function (evt) {
      if (evt.target === callPopup) {
        closePopup(callPopup);
      }
    });
    document.addEventListener('keydown', onEscPress);
  };

  document.addEventListener('submit', onSubmit);
  callButton.addEventListener('click', onCallButtonClick);
})();
