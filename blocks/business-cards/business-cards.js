import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'business-cards__item';

    moveInstrumentation(row, li);

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Find the first link (author-defined)
    const link = li.querySelector('a');
    if (link) {
      li.dataset.href = link.href;
      link.dataset.cardLink = 'true';
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  // Make card clickable (UE-safe)
  ul.querySelectorAll('.business-cards__item').forEach((card) => {
    const { href } = card.dataset;
    if (!href) return;

    card.addEventListener('click', (e) => {
      // Allow UE interactions
      if (e.target.closest('[contenteditable="true"], a')) return;
      window.location.href = href;
    });

    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.location.href = href;
      }
    });
  });

  block.replaceChildren(ul);
}
