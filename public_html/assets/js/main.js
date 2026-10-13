(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".header");
  if (!toggle || !nav || !header) return;

  var desktopQuery = window.matchMedia("(min-width: 901px)");

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function focusable() {
    return Array.prototype.filter.call(
      header.querySelectorAll("a[href], button"),
      function (el) {
        return !el.hasAttribute("disabled") && el.getClientRects().length > 0;
      }
    );
  }

  function focusWithoutScroll(el) {
    try {
      el.focus({ preventScroll: true });
    } catch (error) {
      el.focus();
    }
  }

  function openMenu() {
    header.classList.add("is-open");
    document.body.classList.add("nav-lock");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Закрыть меню");
    var firstLink = nav.querySelector("a[href]");
    if (firstLink) focusWithoutScroll(firstLink);
  }

  function closeMenu(focusToggle) {
    var wasOpen = isOpen();
    header.classList.remove("is-open");
    document.body.classList.remove("nav-lock");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    if (wasOpen && focusToggle) focusWithoutScroll(toggle);
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) closeMenu(true);
    else openMenu();
  });

  nav.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#") {
      closeMenu(false);
      return;
    }
    var target = document.getElementById(href.slice(1));
    if (!target) {
      closeMenu(false);
      return;
    }
    event.preventDefault();
    closeMenu(false);
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", href);
    }
    focusWithoutScroll(target);
  });

  document.addEventListener("click", function (event) {
    if (!isOpen() || header.contains(event.target)) return;
    closeMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key !== "Tab") return;

    var items = focusable();
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function onDesktopChange(event) {
    if (event.matches) closeMenu(false);
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onDesktopChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(onDesktopChange);
  }
})();
