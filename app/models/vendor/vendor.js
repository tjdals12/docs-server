import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import Person from './person';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 업체
 */
const VendorSchema = new Schema({
    vendorGb: {
        type: String,
        default: DEFINE.VENDOR_GB.CONTRACT,
        get: DEFINE.vendorGbConverter
    },
    vendorName: String,
    vendorPerson: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Person'
        }
    ],
    officialName: String,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    partNumber: {
        type: String,
        unique: true
    },
    countryCd: {
        type: String,
        default: DEFINE.COUNTRY_CD.DOMESTIC,
        get: DEFINE.countryCodeConverter
    },
    effStaDt: {
        type: Date,
        default: DEFINE.dateNow
    },
    effEndDt: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT)
    },
    trackingTransmittal: [Schema.Types.ObjectId],
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

VendorSchema.set('toJSON', { getters: true });

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 추가
 * @param       {Object} param
 */
VendorSchema.statics.saveVendor = async function (param) {
    let {
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        effStaDt,
        effEndDt,
        persons
    } = param;

    let ids = [];

    if (persons.length > 0)
        ids = await Person.savePersons(persons);

    const vendor = new this({ vendorGb, countryCd, part, partNumber, vendorName, officialName, effStaDt, effEndDt, vendorPerson: ids });

    await vendor.save();

    return this.findOne({ _id: vendor._id }).populate({ path: 'vendorPerson' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 수정
 * @param       {String} id
 * @param       {Object} param
 */
VendorSchema.statics.editVendor = function (id, param) {
    let {
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        effStaDt,
        effEndDt
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendorGb,
                countryCd,
                part,
                partNumber,
                vendorName,
                officialName,
                effStaDt: new Date(effStaDt),
                effEndDt: new Date(effEndDt)
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 삭제
 * @param       {String} id
 */
VendorSchema.statics.deleteVendor = async function (id) {
    await this.findOneAndDelete({ _id: id });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 * @param       {String} id
 * @param       {Object} param
 */
VendorSchema.statics.addPerson = async function (id, param) {
    const personId = await Person.savePerson(param);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                vendorPerson: personId
            }
        },
        {
            new: true
        }
    );
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 삭제
 * @param       {String} id
 * @param       {String} personId
 */
VendorSchema.statics.deletePerson = async function (id, personId) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                vendorPerson: personId
            }
        },
        {
            new: true
        }
    );
};

export default model('Vendor', VendorSchema);