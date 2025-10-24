import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Error types
export const ERROR_TYPES = {
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error actions
const ERROR_ACTIONS = {
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_GLOBAL_ERROR: 'SET_GLOBAL_ERROR',
  CLEAR_GLOBAL_ERROR: 'CLEAR_GLOBAL_ERROR'
};

// Initial state
const initialState = {
  errors: [],
  globalError: null,
  isOnline: navigator.onLine
};

// Error reducer
const errorReducer = (state, action) => {
  switch (action.type) {
    case ERROR_ACTIONS.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, { ...action.payload, id: Date.now() }]
      };
    
    case ERROR_ACTIONS.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };
    
    case ERROR_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };
    
    case ERROR_ACTIONS.SET_GLOBAL_ERROR:
      return {
        ...state,
        globalError: action.payload
      };
    
    case ERROR_ACTIONS.CLEAR_GLOBAL_ERROR:
      return {
        ...state,
        globalError: null
      };
    
    default:
      return state;
  }
};

// Create context
const ErrorContext = createContext();

// Error provider component
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Add error
  const addError = useCallback((error, type = ERROR_TYPES.UNKNOWN_ERROR, options = {}) => {
    const errorObj = {
      message: typeof error === 'string' ? error : error.message,
      type,
      timestamp: new Date().toISOString(),
      status: error.status,
      code: error.code,
      operation: error.operation,
      context: error.context,
      ...options
    };

    dispatch({ type: ERROR_ACTIONS.ADD_ERROR, payload: errorObj });

    // Auto-remove error after specified duration
    if (options.autoRemove !== false) {
      setTimeout(() => {
        removeError(errorObj.id);
      }, options.duration || 5000);
    }

    return errorObj.id;
  }, []);

  // Remove error
  const removeError = useCallback((errorId) => {
    dispatch({ type: ERROR_ACTIONS.REMOVE_ERROR, payload: errorId });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_ERRORS });
  }, []);

  // Set global error (for critical errors that should block the UI)
  const setGlobalError = useCallback((error, options = {}) => {
    const errorObj = {
      message: typeof error === 'string' ? error : error.message,
      type: ERROR_TYPES.API_ERROR,
      timestamp: new Date().toISOString(),
      status: error.status,
      code: error.code,
      operation: error.operation,
      context: error.context,
      ...options
    };

    dispatch({ type: ERROR_ACTIONS.SET_GLOBAL_ERROR, payload: errorObj });
  }, []);

  // Clear global error
  const clearGlobalError = useCallback(() => {
    dispatch({ type: ERROR_ACTIONS.CLEAR_GLOBAL_ERROR });
  }, []);

  // Handle API errors specifically
  const handleApiError = useCallback((error, operation = 'API call') => {
    console.error(`API Error in ${operation}:`, error);

    // Determine error type
    let errorType = ERROR_TYPES.API_ERROR;
    if (error.status === 0 || error.code === 'NETWORK_ERROR') {
      errorType = ERROR_TYPES.NETWORK_ERROR;
    } else if (error.status === 401 || error.status === 403) {
      errorType = ERROR_TYPES.AUTH_ERROR;
    }

    // For critical network errors, show global error
    if (errorType === ERROR_TYPES.NETWORK_ERROR) {
      setGlobalError(error, { 
        type: errorType, 
        operation,
        canRetry: true 
      });
    } else {
      // For other errors, show toast notification
      addError(error, errorType, { 
        operation,
        canRetry: errorType === ERROR_TYPES.API_ERROR && error.status >= 500
      });
    }
  }, [addError, setGlobalError]);

  // Check if there are network errors
  const hasNetworkError = useCallback(() => {
    return state.errors.some(error => error.type === ERROR_TYPES.NETWORK_ERROR) ||
           (state.globalError && state.globalError.type === ERROR_TYPES.NETWORK_ERROR);
  }, [state.errors, state.globalError]);

  // Get errors by type
  const getErrorsByType = useCallback((type) => {
    return state.errors.filter(error => error.type === type);
  }, [state.errors]);

  const value = {
    // State
    errors: state.errors,
    globalError: state.globalError,
    isOnline: state.isOnline,
    
    // Actions
    addError,
    removeError,
    clearErrors,
    setGlobalError,
    clearGlobalError,
    handleApiError,
    
    // Utilities
    hasNetworkError,
    getErrorsByType,
    
    // Constants
    ERROR_TYPES
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorContext;