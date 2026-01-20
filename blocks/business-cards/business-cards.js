export default function decorate(block) {
  const cards = [...block.children];

  const ul = document.createElement('ul');
  ul.className = 'business-cards__list';

  cards.forEach((card) => {
    const li = document.createElement('li');
    li.className = 'business-cards__item';

    const picture = card.querySelector('picture');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const link = card.querySelector('a');

    if (link) {
      link.className = 'business-cards__link';
      link.append(picture, title, description);
      li.append(link);
    }

    ul.append(li);
  });

  block.innerHTML = '';
  block.append(ul);
}
