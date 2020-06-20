'use strict';

(function () {
  /* Проверка поддержки webp */
  function checkSupport(fn) {
    var html = document.documentElement;
    var WebP = new Image();

    WebP.onload = WebP.onerror = function () {
      var isSupported = (WebP.height === 2);

      if (isSupported) {
        if (html.className.indexOf('no-webp') >= 0) {
          html.className = html.className.replace(/\bno-webp\b/, 'webp');
        } else {
          html.className += ' webp';
        }
      }
      fn(isSupported);
    };
    WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  checkSupport();

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
    localStorage.setItem('userName', evt.target.querySelector('#user-name').value);
    localStorage.setItem('userTel', evt.target.querySelector('#user-tel').value);
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


  /* Переключение табов программ */
  var programsControlsBlock = document.querySelector('.programs__controls');
  var programButtons = programsControlsBlock.querySelectorAll('.programs__button');
  var programs = document.querySelectorAll('.programs__item');

  function disactivateProgramsButtons() {
    programButtons.forEach(function (button) {
      button.classList.remove('programs__button--active');
    });
  }

  function hideAllPrograms() {
    programs.forEach(function (program) {
      program.classList.remove('programs__item--active');
    });
  }

  function showProgram(title) {
    var programClass = '.programs__item--' + title;
    document.querySelector(programClass).classList.add('programs__item--active');
  }

  function onControlsClick(evt) {
    var title = evt.target.dataset.title;
    hideAllPrograms();
    disactivateProgramsButtons();
    showProgram(title);
    evt.target.classList.add('programs__button--active');
  }
  programsControlsBlock.addEventListener('click', onControlsClick);

  /* Слайдер галереи */
  var galleryControls = Array.from(document.querySelectorAll('.gallery__control'));
  var galleryPictures = Array.from(document.querySelectorAll('.gallery__picture'));

  function disactivateGalleryControls() {
    galleryControls.forEach(function (control) {
      control.classList.remove('gallery__control--active');
    });
  }

  function hideAllGalleryPictures() {
    galleryPictures.forEach(function (picture) {
      picture.classList.remove('gallery__picture--active');
    });
  }

  function showPicture(index) {
    galleryPictures[index].classList.add('gallery__picture--active');
  }

  function onGalleryControlClick(evt) {
    evt.preventDefault();
    var index = galleryControls.indexOf(evt.target);
    disactivateGalleryControls();
    evt.target.classList.add('gallery__control--active');
    hideAllGalleryPictures();
    showPicture(index);
  }

  galleryControls.forEach(function (control) {
    control.addEventListener('click', onGalleryControlClick);
  });

  /* Аккордеон FAQ */
  var faqButtons = document.querySelectorAll('.faq__button');

  function toggleFaqItemStatus(id) {
    var faqItemClassName = '.faq__item--' + id;
    document.querySelector(faqItemClassName).classList.toggle('faq__item--active');
  }

  function onFaqButtonClick(evt) {
    evt.preventDefault();
    var id = evt.currentTarget.dataset.id;
    toggleFaqItemStatus(id);
  }

  faqButtons.forEach(function (button) {
    button.addEventListener('click', onFaqButtonClick);
  });

  /* Слайдер отзывы */
  var reviews = Array.from(document.querySelectorAll('.review'));
  var previousButtons = Array.from(document.querySelectorAll('.review__button--previous'));
  var nextButtons = Array.from(document.querySelectorAll('.review__button--next'));

  function hideAllReviews() {
    reviews.forEach(function (review) {
      review.classList.remove('review--active');
    });
  }

  function showReview(index) {
    reviews[index].classList.add('review--active');
  }

  function onPreviousButtonClick(evt) {
    evt.preventDefault();
    hideAllReviews();
    var index = previousButtons.indexOf(evt.target);
    showReview(index - 1);
  }

  function onNextButtonClick(evt) {
    evt.preventDefault();
    hideAllReviews();
    var index = nextButtons.indexOf(evt.target);
    showReview(index + 1);
  }

  previousButtons.forEach(function (button) {
    button.addEventListener('click', onPreviousButtonClick);
  });

  nextButtons.forEach(function (button) {
    button.addEventListener('click', onNextButtonClick);
  });
})();
