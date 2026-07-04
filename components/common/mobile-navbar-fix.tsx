"use client";

import { useEffect } from "react";
import { useMenu } from "nextra-theme-docs";

const MOBILE_QUERY = "(max-width: 48rem)";
const OVERFLOW_LOCK_CLASS = "x:max-md:overflow-hidden";

const NAVBAR_INLINE_PROPS = ["position", "top", "left", "right", "width", "z-index"] as const;
const MOBILE_NAV_INLINE_PROPS = [
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "padding-top",
  "height",
  "max-height",
  "z-index",
] as const;

function clearInlineStyles(el: HTMLElement, props: readonly string[]) {
  for (const prop of props) {
    el.style.removeProperty(prop);
  }
}

function pinNavbar(navbar: HTMLElement) {
  navbar.style.setProperty("position", "fixed", "important");
  navbar.style.setProperty("top", "0", "important");
  navbar.style.setProperty("left", "0", "important");
  navbar.style.setProperty("right", "0", "important");
  navbar.style.setProperty("width", "100%", "important");
  navbar.style.setProperty("z-index", "100", "important");
}

function pinMobileNav(mobileNav: HTMLElement) {
  mobileNav.style.setProperty("inset", "auto", "important");
  mobileNav.style.setProperty("top", "var(--nextra-navbar-height)", "important");
  mobileNav.style.setProperty("right", "0", "important");
  mobileNav.style.setProperty("bottom", "0", "important");
  mobileNav.style.setProperty("left", "0", "important");
  mobileNav.style.setProperty("padding-top", "0", "important");
  mobileNav.style.setProperty("height", "calc(100dvh - var(--nextra-navbar-height))", "important");
  mobileNav.style.setProperty("max-height", "calc(100dvh - var(--nextra-navbar-height))", "important");
  mobileNav.style.setProperty("z-index", "90", "important");
}

export function MobileNavbarFix() {
  const menuOpen = useMenu();

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    let observer: MutationObserver | null = null;

    const preventBackgroundScroll = (event: TouchEvent | WheelEvent) => {
      const mobileNav = document.querySelector<HTMLElement>(".nextra-mobile-nav");
      const target = event.target;
      if (!(target instanceof Node) || !mobileNav) return;
      if (mobileNav.contains(target)) return;
      event.preventDefault();
    };

    const clearPinnedStyles = () => {
      const navbar = document.querySelector<HTMLElement>(".nextra-navbar");
      const mobileNav = document.querySelector<HTMLElement>(".nextra-mobile-nav");
      if (navbar) clearInlineStyles(navbar, NAVBAR_INLINE_PROPS);
      if (mobileNav) clearInlineStyles(mobileNav, MOBILE_NAV_INLINE_PROPS);
    };

    const teardownMenuLock = () => {
      observer?.disconnect();
      observer = null;
      document.removeEventListener("touchmove", preventBackgroundScroll);
      document.removeEventListener("wheel", preventBackgroundScroll);
      clearPinnedStyles();
    };

    const sync = () => {
      teardownMenuLock();

      if (!mq.matches || !menuOpen) return;

      const navbar = document.querySelector<HTMLElement>(".nextra-navbar");
      const mobileNav = document.querySelector<HTMLElement>(".nextra-mobile-nav");
      if (!navbar) return;

      pinNavbar(navbar);
      if (mobileNav) pinMobileNav(mobileNav);

      const html = document.documentElement;

      const stripOverflowLock = () => {
        pinNavbar(navbar);
        if (mobileNav) pinMobileNav(mobileNav);
        html.classList.remove(OVERFLOW_LOCK_CLASS);
      };

      stripOverflowLock();

      observer = new MutationObserver(stripOverflowLock);
      observer.observe(html, { attributes: true, attributeFilter: ["class"] });

      document.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
      document.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    };

    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      teardownMenuLock();
    };
  }, [menuOpen]);

  return null;
}
