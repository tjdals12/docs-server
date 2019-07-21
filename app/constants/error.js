/**
 * Client Failure
 */
export const BAD_REQUEST = {
    statusCode: 400,
    code: 'BAD_REQUEST',
    message: '잘못된 매개변수'
};

export const AUTH_REQUIRED = {
    statusCode: 401,
    code: 'AUTH_REQUIRED',
    message: '인증이 필요함'
};

export const UNKNOWN_ENDPOINT = {
    statusCode: 404,
    code: 'UNKNOWN_ENDPOINT',
    message: '유효하지 않은 엔드포인트'
};

export const DISALLOWED_METHOD = {
    statusCode: 405,
    code: 'DISALLOWED_METHOD',
    message: '잘못된 접근방식'
};

/**
 * Server Failure
 */
export const INTENAL_ERROR = {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: '서버 에러'
};

export const UNKNOWN_ERROR = {
    statusCode: 520,
    code: 'UNKNOWN_ERROR',
    message: '알 수 없는 오류'
};