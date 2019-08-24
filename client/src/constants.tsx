//@ts-ignore
export const REQUEST_ERROR = error => ({
  data: {
    error: {
      __typename: 'error',
      text: error.message,
      open: true
    }
  }
});

export const COMPLETE_ERROR = {
  data: {
    error: {
      __typename: 'error',
      text: 'Произошла ошибка',
      open: true
    }
  }
};
