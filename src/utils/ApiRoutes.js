export const HOST = "http://localhost:9001";

const authRoute = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;
const RESUMES_ROUTE = `${HOST}/api/resume`;

export const onBoardUserRoute = `${authRoute}/onboarduser`;
export const CHECK_USER_ROUTE = `${authRoute}/check-user`;
export const GET_ALL_CONTACTS = `${authRoute}/get-contacts`;
export const GET_CALL_TOKEN = `${authRoute}/generate-token`;
export const onRegisterUserRoute = `${authRoute}/register`;
export const UPDATE_USER_PROFILE = `${authRoute}/update-profile`;
export const GET_USER_INFO = `${authRoute}/user-info`;
export const UPLOAD_RESUME_ROUTE = `${RESUMES_ROUTE}/upload`;
export const DOWNLOAD_RESUME_ROUTE = `${RESUMES_ROUTE}/download`;

export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
export const ASK_GEMINI_ROUTE = `${MESSAGES_ROUTE}/ask-gemini`;
