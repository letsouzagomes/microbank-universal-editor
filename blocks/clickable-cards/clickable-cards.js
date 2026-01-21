import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js'; // Certifique-se que esta função está exportada em scripts.js

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // moveInstrumentation deve ser chamado aqui se a 'row' inteira for movida
    // Mas no nosso caso, vamos mover os filhos da 'row'.
    // O ideal é transferir a instrumentação dos elementos originais para os novos wrappers.

    // Elementos Originais (que contêm os dados de instrumentação do UE)
    const pic = row.querySelector('picture');
    const title = row.querySelector('h1, h2, h3, h4, h5, h6') || row.querySelector('p > strong');
    const textElements = row.querySelectorAll('p:not(:has(picture)):not(:has(a))');
    const link = row.querySelector('a');

    // 1. Link Wrapper (O Card)
    const cardLink = document.createElement('a');
    cardLink.className = 'clickable-cards-link';
    if (link) {
      cardLink.href = link.href;
      cardLink.title = link.title || (title ? title.textContent : '');
      if (link.target) cardLink.target = link.target;
      // Transferimos a instrumentação do link original para o card wrapper
      moveInstrumentation(link, cardLink);
    } else {
      cardLink.href = '#';
    }

    // 2. Imagem
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'clickable-cards-image';
    if (pic) {
      const newPic = createOptimizedPicture(pic.querySelector('img').src, title ? title.textContent : '', false, [{ width: '750' }]);
      // Mantemos a instrumentação visual na imagem
      moveInstrumentation(pic, newPic);
      imgWrapper.append(newPic);
    }

    // 3. Conteúdo (Body)
    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'clickable-cards-body';

    // Título
    if (title) {
      const h3 = document.createElement('h3');
      h3.innerHTML = title.innerHTML;
      // A instrumentação garante que o autor consiga clicar no título para editar
      moveInstrumentation(title, h3);
      bodyWrapper.append(h3);
    }

    // Descrição
    if (textElements.length > 0) {
      const descDiv = document.createElement('div');
      descDiv.className = 'clickable-cards-description';

      textElements.forEach((p) => {
        // Clonamos o parágrafo para manter atributos, mas movemos a instrumentação
        const newP = p.cloneNode(true);
        moveInstrumentation(p, newP);
        descDiv.append(newP);
      });
      bodyWrapper.append(descDiv);
    }

    // Seta (Elemento decorativo, não precisa de instrumentação)
    const arrowIcon = document.createElement('div');
    arrowIcon.className = 'clickable-cards-arrow';
    arrowIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    bodyWrapper.append(arrowIcon);

    // Montagem
    cardLink.append(imgWrapper, bodyWrapper);
    li.append(cardLink);

    // Transferir instrumentação da linha original para o LI
    moveInstrumentation(row, li);

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
