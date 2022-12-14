// == Import : npm
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// == Import : local
// Composants
import App from 'src/containers/App';
import store from './store/store';

// == Render

const rootReactElement = (
  <Provider store={store}>
    <App />
  </Provider>
);
const target = document.getElementById('root');
render(rootReactElement, target);
