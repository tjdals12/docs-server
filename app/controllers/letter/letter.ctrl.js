import Letter from 'models/letter/letter';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식문서 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        const letters = await Letter
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await Letter.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: letters,
            message: 'Success - letterCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: `Error - letterCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식문서 추가
 */
export const add = async (ctx) => {
    let {
        letterGb,
        reference,
        letterTitle,
        senderGb,
        sender,
        receiverGb,
        receiver,
        sendDate,
        replyRequired,
        targetDate,
        memo
    } = ctx.request.body;

    const schema = Joi.object().keys({
        letterGb: Joi.string().required(),
        reference: Joi.string().optional(),
        letterTitle: Joi.string().required(),
        senderGb: Joi.string().required(),
        sender: Joi.string().required(),
        receiverGb: Joi.string().required(),
        receiver: Joi.string().required(),
        sendDate: Joi.string().optional(),
        replyRequired: Joi.string().required(),
        targetDate: Joi.string().optional(),
        memo: Joi.string().optional()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - letterCtrl > add'
        });

        return;
    }

    try {
        const letter = await Letter.saveLetter({
            letterGb,
            reference,
            letterTitle,
            senderGb,
            sender,
            receiverGb,
            receiver,
            sendDate,
            replyRequired,
            targetDate,
            memo
        });

        ctx.res.ok({
            data: letter,
            message: 'Success - letterCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > add: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식문서 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const letter = await Letter.findOne({ _id: id });

        ctx.res.ok({
            data: letter,
            message: 'Success - letterCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - letterCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 18
 * @description 공식문서 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;
    let {
        letterGb,
        letterTitle,
        senderGb,
        sender,
        receiverGb,
        receiver,
        sendDate,
        replyRequired,
        targetDate,
        memo
    } = ctx.request.body;

    const schema = Joi.object().keys({
        letterGb: Joi.string().required(),
        letterTitle: Joi.string().required(),
        senderGb: Joi.string().required(),
        sender: Joi.string().required(),
        receiverGb: Joi.string().required(),
        receiver: Joi.string().required(),
        sendDate: Joi.string().required(),
        replyRequired: Joi.string().required(),
        targetDate: Joi.string().optional(),
        memo: Joi.string().optional()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - letterCtrl > edit'
        });

        return;
    }

    try {
        const letter = await Letter.editLetter({
            id,
            letterGb,
            letterTitle,
            senderGb,
            sender,
            receiverGb,
            receiver,
            sendDate,
            replyRequired,
            targetDate,
            memo
        });

        ctx.res.ok({
            data: letter,
            message: 'Success - letterCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > edit: ${e.message}`
        });
    }
};