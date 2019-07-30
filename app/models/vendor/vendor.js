import { Schema, model } from 'mongoose';
import DEFINE from 'models/common';
import Person from './person';
import { Timestamp } from 'models/common/schema';

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
    vendorPerson: [Person.schema],
    officialName: String,
    part: {
        type: Schema.Types.ObjectId,
        ref: 'cdMinor'
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
        type: String,
        default: DEFINE.dateNow
    },
    trackingTransmittal: [Schema.Types.ObjectId],
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
});

VendorSchema.set('toJSON', { getters: true });

export default model('Vendor', VendorSchema);