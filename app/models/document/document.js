import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import InOut from './inOut';
import Status from './status';
import HoldYn from './holdYn';
import deleteYn from './deleteYn';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서
 */
const DocumentSchema = new Schema({
    vendor: Schema.Types.ObjectId,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    documentNumber: String,
    documentTitle: String,
    documentInOut: [InOut.schema],
    documentGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    documentStatus: {
        type: [Status.schema],
        default: Status
    },
    documentRev: String,
    level: {
        type: Number,
        default: 0
    },
    memo: String,
    holdYn: {
        type: [HoldYn.schema],
        default: HoldYn
    },
    deleteYn: {
        type: deleteYn.schema,
        default: deleteYn
    },
    delayGb: {
        type: String,
        default: DEFINE.DELAY_GB.LAZY,
        get: DEFINE.deleyGbConverter
    },
    chainingDocument: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

DocumentSchema.set('toObject', { getters: true });
DocumentSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 추가
 * @param       {Object} param
 */
DocumentSchema.statics.saveDocument = async function (param) {
    let {
        vendor,
        part,
        documentNumber,
        documentTitle,
        documentGb,
        documentRev,
        officialNumber,
        memo
    } = param;

    const documentInOut = new InOut({ officialNumber });
    const document = new this({ vendor, part, documentNumber, documentTitle, documentGb, documentRev, documentInOut, memo });

    await document.save();

    return this.findOne({ _id: document._id }).populate({ path: 'part' }).populate({ path: 'documentGb ' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 수정
 * @param       {Object} param
 */
DocumentSchema.statics.editDocument = function (param) {
    let {
        id,
        vendor,
        part,
        documentNumber,
        documentTitle,
        documentGb,
        documentRev,
        officialNumber,
        memo
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendor,
                part,
                documentNumber,
                documentTitle,
                documentGb,
                documentRev,
                officialNumber,
                memo,
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 삭제
 * @param       {String} id
 * @param       {String} reason
 */
DocumentSchema.statics.deleteDocument = function (id, yn, reason) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deleteYn: {
                    yn: yn,
                    deleteDt: DEFINE.dateNow(),
                    reason: reason
                },
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 22
 * @description 문서 In / Out
 * @param       {String} id
 * @param       {String} inOutGb
 * @param       {String} officialNumber
 * @param       {String} status
 * @param       {String} resultCode
 * @param       {String} replyCode
 */
DocumentSchema.statics.inOutDocument = function (id, inOutGb, officialNumber, status, resultCode, replyCode, date) {
    const timestamp = new Timestamp({ regDt: date });
    const newInOut = new InOut({ inOutGb, officialNumber, timestamp });
    const newStatus = new Status({ status, resultCode, replyCode, timestamp });

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                documentInOut: newInOut,
                documentStatus: newStatus
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 31
 * @description 문서 In / Out 삭제
 * @param       {String} id
 */
DocumentSchema.statics.deleteInOutDocument = function (id, targetId) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                documentInOut: {
                    _id: targetId
                },
                documentStatus: {
                    _id: targetId
                }
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 보류
 * @param       {String} id
 * @param       {String} yn
 * @param       {String} reason
 */
DocumentSchema.statics.holdDocument = async function (id, yn, reason) {
    const newHoldYn = new HoldYn({ yn, reason });

    await this.findOneAndUpdate(
        {
            $and: [
                { _id: id },
                {
                    holdYn: {
                        $elemMatch: {
                            effEndDt: DEFINE.COMMON.MAX_END_DT
                        }
                    }
                }
            ]
        },
        {
            $set: {
                'holdYn.$.effEndDt': DEFINE.dateNow(),
                'timestamp.updDt': DEFINE.dateNow()
            }
        }
    );

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                holdYn: newHoldYn
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'part' }).populate({ path: 'documentGb' });
};

export default model('Document', DocumentSchema);