/**
 * Application-wide constants
 * Replace magic numbers with meaningful constant names
 */

// Password hashing constants
export const PASSWORD_SALT_ROUNDS = 10;

// Token validation constants
export const MIN_TOKEN_LENGTH = 10;

// Database column length constants
export const COLUMN_LENGTHS = {
  CATEGORY_NAME: 100,
  CATEGORY_COLOR: 7, // Hex color format (#RRGGBB)
  FILENAME: 255,
  ORIGINAL_NAME: 255,
  MIMETYPE: 100,
  USER_NAME: 100,
} as const;

// Validation constants
export const VALIDATION_CONSTRAINTS = {
  COURSE_TITLE_MIN_LENGTH: 2,
  COURSE_DESCRIPTION_MIN_LENGTH: 10,
  LESSON_RESOURCE_TITLE_MAX_LENGTH: 255,
  LESSON_RESOURCE_DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// Progress calculation constants
export const PERCENTAGE_MULTIPLIER = 100;

// Quiz constants
export const QUIZ_PASSING_THRESHOLD = 70; // 70% passing threshold

// File size constants (in bytes)
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE_20MB: 20 * 1024 * 1024, // 20MB
} as const;

// Performance testing constants
export const PERFORMANCE_THRESHOLDS = {
  LOG_OPERATIONS_ITERATIONS: 1000,
  MAX_LOG_DURATION_MS: 100,
  COMPLEX_OBJECT_ITERATIONS: 100,
  MAX_COMPLEX_OBJECT_DURATION_MS: 50,
  CONCURRENT_OPERATIONS_COUNT: 50,
  MAX_CONCURRENT_DURATION_MS: 100,
  LOGGER_INSTANCES_COUNT: 100,
  ERROR_LOGGING_ITERATIONS: 100,
  MAX_ERROR_LOGGING_DURATION_MS: 50,
  RANDOM_DELAY_MAX_MS: 10,
  RESPONSE_TIME_THRESHOLD_MS: 50,
} as const;

// HTTP status codes
export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Network constants
export const NETWORK = {
  DEFAULT_DB_PORT: 1433,
  LOCAL_IP: '127.0.0.1',
  TEST_IP: '192.168.1.100',
} as const;

// Test data constants
export const TEST_DATA = {
  TOTAL_COURSES: 25,
  QUIZ_TOTAL_QUESTIONS: 10,
  PERFORMANCE_THRESHOLD: 90,
  RESPONSE_TIME_150MS: 150,
  ARRAY_SIZE_100: 100,
  SEPARATOR_LENGTH: 50,
} as const;

// Database radix for parsing
export const DATABASE_PORT_RADIX = 10;
