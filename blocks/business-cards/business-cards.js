import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const [image, title, description, link] = [...row.children];

    if (image) {
      image.className = 'business-cards__image';
    }

    if (title) {
      title.className = 'business-cards__title';
    }

    if (description) {
      description.className = 'business-cards__description';
    }

    if (link) {
      link.className = 'business-cards__link';
    }

    // move children into li
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    ul.append(li);
  });

  // optimize images
  ul.querySelectorAll('.business-cards__image picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '800' }],
    );
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
