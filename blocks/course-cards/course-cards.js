import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 6) return;

    const [
      imageCell,
      logoCell,
      titleCell,
      tagsCell,
      ctaCell,
      linkCell,
    ] = cells;

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = linkCell.textContent.trim();

    /* image */
    const media = document.createElement('div');
    media.className = 'course-card__media';

    const img = imageCell.querySelector('img');
    if (img) {
      media.append(
        createOptimizedPicture(img.src, img.alt || '', false, [
          { width: '750' },
        ]),
      );
    }

    /* logo */
    const logo = document.createElement('span');
    logo.className = 'course-card__logo';
    logo.textContent = logoCell.textContent.trim();
    media.append(logo);

    /* content */
    const content = document.createElement('div');
    content.className = 'course-card__content';

    const title = document.createElement('h3');
    title.textContent = titleCell.textContent.trim();

    const tags = document.createElement('ul');
    tags.className = 'course-card__tags';
    tagsCell.textContent
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((tag) => {
        const li = document.createElement('li');
        li.textContent = tag;
        tags.append(li);
      });

    const cta = document.createElement('span');
    cta.className = 'course-card__cta';
    cta.innerHTML = `${ctaCell.textContent.trim()} <span class="arrow">→</span>`;

    content.append(title, tags, cta);
    link.append(media, content);
    li.append(link);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
