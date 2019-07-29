import { Schema, model } from 'mongoose';
import Timestamp from 'models/common/schema/Timestamp';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description 공통코드
 */
const Cmcode = new Schema({
    effStaDt: {
        type: String,
        default: DEFINE.dateNow
    },
    effEndDt: {
        type: String,
        default: DEFINE.COMMON.MAX_END_DT
    },
    cdMajor: String,
    cdMinor: String,
    cdFName: String,
    cdSName: String,
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 추가
 * @param       {Object} param
 */
Cmcode.statics.saveCmcode = function (param) {
    let {
        cdMajor,
        cdMinor,
        cdFName,
        cdSName
    } = param;

    const cmcode = this({ cdMajor, cdMinor, cdFName, cdSName });

    cmcode.save();

    return cmcode;
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 수정
 * @param       {Object} param
 */
Cmcode.statics.editCmcode = function (param) {
    let {
        id,
        cdMajor,
        cdMinor,
        cdFName,
        cdSName
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cdMajor,
                cdMinor,
                cdFName,
                cdSName,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 수정
 * @param       {String} id
 */
Cmcode.statics.deleteCmcode = function (id) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                effEndDt: DEFINE.dateNow(),
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

export default model('Cmcode', Cmcode);