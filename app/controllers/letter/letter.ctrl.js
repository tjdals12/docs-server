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
            .sort({ officialNumber: -1 });

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
 * @date        2019. 09. 20
 * @description 공식문서 검색
 */
export const search = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    let {
        senderGb,
        sender,
        receiverGb,
        receiver,
        letterGb,
        officialNumber,
        letterTitle,
        replyRequired,
        replyYn,
        sendDate,
        targetDate
    } = ctx.request.body;

    const query = {
        senderGb: senderGb ? senderGb : '',
        sender: sender ? sender : '',
        receiverGb: receiverGb ? receiverGb : '',
        receiver: receiver ? receiver : '',
        letterGb: letterGb ? letterGb : '',
        officialNumber: officialNumber ? officialNumber : '',
        letterTitle: letterTitle ? letterTitle : '',
        replyRequired: replyRequired ? replyRequired : '',
        replyYn: replyYn ? replyYn : '',
        sendDate: sendDate ? sendDate : '9999-12-31',
        targetDate: targetDate ? targetDate : '9999-12-31'
    };

    try {
        const letters = await Letter.searchLetter(query, page);

        const count = await Letter.searchLetterCount(query);

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: letters,
            message: 'Success - letterCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > search: ${e.message}`
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
        project,
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
        project: Joi.string().required(),
        letterGb: Joi.string().required(),
        reference: Joi.array().optional(),
        letterTitle: Joi.string().required(),
        senderGb: Joi.string().required(),
        sender: Joi.string().required(),
        receiverGb: Joi.string().required(),
        receiver: Joi.string().required(),
        sendDate: Joi.string().optional(),
        replyRequired: Joi.string().required(),
        targetDate: replyRequired === 'YES' ? Joi.string().required() : Joi.string().optional(),
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
            project,
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
 * @author minz-logger
 * @date 2019. 09. 19
 * @description 참조할 문서 검색
 */
export const referenceSearch = async (ctx) => {
    let { keyword } = ctx.query;

    if (!keyword) {
        ctx.res.badRequest({
            data: { keyword: keyword },
            message: 'Fail - letterCtrl > referenceSearch'
        });

        return;
    }

    try {
        const result = await Letter.referenceSearch(keyword);

        ctx.res.ok({
            data: result,
            message: 'Success - letterCtrl > referenceSearch'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > referenceSearch: ${e.message}`
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
        const letter = await Letter.letterDetail(id);

        ctx.res.ok({
            data: letter[0],
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
        reference: Joi.array().optional(),
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
            data: letter[0],
            message: 'Success - letterCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > edit: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 18
 * @description 공식문서 취소
 */
export const cancel = async (ctx) => {
    let { id } = ctx.params;
    let { yn, reason } = ctx.request.body;

    const schema = Joi.object().keys({
        yn: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - letterCtrl > cancel'
        });

        return;
    }

    try {
        const letter = await Letter.cancelLetter({ id, yn, reason });

        ctx.res.ok({
            data: letter,
            message: 'Success - letterCtrl > cancel'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - letterCtrl > cancel: ${e.message}`
        });
    }
};