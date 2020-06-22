'use strict';

(function () {
  /* Проверка поддержки webp и JS*/
  var headerElement = document.querySelector('.header');
  var aboutElement = document.querySelector('.about');
  var programsElement = document.querySelector('.programs');
  var requestElement = document.querySelector('.request');
  var preparationElement = document.querySelector('.preparation');
  var galleryElement = document.querySelector('.gallery');
  var invitationElement = document.querySelector('.instagram-invitation');
  var faqElement = document.querySelector('.faq');
  var reviewsElement = document.querySelector('.reviews');
  var contactsElement = document.querySelector('.contacts');

  function checkWebpSupport() {
    var WebP = new Image();

    function renameElement(element) {
      element.className = element.className.replace(/\bwebp\b/, 'nowebp');
    }

    WebP.onload = WebP.onerror = function () {
      var isSupported = (WebP.height === 2);

      if (!isSupported) {
        renameElement(headerElement);
        renameElement(aboutElement);
        renameElement(programsElement);
        renameElement(requestElement);
        renameElement(preparationElement);
        renameElement(galleryElement);
        renameElement(invitationElement);
        renameElement(faqElement);
        renameElement(reviewsElement);
        renameElement(contactsElement);
      }
    };
    WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  faqElement.classList.remove('faq--nojs');
  galleryElement.classList.remove('gallery--nojs');
  reviewsElement.classList.remove('reviews--nojs');

  checkWebpSupport();

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
    var userName = evt.target.querySelector('#user-name') ? evt.target.querySelector('#user-name').value : '';
    var userTel = evt.target.querySelector('#user-tel') ? evt.target.querySelector('#user-tel').value : '';
    localStorage.setItem('userName', userName);
    localStorage.setItem('userTel', userTel);
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
  var inputs = document.querySelectorAll('input[type="tel"]');

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

  var changeTelephoneInputValue = function (event) {
    var input = event.target;
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

  function setInputsListeners(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].addEventListener('input', changeTelephoneInputValue, false);
      array[i].addEventListener('focus', changeTelephoneInputValue, false);
      array[i].addEventListener('blur', changeTelephoneInputValue, false);
    }
  }

  setInputsListeners(inputs);

  /* Переключение табов программ */
  var programsControlsBlock = document.querySelector('.programs__controls');
  var programButtons = programsControlsBlock.querySelectorAll('.programs__button');
  var programs = document.querySelectorAll('.programs__item');

  function disactivateProgramsButtons() {
    for (var i = 0; i < programButtons.length; i++) {
      programButtons[i].classList.remove('programs__button--active');
    }
  }

  function hideAllPrograms() {
    for (var i = 0; i < programs.length; i++) {
      programs[i].classList.remove('programs__item--active');
    }
  }

  function showProgram(title) {
    var programClass = '.programs__item--' + title;

    document.querySelector(programClass).classList.add('programs__item--active');
  }

  function onControlsClick(evt) {
    var title;

    hideAllPrograms();
    disactivateProgramsButtons();

    if (evt.target.tagName === 'BUTTON') {
      title = evt.target.dataset.title;
      evt.target.classList.add('programs__button--active');
    } else if (evt.target.tagName === 'SPAN') {
      title = evt.target.parentElement.dataset.title;
      evt.target.parentElement.classList.add('programs__button--active');
    }

    showProgram(title);
  }

  programsControlsBlock.addEventListener('click', onControlsClick);

  /* Слайдер галереи */
  var galleryControls = document.querySelectorAll('.gallery__control');
  var galleryPictures = document.querySelectorAll('.gallery__picture');

  function disactivateGalleryControls() {
    for (var i = 0; i < galleryControls.length; i++) {
      galleryControls[i].classList.remove('gallery__control--active');
    }
  }

  function hideAllGalleryPictures() {
    for (var i = 0; i < galleryPictures.length; i++) {
      galleryPictures[i].classList.remove('gallery__picture--active');
    }
  }

  function showPicture(index) {
    galleryPictures[index].classList.add('gallery__picture--active');
  }

  function onGalleryControlClick(evt) {
    var index;

    evt.preventDefault();

    for (var i = 0; i < galleryControls.length; i++) {
      if (galleryControls.item(i) === evt.target) {
        index = i;
      }
    }

    disactivateGalleryControls();
    evt.target.classList.add('gallery__control--active');
    hideAllGalleryPictures();
    showPicture(index);
  }

  function setGalleryControlsListeners() {
    for (var i = 0; i < galleryControls.length; i++) {
      galleryControls[i].addEventListener('click', onGalleryControlClick);
    }
  }

  setGalleryControlsListeners();

  /* Аккордеон FAQ */
  var faqButtons = document.querySelectorAll('.faq__button');

  function toggleFaqItemStatus(id) {
    var faqItemClassName = '.faq__item--' + id;

    document.querySelector(faqItemClassName).classList.toggle('faq__item--active');
  }

  function onFaqButtonClick(evt) {
    var id = evt.currentTarget.dataset.id;

    evt.preventDefault();
    toggleFaqItemStatus(id);
  }

  function setFaqButtonsListeners() {
    for (var i = 0; i < faqButtons.length; i++) {
      faqButtons[i].addEventListener('click', onFaqButtonClick);
    }
  }

  setFaqButtonsListeners();

  /* Слайдер отзывы */
  var reviews = document.querySelectorAll('.review');
  var previousButtons = document.querySelectorAll('.review__button--previous');
  var nextButtons = document.querySelectorAll('.review__button--next');

  function hideAllReviews() {
    for (var i = 0; i < reviews.length; i++) {
      reviews[i].classList.remove('review--active');
    }
  }

  function showReview(index) {
    reviews[index].classList.add('review--active');
  }

  function onPreviousButtonClick(evt) {
    var index;

    evt.preventDefault();
    hideAllReviews();

    for (var i = 0; i < previousButtons.length; i++) {
      if (previousButtons.item(i) === evt.target) {
        index = i;
      }
    }

    showReview(index - 1);
  }

  function onNextButtonClick(evt) {
    var index;

    evt.preventDefault();
    hideAllReviews();

    for (var i = 0; i < nextButtons.length; i++) {
      if (nextButtons.item(i) === evt.target) {
        index = i;
      }
    }

    showReview(index + 1);
  }

  function setPreviousButtonsListeners() {
    for (var i = 0; i < previousButtons.length; i++) {
      previousButtons[i].addEventListener('click', onPreviousButtonClick);
    }
  }

  function setNextButtonsListeners() {
    for (var i = 0; i < nextButtons.length; i++) {
      nextButtons[i].addEventListener('click', onNextButtonClick);
    }
  }

  setPreviousButtonsListeners();
  setNextButtonsListeners();

  /* Якорный скролл */
  var scroll = document.querySelector('.header__scroll');

  scroll.addEventListener('click', function (evt) {
    evt.preventDefault();
    var id = scroll.getAttribute('href');

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
})();
