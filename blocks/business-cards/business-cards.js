import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'business-cards__list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'business-cards__item';

    // Preserve UE instrumentation on the row
    moveInstrumentation(row, li);

    const picture = row.querySelector('picture');
    const title = row.children[1];
    const description = row.children[2];
    const linkWrapper = row.children[3];
    const link = linkWrapper?.querySelector('a');

    if (!link) return;

    // Prepare link as full-card wrapper
    link.textContent = '';
    link.classList.remove('button');
    link.classList.add('business-cards__link');

    li.append(link);

    // Image
    if (picture) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'business-cards__image';
      imageWrap.append(picture);
      link.append(imageWrap);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'business-cards__content';

    if (title) {
      title.className = 'business-cards__title';
      content.append(title);
    }

    if (description) {
      description.className = 'business-cards__description';
      content.append(description);
    }

    link.append(content);
    ul.append(li);
  });

  // Optimize images without breaking UE
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
