import { Schema, model } from 'mongoose';
import Timestamp from 'models/common/schema/Timestamp';

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 (하위)
 */
const cdMinorSchema = new Schema({
    cdMinor: String,
    cdSName: String,
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
}, { _id: false, id: false });

export default model('cdMinor', cdMinorSchema);