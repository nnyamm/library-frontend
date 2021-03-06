export const SET_PROMPT = 'SET_PROMPT';
export const UNSET_PROMPT = 'UNSET_PROMPT';

export const showPrompt = ({
  title,
  message,
  confirmLabel,
  placeHolder,
  initialValue,
  emptyInputAlertMessage,
  onClickConfirmButton,
  limit,
}) => ({
  type: SET_PROMPT,
  payload: {
    prompt: {
      title,
      message,
      confirmLabel,
      placeHolder,
      initialValue,
      emptyInputAlertMessage,
      onClickConfirmButton,
      limit,
    },
  },
});

export const closePrompt = () => ({
  type: UNSET_PROMPT,
});
