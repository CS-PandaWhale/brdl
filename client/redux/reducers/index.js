import { combineReducers } from 'redux';

import navigationReducer from './navigationReducer';
import textFieldReducer from './textFieldReducer';
import responsesReducer from './responsesReducer';
import messagesReducer from './messagesReducer';
import birdsReducer from './birdsReducer';
import namesReducer from './namesReducer';

const reducers = combineReducers({
  navigation: navigationReducer,
  textField: textFieldReducer,
  responses: responsesReducer,
  messages: messagesReducer,
  birds: birdsReducer,
  names: namesReducer,
});

export default reducers;
