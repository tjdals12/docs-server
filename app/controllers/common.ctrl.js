import mongoose from 'mongoose';

/**
 * @author      minz-logger
 * @date        2019. 07. 22
 * @description ObjectId 검사 미들웨어
 */
export const checkObjectId = async (ctx, next) => {
    const id = ctx.params.id ? ctx.params.id : ctx.request.body.id;
    const { ObjectId } = mongoose.Types;

    if (!ObjectId.isValid(id)) {
        ctx.res.badRequest({
            data: id,
            message: 'Fail - Type error (id)'
        });

        return;
    }

    return next();
};