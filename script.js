document.addEventListener('DOMContentLoaded', function () {
  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Mobile nav toggle ----------
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after a link is tapped (mobile UX)
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Contact form validation ----------
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearErrors();

      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');
      var valid = true;

      if (!name.value.trim()) {
        showError('name', 'Please enter your name.');
        valid = false;
      }

      if (!email.value.trim()) {
        showError('email', 'Please enter your email address.');
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!message.value.trim()) {
        showError('message', 'Please briefly describe your inquiry.');
        valid = false;
      }

      if (!valid) {
        formStatus.textContent = 'Please correct the errors above.';
        formStatus.className = 'form-status error';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent = 'Thank you — your inquiry has been received. I will respond as soon as possible.';
            formStatus.className = 'form-status success';
            form.reset();
          } else {
            formStatus.textContent = 'Something went wrong sending your message. Please try again or email me directly.';
            formStatus.className = 'form-status error';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Something went wrong sending your message. Please try again or email me directly.';
          formStatus.className = 'form-status error';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  function showError(fieldName, msg) {
    var field = form.querySelector('#' + fieldName);
    var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
    if (field) field.classList.add('invalid');
    if (errorEl) errorEl.textContent = msg;
  }

  function clearErrors() {
    form.querySelectorAll('.invalid').forEach(function (el) {
      el.classList.remove('invalid');
    });
    form.querySelectorAll('.error-msg').forEach(function (el) {
      el.textContent = '';
    });
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
});
