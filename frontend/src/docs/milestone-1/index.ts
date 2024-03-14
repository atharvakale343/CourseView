import '../../styles/global.scss';
import '../../styles/global.css';

document
  .getElementsByClassName('back-to-top')[0]
  .addEventListener('click', () => {
    // animate this scrolling
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
