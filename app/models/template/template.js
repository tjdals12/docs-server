import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 09. 25
 * @description 양식
 */
const TemplateSchema = new Schema({
    templateGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    templateName: String,
    templateType: String,
    templatePath: String,
    templateDescription: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

TemplateSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 추가
 * @param       {Object} param
 */
TemplateSchema.statics.saveTemplate = async function (param) {
    let {
        templateGb,
        templateName,
        templateType,
        templatePath,
        templateDescription
    } = param;

    const template = new this({ templateGb, templateName, templatePath, templateType, templateDescription });

    await template.save();

    return this
        .findOne({ _id: template._id })
        .populate({ path: 'templateGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 수정
 * @param       {String} id
 * @param       {Object} param
 */
TemplateSchema.statics.editTemplate = async function (id, param) {
    let {
        templateGb,
        templateName,
        templateType,
        templatePath,
        templateDescription
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                templateGb,
                templateName,
                templateType,
                templatePath,
                templateDescription,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'templateGb' });
};

export default model('Template', TemplateSchema);