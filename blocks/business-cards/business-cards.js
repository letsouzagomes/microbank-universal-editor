import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create list wrapper
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Preserve Universal Editor instrumentation for the item
    moveInstrumentation(row, li);

    // Move original DOM nodes instead of recreating them
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Ensure the link is the main clickable wrapper
    const link = li.querySelector('a');
    if (link) {
      link.classList.remove('button');
      link.classList.add('business-cards__link');
    }

    // Assign structural classes expected by CSS
    [...li.children].forEach((child) => {
      // Image container
      if (child.querySelector('picture')) {
        child.classList.add('business-cards__image');
      }

      // Title container
      if (child.querySelector('p') && !child.querySelector('picture')) {
        child.classList.add('business-cards__title');
      }
    });

    ul.append(li);
  });

  // Optimize images while preserving instrumentation
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '800' }],
    );

    moveInstrumentation(img, optimizedPicture.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPicture);
  });

  // Replace block content with final structure
  block.replaceChildren(ul);
}
