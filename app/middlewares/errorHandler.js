import { UNKNOWN_ENDPOINT, UNKNOWN_ERROR } from 'constants/error';
import Response from 'utils/response';

/**
 * @author      minz-logger
 * @date        2019. 07. 22
 * @description Error 처리 미들웨어
 */
const errorHandler = () => {
    return async (ctx, next) => {
        try {
            await next();

            if (!ctx.body && (!ctx.status || ctx.status === 404)) {
                return Response.notFond(ctx, UNKNOWN_ENDPOINT);
            }
        } catch (e) {
            return Response.internalServerError(ctx, UNKNOWN_ERROR);
        }
    };
};

export default errorHandler;