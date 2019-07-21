import statusCodes from '../constants/statusCodes';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description Status 설정
 * @param       {*} statusCode 
 * @param       {*} params 
 */
const toResponse = (statusCode, params = {}) => {
    const { code = null, data = null, message = null } = params;

    if (statusCode < 400) {
        return {
            status: 'Success',
            data,
            message
        };
    } else {
        return {
            status: statusCode < 500 ? 'Fail' : 'Error',
            code,
            data,
            message
        };
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 응답 객체 설정
 */
class Response {
    static get STATUS_CODES() {
        return statusCodes;
    }

    static success(ctx, params = {}) {
        if (ctx.status >= 400) {
            ctx.status = this.STATUS_CODES.OK;
        }
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static fail(ctx, params = {}) {
        if (ctx.status < 400 || ctx.status >= 500) {
            ctx.status = this.STATUS_CODES.BAD_REQUEST;
        }
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static error(ctx, params = {}) {
        if (ctx.status < 500) {
            ctx.status = this.STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static ok(ctx, params = {}) {
        ctx.status = this.STATUS_CODES.OK;
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static badRequest(ctx, params = {}) {
        ctx.status = this.STATUS_CODES.BAD_REQUEST;
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static notFond(ctx, params = {}) {
        ctx.status = this.STATUS_CODES.NOT_FOUND;
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }

    static internalServerError(ctx, params = {}) {
        ctx.status = this.STATUS_CODES.INTERNAL_SERVER_ERROR;
        ctx.body = toResponse(ctx.status, params);
        return ctx.body;
    }
}

export default Response;