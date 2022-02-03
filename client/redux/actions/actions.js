import { user } from 'pg/lib/defaults';
import * as types from '../constants/actionTypes.js';

export const changePageActionCreator = pl => ({
  type: types.CHANGE_PAGE,
  payload: pl,
});

export const changeToLoginPageActionCreator = () => ({
  type: types.LOGIN,
});

export const changeToSignUpPageActionCreator = () => ({
  type: types.SIGN_UP,
});

export const changeToCommunityPageActionCreator = () => ({
  type: types.COMMUNITY,
});

export const changeToProfilePageActionCreator = () => ({
  type: types.PROFILE,
});

export const usernameChangeActionCreator = e => ({
  type: types.USERNAME_CHANGE,
  payload: e,
});

export const passwordChangeActionCreator = e => ({
  type: types.PASSWORD_CHANGE,
  payload: e,
});

export const fullNameChangeActionCreator = e => ({
  type: types.FULL_NAME_CHANGE,
  payload: e,
});

export const resetFieldsActionCreator = () => ({
  type: types.RESET_FIELDS,
});

export const createAccountSubmitActionCreator = (e, mode, serverRes) => ({
  type: types.CREATE_ACCOUNT_SUBMIT,
  payload: { e, mode, serverRes },
});

export const loginSubmitActionCreator = (e, mode, serverRes) => ({
  type: types.LOGIN_SUBMIT,
  payload: { e, mode, serverRes },
});

export const updateSeenBirdsActionCreator = pl => ({
  type: types.UPDATE_SEEN_BIRDS,
  payload: pl,
});

export const updateLocalBirdsActionCreator = pl => ({
  type: types.UPDATE_LOCAL_BIRDS,
  payload: pl,
});

export const updateFriendMessagesActionCreator = pl => ({
  type: types.UPDATE_FRIEND_MESSAGES,
  payload: pl,
});

export const updateCommunityMessagesActionCreator = pl => ({
  type: types.UPDATE_COMMUNITY_MESSAGES,
  payload: pl,
});

export const updateLocationActionCreator = pl => ({
  type: types.UPDATE_LOCATION,
  payload: pl,
});

export const getUsernameActionCreator = username => ({
  type: types.GET_USERNAME,
  payload: username,
});

export const getFullNameActionCreator = fullName => ({
  type: types.GET_FULL_NAME,
  payload: fullName,
});

// export default login;
