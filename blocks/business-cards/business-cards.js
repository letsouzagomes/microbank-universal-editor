import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const picture = row.querySelector('picture');
    const title = row.querySelector('div:nth-of-type(2)');
    const description = row.querySelector('div:nth-of-type(3)');
    const link = row.querySelector('a');

    if (!link) return;
    link.textContent = '';
    link.classList.remove('button');
    link.classList.add('business-cards__link');
    li.append(link);

    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'business-cards__image';
      imgWrap.append(picture);
      link.append(imgWrap);
    }

    if (title) {
      title.className = 'business-cards__title';
      link.append(title);
    }

    if (description) {
      description.className = 'business-cards__description';
      link.append(description);
    }

    ul.append(li);
  });

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
