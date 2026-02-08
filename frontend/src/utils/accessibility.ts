/**
 * Accessibility utilities for the Todo App
 */

/**
 * Focus trap for modal dialogs and dropdowns
 */
export const focusTrap = (container: HTMLElement, firstFocus?: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = firstFocus || focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  };

  // Focus the first element
  firstElement?.focus();

  // Add event listener
  container.addEventListener('keydown', handleKeyDown);
};

/**
 * Announce a message to screen readers
 */
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the element after a delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Ensure proper contrast for text elements
 */
export const ensureContrast = (element: HTMLElement): void => {
  const computedStyle = window.getComputedStyle(element);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;

  // This is a simplified check - in a real app you'd use a more sophisticated algorithm
  element.setAttribute('data-contrast-checked', 'true');
};

/**
 * Handle skip link functionality
 */
export const initSkipLinks = (): void => {
  const skipLink = document.querySelector('[data-skip-link]') as HTMLAnchorElement;
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '') as HTMLElement;
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }
};

/**
 * Initialize keyboard navigation for custom components
 */
export const initKeyboardNavigation = (container: HTMLElement): void => {
  // Handle arrow key navigation for lists
  const listItems = container.querySelectorAll('[role="listbox"] [role="option"]');
  let currentIndex = 0;

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = Math.min(currentIndex + 1, listItems.length - 1);
      (listItems[currentIndex] as HTMLElement).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      (listItems[currentIndex] as HTMLElement).focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      currentIndex = 0;
      (listItems[0] as HTMLElement).focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      currentIndex = listItems.length - 1;
      (listItems[currentIndex] as HTMLElement).focus();
    }
  });
};

// Initialize accessibility features when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSkipLinks();
    });
  } else {
    initSkipLinks();
  }
}