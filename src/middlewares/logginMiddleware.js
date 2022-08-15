// == Import
import {
  SUBMIT_SETTINGS_FORM,
  actionChangeSettings,
  actionUserConnected,
} from '../actions/settingsActions';
import { requestLogin } from '../requests/loginRequest';
import { selectEmail, selectPassword } from '../selectors/settingsSelectors';

const loginMiddleware = (store) => (next) => async (action) => {
  console.log('loginMiddleware');
  // to avoid to execute the request at each action,
  // we do a IF that checks the action of submitting the login form
  if (action.type === SUBMIT_SETTINGS_FORM) {
    // get the state
    const state = store.getState();
    // execute the requestLogin
    const response = await requestLogin(
      selectEmail(state),
      selectPassword(state),
    );
    console.log('response:', response);
    // then handle the response
    switch (response.status) {
      // if status code 200
      case 200: {
        store.dispatch(
          actionUserConnected(response.data.pseudo),
        );
        break;
      }
      // if status code 500
      case 500: {
        console.log('switch 500');
        break;
      }
      // if status code 401 and default
      case 401:
      default: {
        console.log('switch 401/default');
        break;
      }
    }
    // empty the password input
    store.dispatch(actionChangeSettings('password', ''));
    // we don't do next() for this action so the reducers are not called for this action
    // which is catched by the middleware
    return;
  }

  // if this is not the SUBMIT_SETTINGS_FORM action, just next()
  const result = next(action);
  return result;
};

export default loginMiddleware;