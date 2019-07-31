import { Schema, model } from 'mongoose';
import Timestamp from 'models/common/schema/Timestamp';

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 (하위)
 */
const CdMinorSchema = new Schema({
    cdMinor: String,
    cdSName: String,
    cdRef1: Object,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author minz-logger
 * @date 2019. 07. 30
 * @description 하위 공통코드 저장
 */
CdMinorSchema.statics.saveCdMinor = function (param) {
    let {
        cdMinor,
        cdSName,
        cdRef1
    } = param;

    const newCdMinor = this({ cdMinor, cdSName, cdRef1 });
    newCdMinor.save();

    return newCdMinor;
};

/**
 * @author      minz-logger
 * @date        2019. 07. 30
 * @description 하위 공통코드 수정
 */
CdMinorSchema.statics.editCdMinor = function (param) {
    let {
        id,
        cdMinor,
        cdSName
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cdMinor: cdMinor,
                cdSName: cdSName
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 07. 30
 * @description 하위 공통코드 삭제
 */
CdMinorSchema.statics.deleteCdMinor = function (param) {
    let { id } = param;

    return this.findOneAndDelete({ _id: id });
};

export default model('Cdminor', CdMinorSchema);