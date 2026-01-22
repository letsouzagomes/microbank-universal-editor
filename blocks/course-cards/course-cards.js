import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'course-cards__list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'course-cards__item';

    // Preserve UE instrumentation
    moveInstrumentation(row, li);

    // Move original DOM nodes
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    /* ----------------------------
       Promote link to card
    ----------------------------- */
    const link = li.querySelector('a');
    if (link) {
      li.dataset.href = link.href;
      link.dataset.cardLink = 'true';
    }

    /* ----------------------------
       Split comma-separated tags
       (div:last-child p:nth-child(3))
    ----------------------------- */
    const tagsParagraph = li.querySelector(
      'div:last-child p:nth-child(3)',
    );

    if (tagsParagraph) {
      const tags = tagsParagraph.textContent
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length) {
        const tagsList = document.createElement('ul');
        tagsList.className = 'course-card__tags';

        tags.forEach((tag) => {
          const tagItem = document.createElement('li');
          tagItem.textContent = tag.toUpperCase();
          tagsList.append(tagItem);
        });

        moveInstrumentation(tagsParagraph, tagsList);
        tagsParagraph.replaceWith(tagsList);
      }
    }

    ul.append(li);
  });

  /* ----------------------------
     Optimize images
  ----------------------------- */
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

  /* ----------------------------
     Make card clickable (UE-safe)
  ----------------------------- */
  ul.querySelectorAll('.course-cards__item').forEach((card) => {
    const { href } = card.dataset;
    if (!href) return;

    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.location.href = href;
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.location.href = href;
      }
    });
  });

  block.replaceChildren(ul);
}
