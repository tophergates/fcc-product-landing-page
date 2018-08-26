(function(context, doc) {
  'use strict';

  const toggleNavigation = linkBtnId => {
    const OPEN_LABEL = 'Open and skip to navigation';
    const CLOSED_LABEL = 'Close and hide navigation';

    const getRegionObj = linkObj => {
      return doc.getElementById(linkObj.hash.replace('#', '')) || false;
    };

    const setAriaStates = (linkObj, regionObj, isExpanded) => {
      context.requestAnimationFrame(() => {
        linkObj.setAttribute('aria-expanded', isExpanded);
        regionObj.setAttribute('aria-hidden', !isExpanded);
        linkObj.setAttribute('aria-label', isExpanded ? CLOSED_LABEL : OPEN_LABEL);
      });
    };

    const toggleNav = linkObj => {
      const expanded = linkObj.getAttribute('aria-expanded') || false;

      if (expanded) {
        // string "false" is boolean true here
        const regionObj = getRegionObj(linkObj);

        if (regionObj) {
          // convert to boolean
          const isExpanded = expanded === 'true';
          setAriaStates(linkObj, regionObj, !isExpanded);

          if (isExpanded) {
            linkObj.focus();
          } else {
            // Small delay required for focusable object to reappear in DOM
            // (transitionend event would have CSS dependencies)
            setTimeout(function() {
              (regionObj.querySelector('a') || regionObj).focus();
            }, 100);
          }
        }
      }
    };

    const toggleAriaStates = event => {
      event.preventDefault();
      const linkObj = event.target;

      toggleNav(linkObj);
    };

    const addAriaAttributes = linkObj => {
      const regionObj = getRegionObj(linkObj);

      if (regionObj) {
        linkObj.setAttribute('aria-controls', regionObj.id);
        regionObj.setAttribute('aria-controlledby', linkObj.id);
        setAriaStates(linkObj, regionObj, false);
      }

      return regionObj;
    };

    const handleNavLinkClick = (linkObj, event) => {
      const regionObj = event.target.href
        ? getRegionObj(event.target)
        : getRegionObj(event.target.parentNode);
      const expanded = linkObj.getAttribute('aria-expanded') || false;
      const isExpanded = expanded === 'true';

      if (isExpanded) {
        toggleNav(linkObj);
      }

      if (regionObj) {
        // event.preventDefault();
        regionObj.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleOutsideClick = linkObj => {
      const expanded = linkObj.getAttribute('aria-expanded') || false;
      const isExpanded = expanded === 'true';

      if (isExpanded) {
        toggleNav(linkObj);
      }
    };

    const init = () => {
      const anchor = doc.getElementById(linkBtnId);

      if (anchor && addAriaAttributes(anchor)) {
        const regionObj = getRegionObj(anchor);
        const brandObj = doc.querySelector('.brand__link');

        // Toggle the navigation state when a navigation link or brand link is clicked
        regionObj.addEventListener('click', event => handleNavLinkClick.call(null, anchor, event));
        brandObj.addEventListener('click', event => handleNavLinkClick.call(null, anchor, event));

        // Toggle the navigation state when the document body is clicked
        doc.addEventListener('click', event => handleOutsideClick.call(null, anchor));

        // Change the navigation state when the hamburger button is clicked
        anchor.addEventListener('click', toggleAriaStates, false);
      }
    };

    return init();
  };

  toggleNavigation('hamburger');
})(window || {}, document);
