(function () {
  let config = {
    host: 'https://transferto.xyz',
    elementId: 'lifi-widget',
    mode: 'drawer', // drawer | inline
    buttonText: 'Li.Fi Swap',
    options: {
      fromChain: null,
      fromToken: null,
      toChain: null,
      toToken: null,
      fromAmount: null
    },
  };
  const drawerSettings = {
    activeClass: 'lifi__is-active',
    visibleClass: 'lifi__is-visible',
    targetAttribute: 'data-drawer-target',
    triggerAttribute: 'data-drawer-trigger',
    closeAttribute: 'data-drawer-close',
  }

  const attributeToSelector = (str) => `[${str}]`;

  const globalObject = window.lifi;
  const queue = globalObject.q;
  if (queue) {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i][0].toLowerCase() === 'init') {
        config = { ...config, ...queue[i][1] };
        init();
      }
      else {
        // handle other commands
      }
    }
  }

  function init() {
    const element = document.getElementById(config.elementId);
    if (config.mode === 'inline' && !element) {
      console.warn(`Couldn't find element with id ${config.elementId}. Did you forget to add it?`);
      return;
    }

    switch (config.mode) {
      case 'inline':
        createIframe(element);
        break;
      case 'drawer':
      default:
        createDrawer();
        break;
    }
  };

  function createIframe(parent) {
    const head = document.getElementsByTagName('head')[0];
    const styleTag = document.createElement('link');
    styleTag.rel = 'stylesheet';
    styleTag.type = 'text/css';
    styleTag.href = `${config.host}/widget.css`;
    styleTag.media = 'all';
    head.appendChild(styleTag);

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', createLink());
    iframe.setAttribute('scrolling', 'auto');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('title', 'Li.Fi Widget');
    iframe.setAttribute('class', 'lifi__widget-iframe');

    parent.appendChild(iframe);
    return iframe;
  }

  function createDrawer() {
    const lifi = document.createElement('div');
    const drawer = document.createElement('section');
    const overlay = document.createElement('div');
    const wrapper = document.createElement('div');
    const widget = document.createElement('div');
    const button = document.createElement('button');
    const buttonContent = document.createElement('div');
    const buttonText = document.createElement('div');
    const buttonTextSpan = document.createElement('span');
    const buttonClose = document.createElement('div');
    const arrow = document.createElement('div');

    lifi.setAttribute('class', 'lifi');

    drawer.setAttribute('id', 'lifi-drawer');
    drawer.setAttribute('class', 'lifi__drawer');
    drawer.setAttribute(drawerSettings.targetAttribute, '');

    overlay.setAttribute('class', 'lifi__drawer__overlay');
    overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute(drawerSettings.closeAttribute, '');

    wrapper.setAttribute('class', 'lifi__drawer__wrapper');

    widget.setAttribute('id', config.elementId);
    widget.setAttribute('class', 'lifi__widget');

    button.setAttribute('class', 'lifi__button lifi__button--right');
    button.setAttribute('aria-controls', 'lifi-drawer');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute(drawerSettings.triggerAttribute, '');
    button.setAttribute(drawerSettings.closeAttribute, '');

    buttonContent.setAttribute('class', 'lifi__button__content');
    buttonText.setAttribute('class', 'lifi__button__text');
    buttonTextSpan.innerHTML = config.buttonText;

    buttonClose.setAttribute('class', 'lifi__drawer__close');
    buttonClose.setAttribute('aria-label', 'Close Drawer');
    buttonClose.setAttribute(drawerSettings.closeAttribute, '');

    arrow.setAttribute('class', 'lifi__button__arrow');

    button.addEventListener('click', clickHandler, false);
    buttonClose.addEventListener('click', clickHandler, false);
    overlay.addEventListener('click', clickHandler, false);

    wrapper.appendChild(buttonClose);
    wrapper.appendChild(widget);
    drawer.appendChild(overlay);
    drawer.appendChild(wrapper);
    button.appendChild(buttonContent);
    buttonContent.appendChild(buttonText);
    buttonContent.appendChild(arrow);
    buttonText.appendChild(buttonTextSpan);
    lifi.appendChild(drawer);
    lifi.appendChild(button);
    document.body.appendChild(lifi);

    createIframe(widget);
  }

  function createLink() {
    Object.keys(config.options).forEach(key => !config.options[key] && delete config.options[key]);
    return `${config.host}/embed?${new URLSearchParams(config.options)}`;
  };

  function trapFocus(element) {
    const focusables = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    element.addEventListener('keydown', function (e) {
      const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);
      if (!isTabPressed) {
        return;
      }
      if (e.shiftKey) {  // shift + tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  function toggleAccessibility(event) {
    if (event.getAttribute('aria-expanded') === 'true') {
      event.setAttribute('aria-expanded', false);
    } else {
      event.setAttribute('aria-expanded', true);
    }
  };

  function openDrawer(trigger) {
    const drawerId = trigger.getAttribute('aria-controls');
    const target = document.getElementById(drawerId);
    target.classList.add(drawerSettings.activeClass);
    document.documentElement.style.overflow = 'hidden';
    toggleAccessibility(trigger);
    setTimeout(function () {
      target.classList.add(drawerSettings.visibleClass);
      trapFocus(target);
    }, 50);
  };

  function closeDrawer(event) {
    const target = document.querySelector(attributeToSelector(drawerSettings.targetAttribute));;
    const trigger = event.hasAttribute('aria-expanded') ? event : document.querySelector(`[aria-controls="${target.id}"`);
    target.classList.remove(drawerSettings.visibleClass);
    document.documentElement.style.overflow = '';
    toggleAccessibility(trigger);
    setTimeout(function () {
      target.classList.remove(drawerSettings.activeClass);
    }, 300);
  };

  function clickHandler(event) {
    event.preventDefault();
    const open = event.target.closest(attributeToSelector(drawerSettings.triggerAttribute));
    if (open && open.getAttribute('aria-expanded') !== 'true') {
      openDrawer(open);
      return;
    }
    const close = event.target.closest(attributeToSelector(drawerSettings.closeAttribute));
    if (close) {
      closeDrawer(close);
    }
  };

  function keydownHandler(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      const drawers = document.querySelectorAll(attributeToSelector(drawerSettings.targetAttribute));
      for (let i = 0; i < drawers.length; ++i) {
        if (drawers[i].classList.contains(drawerSettings.activeClass)) {
          closeDrawer(drawers[i]);
        }
      }
    }
  };
  document.addEventListener('keydown', keydownHandler, false);
})()
