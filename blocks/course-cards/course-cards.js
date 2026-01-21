import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create the list wrapper that will replace the block content
  const ul = document.createElement('ul');
  ul.className = 'course-cards__list';

  // Iterate over original block children (required for UE item handling)
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'course-cards__item';

    // Preserve Universal Editor instrumentation
    moveInstrumentation(row, li);

    // Extract expected fields from the row structure
    const picture = row.querySelector('picture');
    const title = row.querySelector('h3, h4');
    const description = row.querySelector('p');
    const link = row.querySelector('a');

    // If no link is present, the item is invalid
    if (!link) return;

    // Prepare link as the clickable card wrapper
    link.textContent = '';
    link.classList.remove('button');
    link.classList.add('course-cards__link');
    li.append(link);

    // Image wrapper
    if (picture) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'course-cards__image';
      imageWrapper.append(picture);
      link.append(imageWrapper);
    }

    // Title
    if (title) {
      title.className = 'course-cards__title';
      link.append(title);
    }

    // Description
    if (description) {
      description.className = 'course-cards__description';
      link.append(description);
    }

    ul.append(li);
  });

  // Optimize images after DOM restructuring
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '800' }],
    );

    // Preserve UE instrumentation on optimized image
    moveInstrumentation(img, optimizedPicture.querySelector('img'));

    img.closest('picture').replaceWith(optimizedPicture);
  });

  // Replace original block content with final rendered structure
  block.replaceChildren(ul);
}
