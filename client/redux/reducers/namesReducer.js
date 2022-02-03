import * as types from '../constants/actionTypes';

const initialState = {
  username: '',
  // password: '',
  fullName: '',
  // message: '',
  // response: { valid: false },
  // validUser: undefined,
  // validLogin: undefined,
//   lat: '',
//   long: '',
};

const namesReducer = (state = initialState, action) => {
  //get data
  switch (action.type) {
    case types.GET_USERNAME:
      const newUserName = action.payload;
      return {
        ...state,
        username: newUserName,
    };

    case types.GET_FULL_NAME:
      const newFullName = action.payload;
      return {
        ...state,
        fullName: newFullName,
    };

    default:
      return state;
  }
  
}

export default namesReducer;