import '../../styles/global.scss';
import '../../styles/global.css';

document
  .getElementsByClassName('back-to-top')[0]
  .addEventListener('click', () => {
    window.scrollTo(0, 0);
  });
