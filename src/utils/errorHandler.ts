/**
 * Extracts error message from API response
 * @param error - The error object from API call
 * @param fallbackMessage - Default message if specific error cannot be extracted
 * @returns Formatted error message
 */
export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  // Handle Axios errors (most common case)
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: unknown;
        status?: number;
      };
    };

    // Check if response has error data
    if (
      axiosError.response?.data &&
      typeof axiosError.response.data === "object"
    ) {
      const responseData = axiosError.response.data as {
        message?: string;
        error?: string;
        errors?: string[];
      };

      // Extract message from common API response formats
      if (responseData.message && typeof responseData.message === "string") {
        return responseData.message;
      }

      // Handle array of error messages
      if (responseData.errors && Array.isArray(responseData.errors)) {
        return responseData.errors.join(", ");
      }

      // Handle error details
      if (responseData.error && typeof responseData.error === "string") {
        return responseData.error;
      }
    }

    // Handle HTTP status specific messages
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return "Invalid request. Please check your input and try again.";
        case 401:
          return "You are not authorized. Please log in and try again.";
        case 403:
          return "You do not have permission to perform this action.";
        case 404:
          return "The requested resource was not found.";
        case 409:
          return "This operation conflicts with existing data.";
        case 422:
          return "The provided data is invalid.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return fallbackMessage;
      }
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Return fallback message for unknown error types
  return fallbackMessage;
};

/**
 * Formats error messages for better user experience
 * @param message - Raw error message
 * @returns Formatted error message
 */
export const formatErrorMessage = (message: string): string => {
  // Capitalize first letter
  const formatted = message.charAt(0).toUpperCase() + message.slice(1);

  // Ensure message ends with period if it doesn't already
  if (
    !formatted.endsWith(".") &&
    !formatted.endsWith("!") &&
    !formatted.endsWith("?")
  ) {
    return formatted + ".";
  }

  return formatted;
};

/**
 * Complete error handler that combines extraction and formatting
 * @param error - The error object
 * @param fallbackMessage - Default message if specific error cannot be extracted
 * @returns Formatted, user-friendly error message
 */
export const handleApiError = (
  error: unknown,
  fallbackMessage: string,
): string => {
  const message = getApiErrorMessage(error, fallbackMessage);
  return formatErrorMessage(message);
};
