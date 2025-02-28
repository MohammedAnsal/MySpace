export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const responseMessage = {
  SUCCESS_MESSAGE: "Operation completed successfully.",
  ERROR_MESSAGE: "An error has occurred. Please try again later.",
  LOGIN_REQUIRED: "You must be logged in to access this feature.",
  ACCESS_DENIED: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  INVALID_INPUT: "The input provided is invalid.",
  INVALID_REQUEST: "Invalid Request",
  TOKEN_ACCESS: "Token not valid , Access declained",
  UPLOAD_FAILED: "Failed to upload , Try later",
} as const;
