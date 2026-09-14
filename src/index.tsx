import { createRoot } from 'react-dom/client';
import createRouter from './router';
import { RouterProvider } from 'react-router-dom';
import './styles/global.less';

const rootElement = document.getElementById('so-chart');
if (!rootElement) {
  throw new Error('Missing #so-chart root element');
}

createRoot(rootElement).render(<RouterProvider router={createRouter()} useTransitions={false} />);
