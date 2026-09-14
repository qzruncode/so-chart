import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorPage from './error-page';
import App from './app';
import DemoRoute from './demo/DemoRoute';
import { getFirstDemoPath } from './demo/registry';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to={getFirstDemoPath()} replace />,
      },
      {
        path: 'chart/:packageRoute/:sectionId?',
        element: <DemoRoute />,
      },
    ],
  },
];

const createRouter = () => {
  // 动态获取部署基础路径，支持任意部署位置
  const pathname = window.location.pathname;

  // 尝试找 /chart 路径
  const chartIndex = pathname.indexOf('/chart');
  if (chartIndex > 0) {
    // /xxx/chart/... -> basename = /xxx
    return createBrowserRouter(routes, { basename: pathname.substring(0, chartIndex) });
  }

  // 没有 /chart 时，去掉路径结尾的 / 作为 basename
  // 如果路径以 /chart 开头，说明是根路径部署，basename 为空
  let cleanPath = pathname;
  if (pathname.endsWith('/')) {
    cleanPath = pathname.slice(0, -1);
  }

  if (cleanPath.startsWith('/chart')) {
    return createBrowserRouter(routes);
  }

  return createBrowserRouter(routes, { basename: cleanPath });
};

export default createRouter;
