import '../../styles/global.scss';
import '../../styles/global.css';

// @ts-ignore
document.getElementById('back-to-top').addEventListener('click', () => {
  // animate this scrolling
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// take the element cookie-buttom and add an event listener to it, update its counter value
const cookieButton = document.getElementById(
  'cookie-button'
) as HTMLButtonElement;
let counter = 0;

cookieButton.addEventListener('click', () => {
  counter++;
  cookieButton.innerText = `🍪 Counter: ${counter}`;
});
