'use strict';

(function () {

  /* Открытие и закрытие модальных окон */
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
    document.body.style.overflow = 'visible';
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

  var onCallButtonClick = function (evt) {
    evt.preventDefault();
    callPopup.classList.add('modal--show');
    document.body.style.overflow = 'hidden';
    callPopup.querySelector('input[type="text"]').value = '';
    callPopup.querySelector('input[type="tel"]').value = '';
    callPopup.querySelector('input[type="checkbox"]').checked = false;
    callPopupCloseButton.addEventListener('click', function () {
      closePopup(callPopup);
    });
    callPopup.addEventListener('click', function (e) {
      if (e.target === callPopup) {
        closePopup(callPopup);
      }
    });
    document.addEventListener('keydown', onEscPress);
  };

  document.addEventListener('submit', onSubmit);
  callButton.addEventListener('click', onCallButtonClick);

  /* Маска для ввода телефона */
  var input = document.querySelector('#user-tel');

  var setCursorPosition = function (position, element) {
    element.focus();
    if (element.setSelectionRange) {
      element.setSelectionRange(position, position);
    } else if (element.createTextRange) {
      var range = element.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position);
      range.moveStart('character', position);
      range.select();
    }
  };

  var mask = function (event) {
    var matrix = '+7 (___) ___ __ __';
    var index = 0;
    var newValue = matrix.replace(/\D/g, '');
    var value = input.value.replace(/\D/g, '');

    if (newValue.length >= value.length) {
      value = newValue;
    }

    input.value = matrix.replace(/./g, function (char) {
      if (/[_\d]/.test(char) && index < value.length) {
        return value.charAt(index++);
      } else if (index >= value.length) {
        return '';
      }
      return char;
    });
    if (event.type === 'blur') {
      if (input.value.length === 2) {
        input.value = '';
      }
    } else {
      setCursorPosition(input.value.length, input);
    }
  };

  input.addEventListener('input', mask, false);
  input.addEventListener('focus', mask, false);
  input.addEventListener('blur', mask, false);

})();
