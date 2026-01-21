import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Preserve Universal Editor instrumentation on the list item
    moveInstrumentation(row, li);

    // The expected EDS row structure:
    // 1) picture
    // 2) title (div)
    // 3) description (div)
    // 4) link (div containing <a>)
    const cells = [...row.children];

    const imageCell = cells[0];
    const titleCell = cells[1];
    const descriptionCell = cells[2];
    const linkCell = cells[3];

    const link = linkCell ? linkCell.querySelector('a') : null;
    if (!link) return;

    // Make the link the full-card wrapper
    link.classList.remove('button');
    link.classList.add('business-cards__link');

    // Remove any default container styles that may come from "button-container"
    const linkParentP = link.closest('p');
    if (linkParentP) linkParentP.classList.remove('button-container');

    // Clear visible URL text (you don't want "http://..." printed on the card)
    // Keep the href intact.
    link.textContent = '';

    // Prepare / class the content cells and move them inside the link
    if (imageCell) {
      imageCell.className = 'business-cards__image';
      link.append(imageCell);
    }

    if (titleCell) {
      titleCell.className = 'business-cards__title';
      link.append(titleCell);
    }

    if (descriptionCell) {
      descriptionCell.className = 'business-cards__description';
      link.append(descriptionCell);
    }

    // Append the link as the ONLY direct child of <li> (required by your CSS selector)
    li.append(link);

    // Add the <li> to the list
    ul.append(li);
  });

  // Optimize images after restructuring while preserving instrumentation
  ul.querySelectorAll('picture > img').forEach((img) => {
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
