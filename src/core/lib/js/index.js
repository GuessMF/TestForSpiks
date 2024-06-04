(function (window) {
  if (!window.app) {
    window.app = {};
  }

  const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка ${res.status}`);
  };

  const checkResponseSuccess = (res) => {
    if (res && res.success) {
      return res;
    }

    return Promise.reject(`Ответ не success: ${res}`);
  };

  const buildHttpClient = (baseUrl) => {
    return (endpoint, options = {}) => {
      return fetch(`${baseUrl}${endpoint}`, options)
        .then(checkResponse)
        .then(checkResponseSuccess);
    };
  };

  const setObserver = (element, handleObserve, manualConfig = {}) => {
    const config = {
      childList: true,
      ...manualConfig,
    };

    const observer = new MutationObserver(() => handleObserve(element));

    observer.observe(element, config);
  };

  const findAncestorsByClassName = (el, className, stopElement = null) => {
    let ancestorEls = [];
    let currentParent = el.parentElement;

    if (!currentParent) {
      return ancestorEls;
    }

    while (currentParent !== null && currentParent !== stopElement) {
      if (currentParent.classList.contains(className)) {
        ancestorEls = [...ancestorEls, currentParent];
      }

      currentParent = currentParent.parentElement;
    }

    return ancestorEls;
  };

  const findAncestorByClassName = (el, className) => {
    let ancestorEl = el.parentElement;

    while (!ancestorEl.classList.contains(className)) {
      ancestorEl = ancestorEl.parentElement;

      if (!ancestorEl) {
        return null;
      }
    }

    return ancestorEl;
  };

  const buildComponentLogger = (componentName) => {
    return (text, context = "", data = null) => {
      const msg = context
        ? `${componentName}:${context}:${text}`
        : `${componentName}:${text}`;
      console.debug(msg);

      if (data) {
        console.dir(data);
      }
    };
  };

  const debounce = (callee, timeoutMs) => {
    return function perform(...args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();

      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }

      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  };

  const throttle = (callee, timeout) => {
    let timer = null;

    return function perform(...args) {
      if (timer) return;

      timer = setTimeout(() => {
        callee(...args);

        clearTimeout(timer);
        timer = null;
      }, timeout);
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    const checkboxBlocks = document.querySelectorAll(".checkboxes__block");
    checkboxBlocks.forEach((block) => {
      block.addEventListener("click", function (event) {
        if (event.target.tagName !== "INPUT") {
          const checkbox = block.querySelector('input[type="checkbox"]');
          const resultsList = document.querySelector(".results__list");

          const newItem = document.createElement("li");
          if (!checkbox.checked) {
            newItem.classList.add("new-item");

            const span = document.createElement("span");
            span.textContent = checkbox.name;
            newItem.appendChild(span);

            const button = document.createElement("button");
            const img = document.createElement("img");
            img.src = "assets/media/close_btn.svg";
            img.alt = "close-icon";
            button.appendChild(img);
            newItem.appendChild(button);

            resultsList.appendChild(newItem);

            button.addEventListener("click", () => {
              checkbox.checked = false;
              newItem.remove();
            });
          } else {
            const newItems = resultsList.querySelectorAll("li");
            newItems.forEach((newItem) => {
              if (newItem.textContent === checkbox.name) {
                newItem.remove();
              }
            });
          }
          checkbox.checked = !checkbox.checked;
        }
      });
    });

    const sidebarAccordeons = document.querySelectorAll(
      ".sidebar__items .accordeon a"
    );

    sidebarAccordeons.forEach((item) => {
      item.addEventListener("click", () => {
        item.parentElement.classList.toggle("opened");
      });
    });

    const filterBtn = document.querySelector(".filter-btn");
    const filterList = document.querySelector(".sorting");

    filterBtn.addEventListener("click", () => {
      filterList.classList.toggle("open");
    });
  });

  window.app.lib = {
    setObserver,
    findAncestorsByClassName,
    findAncestorByClassName,
    buildComponentLogger,
    debounce,
    throttle,
    checkResponse,
    checkResponseSuccess,
    buildHttpClient,
  };
})(window);
