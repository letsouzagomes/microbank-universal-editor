import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create list wrapper
  const ul = document.createElement('ul');
  ul.className = 'course-cards__list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'course-cards__item';

    // Preserve Universal Editor instrumentation
    moveInstrumentation(row, li);

    // Move original DOM nodes instead of recreating them
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    ul.append(li);
  });

  // Optimize images while keeping instrumentation
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
