export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';

  const title = block.querySelector('h1,h2,h3,h4,h5,h6');
  const link = block.querySelector('a');
  const text = block.querySelector('div:last-child p');

  if (!title || !link || !text) return;

  const label = text.textContent.trim();
  const href = link.getAttribute('href');

  // Only render link if both fields exist
  if (!label || !href || href === '#') {
    link.closest('div').remove();
    text.closest('div').remove();
    return;
  }

  // Set link label
  link.textContent = label;

  // Normalize DOM: title + link only
  block.replaceChildren(title, link);
}
