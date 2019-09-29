import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import Document from 'models/document/document';
import VendorLetter from 'models/vendorLetter/vendorLetter';
import Project from 'models/project/project';

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식 문서
 */
const LetterSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    letterGb: {
        type: String,
        get: DEFINE.letterGbConverter
    },
    reference: [Schema.Types.ObjectId],
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
 * @date        2019. 09. 20
 * @description 공식문서 검색
 */
LetterSchema.statics.searchLetter = function (param, page) {
    let {
        senderGb,
        sender,
        receiverGb,
        receiver,
        letterGb,
        officialNumber,
        letterTitle,
        replyRequired,
        replyYn,
        sendDate,
        targetDate
    } = param;

    return this.find({
        $and: [
            { senderGb: { $regex: senderGb + '.*', $options: 'i' } },
            { sender: { $regex: sender + '.*', $options: 'i' } },
            { receiverGb: { $regex: receiverGb + '.*', $options: 'i' } },
            { receiver: { $regex: receiver + '.*', $options: 'i' } },
            { letterGb: { $regex: letterGb + '.*', $options: 'i' } },
            { officialNumber: { $regex: officialNumber + '.*', $options: 'i' } },
            { letterTitle: { $regex: letterTitle + '.*', $options: 'i' } },
            { replyRequired: { $regex: replyRequired + '.*', $options: 'i' } },
            { replyYn: { $regex: replyYn + '.*', $options: 'i' } },
            { sendDate: { $lte: new Date(sendDate) } },
            {
                $or: [
                    { targetDate: { $exists: true, $lte: new Date(targetDate) } },
                    { targetDate: { $exists: false } }
                ]
            }
        ]
    })
        .skip((page - 1) * 10)
        .limit(10)
        .sort({ sendDate: -1 });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 20
 * @description 공식문서 검색 카운트
 */
LetterSchema.statics.searchLetterCount = async function (param) {
    let {
        senderGb,
        sender,
        receiverGb,
        receiver,
        letterGb,
        officialNumber,
        letterTitle,
        replyRequired,
        replyYn,
        sendDate,
        targetDate
    } = param;

    return this.countDocuments({
        $and: [
            { senderGb: { $regex: senderGb + '.*', $options: 'i' } },
            { sender: { $regex: sender + '.*', $options: 'i' } },
            { receiverGb: { $regex: receiverGb + '.*', $options: 'i' } },
            { receiver: { $regex: receiver + '.*', $options: 'i' } },
            { letterGb: { $regex: letterGb + '.*', $options: 'i' } },
            { officialNumber: { $regex: officialNumber + '.*', $options: 'i' } },
            { letterTitle: { $regex: letterTitle + '.*', $options: 'i' } },
            { replyRequired: { $regex: replyRequired + '.*', $options: 'i' } },
            { replyYn: { $regex: replyYn + '.*', $options: 'i' } },
            { sendDate: { $lte: new Date(sendDate) } },
            {
                $or: [
                    { targetDate: { $exists: true, $lte: new Date(targetDate) } },
                    { targetDate: { $exists: false } }
                ]
            }
        ]
    });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 16
 * @description 공식문서 추가
 */
LetterSchema.statics.saveLetter = async function (param) {
    const nextNum = await this
        .find({
            $and: [
                { project: param.project },
                { letterGb: param.letterGb }
            ]

        }, { _id: 0, officialNumber: 1 })
        .sort({ officialNumber: -1 })
        .limit(1)
        .then((data) => {
            if (data.length === 0)
                return '001';

            let temp = parseInt(data[0].officialNumber.split('-').pop(), 10) + 1 + '';
            return temp.length < 3 ? new Array(3 - temp.length + 1).join('0') + temp : temp;
        });

    const project = await Project.findOne({ _id: param.project });

    const sender = param.senderGb === '01' ? project.clientCode : project.contractorCode;
    const receiver = param.receiverGb === '01' ? project.clientCode : project.contractorCode;

    if (param.letterGb === '01') {
        param.officialNumber = `${sender}-${receiver}-E-${nextNum}`;
    } else {
        param.officialNumber = `${sender}-${receiver}-T-${nextNum}`;
    }

    const letter = new this({ ...param });

    await letter.save();

    return this.findOne({ _id: letter._id });
};

LetterSchema.statics.referenceSearch = async function (keyword) {
    let documents = await Document.find({
        $or: [
            { documentNumber: { $regex: keyword + '.*', $options: 'i' } },
            { documentTitle: { $regex: keyword + '.*', $options: 'i' } }
        ]
    });

    documents = documents.map(({ _id, documentNumber, documentTitle, documentRev, timestamp }) => {
        return {
            _id,
            description: `${documentNumber} ${documentTitle} Rev.${documentRev} / ${timestamp.regDt.substr(0, 10)}`
        };
    });

    let vendorLetters = await VendorLetter.find({ officialNumber: { $regex: keyword + '.*', $options: 'i' } }).populate({ path: 'vendor' });

    vendorLetters = vendorLetters.map(({ _id, vendor, officialNumber, timestamp }) => {
        return {
            _id,
            description: `${vendor.itemName}(${vendor.vendorName}) ${officialNumber} / ${timestamp.regDt.substr(0, 10)}`
        };
    });

    return documents.concat(vendorLetters);
};

/**
 * @author      minz-logger
 * @date        2019. 09. 19
 * @description 공식문서 조회 (for multiple join)
 */
LetterSchema.statics.letterDetail = function (id) {
    return this.aggregate([
        {
            $match: {
                _id: Types.ObjectId(id)
            }
        },
        {
            $unwind: {
                path: '$reference',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'vendorletters',
                localField: 'reference',
                foreignField: '_id',
                as: 'vendorLetters',
            }
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'reference',
                foreignField: '_id',
                as: 'documents'
            }
        },
        {
            $unwind: {
                path: '$vendorLetters',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$documents',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                project: { $first: '$project' },
                letterGb: { $first: '$letterGb' },
                reference: { $push: '$reference' },
                officialNumber: { $first: '$officialNumber' },
                letterTitle: { $first: '$letterTitle' },
                senderGb: { $first: '$senderGb' },
                sender: { $first: '$sender' },
                receiverGb: { $first: '$receiverGb' },
                receiver: { $first: '$receiver' },
                sendDate: { $first: '$sendDate' },
                replyRequired: { $first: '$replyRequired' },
                targetDate: { $first: '$targetDate' },
                replyYn: { $first: '$replyYn' },
                replyDate: { $first: '$replyDate' },
                cancelYn: { $first: '$cancelYn' },
                memo: { $first: '$memo' },
                timestamp: { $first: '$timestamp' },
                vendorLetters: { $push: '$vendorLetters' },
                documents: { $push: '$documents' }
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: 'project',
                foreignField: '_id',
                as: 'project'
            }
        },
        {
            $unwind: {
                path: '$project'
            }
        },
        {
            $limit: 1
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 09. 18
 * @description 공식문서 수정
 */
LetterSchema.statics.editLetter = async function (param) {
    let {
        id,
        letterGb,
        reference,
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

    await this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                letterGb,
                reference,
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
        }
    );

    return this.letterDetail(id);
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