import '../styles/global.scss';
import '../styles/global.css';

import { App } from './App';

const app = new App();

document.addEventListener('DOMContentLoaded', async () => {
  await app.setupApp();
  const rootElement = document.getElementById('root')!;
  rootElement.appendChild(await app.render());
});
