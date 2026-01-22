export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';

  const title = block.querySelector('h1,h2,h3,h4,h5,h6');
  const link = block.querySelector('a');
  const textDiv = block.querySelector(':scope > div:last-child > div');

  if (!title || !link || !textDiv) return;

  const label = textDiv.textContent.trim();

  if (!label) {
    block.replaceChildren(title);
    return;
  }

  // Set link text
  link.textContent = label;

  // Normalize DOM: title + link only
  block.replaceChildren(title, link);
}
