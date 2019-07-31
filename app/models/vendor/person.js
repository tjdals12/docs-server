import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 업체 담당자
 */
const PersonSchema = new Schema({
    name: String,
    position: String,
    email: String,
    contactNumber: String,
    task: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

export default model('Person', PersonSchema);