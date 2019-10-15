/* SPDX-License-Identifier: GPL-3.0-only */
/* Copyright 2019 Adam Jagosz. https://github.com/hyvyys/chordline */

/* eslint-disable no-unused-vars */
export default function watchIframeFocus(onFocus, onBlur) {
  let iframeClickedLast;

  function windowBlurred(e) {
    setTimeout(() => {
      const el = document.activeElement;
      if (el.tagName.toLowerCase() === 'iframe') {
        iframeClickedLast = true;
        onFocus();
      } 
    }, 150);
  }
  function windowFocussed(e) {
    if (iframeClickedLast) {
      iframeClickedLast = false;
      onBlur();
    } 
  }
  window.addEventListener('focus', windowFocussed, true);  
  window.addEventListener('blur', windowBlurred, true);
}