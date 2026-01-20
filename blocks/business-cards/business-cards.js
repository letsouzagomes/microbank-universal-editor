import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const rememberAppend = (parent, el, className) => {
  el.parentElement.className = className;
  parent.append(el.parentElement);
};

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const image = row.querySelector('picture');
    const title = row.querySelector('.text p') || row.querySelector('div:nth-child(2) p');
    const description = row.querySelector('div:nth-child(3) p');
    const link = row.querySelector('a');

    if (link) {
      link.classList.add('business-cards__link');
      li.append(link);
    }

    if (image) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'business-cards__image';
      imgWrap.append(image);

      if (link) {
        link.append(imgWrap);
      } else {
        li.append(imgWrap);
      }
    }

    if (title) {
      rememberAppend(link || li, title, 'business-cards__title');
    }

    if (description) {
      rememberAppend(link || li, description, 'business-cards__description');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
