import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function appendWithClass(parent, wrapper, className) {
  wrapper.className = className;
  parent.append(wrapper);
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const picture = row.querySelector('picture');
    const titleWrapper = row.querySelector('.business-cards__title, div:nth-child(2)');
    const descriptionWrapper = row.querySelector('.business-cards__description, div:nth-child(3)');
    const link = row.querySelector('a');

    let contentRoot = li;

    if (link) {
      link.classList.add('business-cards__link');
      li.append(link);
      contentRoot = link;
    }

    if (picture) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'business-cards__image';
      imageWrapper.append(picture);
      contentRoot.append(imageWrapper);
    }

    if (titleWrapper) {
      appendWithClass(contentRoot, titleWrapper, 'business-cards__title');
    }

    if (descriptionWrapper) {
      appendWithClass(contentRoot, descriptionWrapper, 'business-cards__description');
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
