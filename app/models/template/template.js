import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';

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

export default model('Template', TemplateSchema);