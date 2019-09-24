import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트
 */
const ProjectSchema = new Schema({
    projectGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    projectName: String,
    projectCode: String,
    effStaDt: {
        type: Date,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: Date,
        get: DEFINE.dateConverter
    },
    client: String,
    clientCode: String,
    contractor: String,
    contractorCode: String,
    memo: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

ProjectSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트 추가
 * @param       {Object} param
 */
ProjectSchema.statics.saveProject = async function (param) {
    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = param;

    const project = new this({
        projectGb, projectName, projectCode, effStaDt, effEndDt, client, clientCode, contractor, contractorCode, memo
    });

    await project.save();

    return this
        .findOne({ _id: project._id })
        .populate({ path: 'projectGb' });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 24
 * @description 프로젝트 수정
 * @param       {String} id
 * @param       {Object} param
 */
ProjectSchema.statics.editProject = function (id, param) {
    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                projectGb,
                projectName,
                projectCode,
                effStaDt,
                effEndDt,
                client,
                clientCode,
                contractor,
                contractorCode,
                memo,
                'timestamp.uptDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'projectGb' });
};

export default model('Project', ProjectSchema);