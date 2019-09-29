import Template from 'models/template/template';
import Letter from 'models/letter/letter';
import VendorLetter from 'models/vendorLetter/vendorLetter';
import Joi from 'joi';
import { makeFile } from 'utils/templater';

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 목록 조회
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
        const templates = await Template.find().skip((page - 1) * 10).limit(10).populate({ path: 'templateGb' });

        const count = await Template.countDocuments();

        ctx.set('total', count);
        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: templates,
            message: 'Success - templateCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: `Error - templateCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 27
 * @description 양식 목록 조회 (For select)
 */
export const listForSelect = async (ctx) => {
    try {
        const templates = await Template.find({}, { templateGb: 1, templateName: 1 }).populate({ path: 'templateGb' });

        ctx.res.ok({
            data: templates,
            message: 'Success - templateCtrl > listForSelect'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: `Error - templateCtrl > listForSelect: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 추가
 */
export const add = async (ctx) => {
    let { templateGb, templateName, templateType, templatePath, templateDescription } = ctx.request.body;

    const schema = Joi.object().keys({
        templateGb: Joi.string().required(),
        templateName: Joi.string().required(),
        templateType: Joi.string().required(),
        templatePath: Joi.string().required(),
        templateDescription: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - templateCtrl > add'
        });

        return;
    }

    try {
        const template = await Template.saveTemplate({
            templateGb,
            templateName,
            templateType,
            templatePath,
            templateDescription
        });

        ctx.res.ok({
            data: template,
            message: 'Success - templateCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - templateCtrl > add: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const template = await Template.findOne({ _id: id }).populate({ path: 'templateGb' });

        ctx.res.ok({
            data: template,
            message: 'Success templateCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - templateCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;

    let { templateGb, templateName, templateType, templatePath, templateDescription } = ctx.request.body;

    const schema = Joi.object().keys({
        templateGb: Joi.string().required(),
        templateName: Joi.string().required(),
        templateType: Joi.string().required(),
        templatePath: Joi.string().required(),
        templateDescription: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - templateCtrl > edit'
        });

        return;
    }

    try {
        const template = await Template.editTemplate(id, {
            templateGb,
            templateName,
            templateType,
            templatePath,
            templateDescription
        });

        ctx.res.ok({
            data: template,
            message: 'Success - templateCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - templateCtrl > edit: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 27
 * @description 양식 다운로드
 */
export const download = async (ctx) => {
    let { key, target, template } = ctx.request.body;

    try {
        let param;

        if (key === 'letter') {
            const letter = await Letter.findOne(
                { _id: target },
                {
                    officialNumber: 1,
                    letterTitle: 1,
                    senderGb: 1,
                    sender: 1,
                    receiverGb: 1,
                    receiver: 1,
                    sendDate: 1,
                    reference: 1
                }
            );

            const vendorLetter = await VendorLetter.find(
                { _id: { $in: letter.reference } },
                {
                    officialNumber: 1,
                    documents: 1
                }
            )
                .populate({ path: 'documents' })
                .then(function (vendorLetters) {
                    return vendorLetters.map((vendorLetter) => {
                        const documents = vendorLetter.documents.map((document, index) => {
                            const status = document.documentStatus.filter(item => item.status.match(new RegExp(/(^1|^3)/g))).slice(-1)[0];

                            return {
                                index: index + 1,
                                documentTitle: document.documentTitle,
                                documentNumber: document.documentNumber,
                                documentRev: document.documentRev,
                                resultCode: status ? status.resultCode : '-'
                            };
                        });

                        return {
                            officialNumber: vendorLetter.officialNumber,
                            documents: documents
                        };
                    });
                });

            let sendDate = letter.sendDate.substr(0, 10).split('-');

            param = {
                officialNumber: letter.officialNumber,
                letterTitle: letter.letterTitle,
                sender: letter.sender,
                senderGb: letter.senderGb,
                receiver: letter.receiver,
                receiverGb: letter.receiverGb,
                sendDate: {
                    year: sendDate[0],
                    month: sendDate[1],
                    day: sendDate[2]
                },
                vendorLetters: vendorLetter
            };
        }

        const { templatePath, templateType } = await Template.findOne({ _id: template });

        ctx.set('Content-disposition', `attachment; filename=${param.officialNumber}.${templateType}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        return new Promise((resolve, reject) => {
            makeFile(templatePath, param, (data, err) => {
                if (err) reject(err);

                ctx.body = data;
                resolve();
            });
        });
    } catch (e) {
        console.log(e.message);
        ctx.res.internalServerError({
            data: {},
            message: `Error - letterCtrl > download: ${e.message}`
        });
    }
};