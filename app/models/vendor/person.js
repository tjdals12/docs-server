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

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {Object} param
 */
PersonSchema.statics.savePerson = async function (param) {
    const person = new this({ ...param });

    await person.save();

    return person._id;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {Array} param
 */
PersonSchema.statics.savePersons = async function (param) {
    let ids = [];

    while (param.length > 0) {
        const person = new this({ ...param.pop() });
        await person.save();
        ids.push(person._id);
    }

    return ids;
};

export default model('Person', PersonSchema);