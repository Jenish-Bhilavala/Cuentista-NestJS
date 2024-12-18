export enum Messages {
  //Error Messages.
  NOT_FOUND = 'not found.',
  FILES_NOT_SELECTED = 'No files selected.',
  ALREADY_EXIST = 'already exist.',
  UPDATE_FAILED = 'Your password is not update.',
  STATUS_NOT_UPDATED = 'Your status is not updated.',
  NOT_UPDATED = 'not updated.',
  MAX_FILE = 'Total number of files should be 4 or less.',
  INQUIRY_ALREADY_RESOLVE = 'The inquiry has already been resolved.',

  // Success Messages.
  ADD_SUCCESS = 'added successfully.',
  UPDATE_SUCCESS = 'updated successfully.',
  DELETED_SUCCESS = 'deleted successfully.',
  GET_SUCCESS = 'getting successfully.',
  SEND_SUCCESS = 'send successfully.',
  RETRIEVED_SUCCESS = 'retrieved successfully.',

  // login
  CREDENTIAL_NOT_MATCH = `Credentials does not match.`,
  LOGIN_SUCCESS = 'You are login successfully.',
  EMAIL_INCORRECT = 'Your email is not registered.',
  OTP_EXPIRED = 'Your OTP is expired.',
  PASSWORD_MUST_BE_SAME = 'New password and confirm password must be same.',
  OTP_NOT_MATCH = 'Please enter correct otp.',
}
