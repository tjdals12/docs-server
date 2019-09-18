import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식 문서
 */
const LetterSchema = new Schema({
    letterGb: {
        type: String,
        get: DEFINE.letterGbConverter
    },
    reference: {
        type: Schema.Types.ObjectId,
        ref: 'VendorLetter'
    },
    letterTitle: String,
    senderGb: {
        type: String,
        get: DEFINE.senderReceiverGbConverter
    },
    sender: String,
    receiverGb: {
        type: String,
        get: DEFINE.senderReceiverGbConverter
    },
    receiver: String,
    sendDate: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    replyRequired: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    targetDate: {
        type: Date,
        get: DEFINE.dateConverter
    },
    replyYn: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    replyDate: {
        type: Date,
        get: DEFINE.dateConverter
    },
    officialNumber: {
        type: String,
        unique: true
    },
    cancelYn: {
        yn: {
            type: String,
            default: DEFINE.COMMON.DEFAULT_NO
        },
        cancelDt: {
            type: Date,
            default: DEFINE.dateNow
        },
        reason: {
            type: String,
            default: DEFINE.COMMON.DEFAULT_REASON
        }
    },
    memo: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

LetterSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식문서 추가
 */
LetterSchema.statics.saveLetter = async function (param) {
    const nextNum = await this
        .find({ letterGb: param.letterGb }, { _id: 0, officialNumber: 1 })
        .sort({ officialNumber: -1 })
        .then((data) => {
            if (data.length === 0)
                return '001';

            let temp = parseInt(data[0].officialNumber.split('-').pop(), 10) + 1 + '';
            return temp.length < 3 ? new Array(3 - temp.length + 1).join('0') + temp : temp;
        });

    param.officialNumber = `${param.senderGb === '01' ? 'HTC' : 'HENC'}-${param.receiverGb === '01' ? 'HTC' : 'HENC'}-${param.letterGb === '01' ? 'E' : 'T'}-${nextNum}`;

    const letter = new this({ ...param });

    await letter.save();

    return this.findOne({ _id: letter._id });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 18
 * @description 공식문서 수정
 */
LetterSchema.statics.editLetter = function (param) {
    let {
        id,
        letterGb,
        letterTitle,
        senderGb,
        sender,
        receiverGb,
        receiver,
        sendDate,
        replyRequired,
        targetDate,
        memo
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                letterGb,
                letterTitle,
                senderGb,
                sender,
                receiverGb,
                receiver,
                sendDate,
                replyRequired,
                targetDate,
                memo,
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
 * @date        2019. 09. 18
 * @description 공식문서 취소 
 */
LetterSchema.statics.cancelLetter = function (param) {
    let {
        id,
        yn,
        reason
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cancelYn: {
                    yn,
                    reason,
                    cancelDt: DEFINE.dateNow()
                },
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );
};

export default model('Letter', LetterSchema);