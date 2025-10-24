import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API errors with proper UI feedback
 */
export const useApiError = () => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((error, context = '') => {
    console.error(`API Error ${context}:`, error);
    
    // Enhance error with additional context
    const enhancedError = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    setError(enhancedError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const retry = useCallback(async (retryFunction) => {
    if (!retryFunction) return;

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      await retryFunction();
      clearError();
    } catch (error) {
      handleError(error, 'retry');
    } finally {
      setIsRetrying(false);
    }
  }, [handleError, clearError]);

  const isNetworkError = useCallback((error) => {
    return (
      error?.status === 0 ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('fetch') ||
      error?.message?.includes('network') ||
      !navigator.onLine
    );
  }, []);

  const isServerError = useCallback((error) => {
    return error?.status >= 500 && error?.status < 600;
  }, []);

  const isClientError = useCallback((error) => {
    return error?.status >= 400 && error?.status < 500;
  }, []);

  const getErrorType = useCallback((error) => {
    if (isNetworkError(error)) return 'network';
    if (isServerError(error)) return 'server';
    if (isClientError(error)) return 'client';
    return 'unknown';
  }, [isNetworkError, isServerError, isClientError]);

  const getErrorMessage = useCallback((error) => {
    if (!error) return '';

    const errorType = getErrorType(error);
    
    switch (errorType) {
      case 'network':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'server':
        return 'Our servers are experiencing issues. Please try again in a few moments.';
      case 'client':
        if (error.status === 401) return 'Please log in to continue.';
        if (error.status === 403) return 'You don\'t have permission to access this resource.';
        if (error.status === 404) return 'The requested resource was not found.';
        return 'There was an issue with your request. Please try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }, [getErrorType]);

  const shouldShowRetry = useCallback((error) => {
    const errorType = getErrorType(error);
    return errorType === 'network' || errorType === 'server';
  }, [getErrorType]);

  return {
    error,
    isRetrying,
    retryCount,
    handleError,
    clearError,
    retry,
    isNetworkError,
    isServerError,
    isClientError,
    getErrorType,
    getErrorMessage,
    shouldShowRetry
  };
};

/**
 * Higher-order function to wrap API calls with error handling
 */
export const withErrorHandling = (apiCall, errorHandler) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      }
      throw error;
    }
  };
};

/**
 * Utility function to create standardized API errors
 */
export const createApiError = (status, message, code = null, data = null) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.data = data;
  return error;
};

export default useApiError;