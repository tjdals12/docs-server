import { Schema, model } from 'mongoose';
import CdMinor from './cdMinor';
import Timestamp from 'models/common/schema/Timestamp';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description 공통코드 (상위)
 */
const CmcodeSchema = new Schema({
    effStaDt: {
        type: String,
        default: DEFINE.dateNow
    },
    effEndDt: {
        type: String,
        default: DEFINE.COMMON.MAX_END_DT
    },
    cdMajor: {
        type: String,
        required: true
    },
    cdFName: String,
    cdMinors: [{
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    }],
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 조회
 * @param       {Object} param
 */
CmcodeSchema.statics.findWithMinor = function (param) {
    let {
        id,
        minor
    } = param;

    return this.findOne({ _id: id }).populate({ path: 'cdMinors', match: { cdMinor: minor } });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 생성
 * @param       {Object} param
 */
CmcodeSchema.statics.saveCmcodeMajor = function (param) {
    let {
        cdMajor,
        cdFName
    } = param;

    const cmcode = this({ cdMajor, cdFName });

    cmcode.save();

    return cmcode;
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 추가
 * @param       {Object} param
 */
CmcodeSchema.statics.saveCmcodeMinor = function (param) {
    let {
        id,
        cdMinor,
        cdSName,
        cdRef1
    } = param;

    const _id = CdMinor.saveCdMinor({ cdMinor, cdSName, cdRef1 });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                cdMinors: _id
            },
            $set: {
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
 * @description 상위 공통코드 수정
 * @param       {Object} param
 */
CmcodeSchema.statics.editCmcode = function (param) {
    let {
        id,
        cdMajor,
        cdFName
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cdMajor,
                cdFName,
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
 * @description 하위 공통코드 수정
 * @param       {Object} param
 */
CmcodeSchema.statics.editMinor = async function (param) {
    let {
        id,
        minorId,
        cdMinor,
        cdSName
    } = param;

    await CdMinor.editCdMinor({ id: minorId, cdMinor, cdSName });

    return this.findOne({ _id: id }).populate({ path: 'cdMinors', match: { _id: minorId } });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 삭제
 * @param       {String} id
 */
CmcodeSchema.statics.deleteCmcode = function (id) {
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

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 삭제
 * @param       {Object} param
 */
CmcodeSchema.statics.deleteCdMinor = async function (param) {
    let {
        id,
        minorId
    } = param;

    await CdMinor.deleteCdMinor({ id: minorId });

    return this.findOne({ _id: id }).populate({ path: 'cdMinors' });
};

export default model('Cmcode', CmcodeSchema);