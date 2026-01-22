import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildTagsList(rawText) {
  const tags = (rawText || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const list = document.createElement('ul');
  list.className = 'course-card__tags';

  tags.forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = tag.toUpperCase();
    list.append(item);
  });

  return list;
}

export default function decorate(block) {
  if (block.dataset.decorated === 'true') return;
  block.dataset.decorated = 'true';

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
       Tags (structure: li > div:nth-child(3))
       Idempotent: do nothing if already converted
    ----------------------------- */
    const tagsDiv = li.querySelector(':scope > div:nth-child(3)');
    if (tagsDiv) {
      const alreadyConverted = tagsDiv.tagName === 'UL'
        || tagsDiv.classList.contains('course-card__tags')
        || li.querySelector(':scope > ul.course-card__tags');

      if (!alreadyConverted) {
        const tagsList = buildTagsList(tagsDiv.textContent);
        if (tagsList.children.length) {
          moveInstrumentation(tagsDiv, tagsList);
          tagsDiv.replaceWith(tagsList);
        }
      }
    }

    ul.append(li);
  });

  /* ----------------------------
     Optimize images (idempotent)
  ----------------------------- */
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    if (!picture || picture.dataset.optimized === 'true') return;

    const optimized = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '800' }],
    );

    const optimizedImg = optimized.querySelector('img');
    if (optimizedImg) moveInstrumentation(img, optimizedImg);

    optimized.dataset.optimized = 'true';
    picture.replaceWith(optimized);
  });

  /* ----------------------------
     Make card clickable (UE-safe, avoid double-binding)
  ----------------------------- */
  ul.querySelectorAll('.course-cards__item').forEach((card) => {
    const { href } = card.dataset;
    if (!href || card.dataset.clickBound === 'true') return;

    card.dataset.clickBound = 'true';
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
