import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {...state, errMess: null, comments: action.payload};

    case ActionTypes.COMMENTS_FAILED:
      return {...state, errMess: action.payload};

    case ActionTypes.POST_COMMENT:
      const comment = {
        id: state.comments.length,
        dishId: action.payload.dishId,
        rating: action.payload.rating,
        comment: action.payload.comment,
        author: action.payload.author,
        date: action.payload.date,
      };
      return { ...state, comments: state.comments.concat(comment) };

    default:
      return state;
  }
};