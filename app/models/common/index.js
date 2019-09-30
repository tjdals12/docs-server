// import moment from 'moment';
import moment from 'moment-timezone';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 명시 데이터
 */
const DEFINE = {
    COMMON: {
        SYSTEM: 'SYSTEM',
        DEFAULT_YES: 'YES',
        DEFAULT_NO: 'NO',
        DEFAULT_REASON: '이력없음.',
        MAX_END_DT: '9999-12-31 23:59:59',
        NONE: '-',
        NONE_ID: '000000000000000000000000'
    },

    IN_OUT_GB: {
        FROM_VENDOR: '01',
        FROM_VENDOR_RE: '02',
        TO_INTERNAL: '10',
        TO_INTERNAL_RE: '12',
        FROM_INTERNAL: '20',
        FROM_INTERNAL_RE: '22',
        TO_CLIENT: '30',
        TO_CLIENT_RE: '32',
        FROM_CLIENT: '40',
        FROM_CLIENT_RE: '42',
        TO_VENDOR: '90',
        TO_VENDOR_RE: '92',
        NONE: '94'
    },

    inOutGbConverter: function (code) {
        switch (code) {
            case DEFINE.IN_OUT_GB.FROM_VENDOR:
                return '업체로부터 접수';
            case DEFINE.IN_OUT_GB.FROM_VENDOR_RE:
                return '업체로부터 재접수';
            case DEFINE.IN_OUT_GB.TO_INTERNAL:
                return '내부 검토요청';
            case DEFINE.IN_OUT_GB.TO_INTERNAL_RE:
                return '내부 재검토요청';
            case DEFINE.IN_OUT_GB.FROM_INTERNAL:
                return '내부 검토완료';
            case DEFINE.IN_OUT_GB.FROM_INTERNAL_RE:
                return '내부 재검토완료';
            case DEFINE.IN_OUT_GB.TO_CLIENT:
                return '사업주 검토요청';
            case DEFINE.IN_OUT_GB.TO_CLIENT_RE:
                return '사업주 재검토요청';
            case DEFINE.IN_OUT_GB.FROM_CLIENT:
                return '사업주 검토완료';
            case DEFINE.IN_OUT_GB.FROM_CLIENT_RE:
                return '사업주 재검토완료';
            case DEFINE.IN_OUT_GB.TO_VENDOR:
                return '업체로 송부';
            case DEFINE.IN_OUT_GB.TO_VENDOR_RE:
                return '업체로 재송부';
            case DEFINE.IN_OUT_GB.NONE:
                return '회신 필요없음';
            default:
                return code;
        }
    },

    STATUS_CD: {
        /** 접수, 재접수, 접수취소 */
        CODE_01: '01',
        CODE_02: '02',
        CODE_05: '05',

        /** 내부 - 검토중, 승인, 수정, 반송요청 */
        CODE_10: '10',
        CODE_11: '11',
        CODE_12: '12',
        CODE_13: '13',

        /** 사업주 - 검토중, 승인, 수정, 반송요청 */
        CODE_20: '20',
        CODE_21: '21',
        CODE_22: '22',
        CODE_23: '23',

        /*** 내부 - 재검토중, 승인, 수정 */
        CODE_30: '30',
        CODE_31: '31',
        CODE_32: '32',

        /*** 사업주 - 재검토중, 승인, 수정 */
        CODE_40: '40',
        CODE_41: '41',
        CODE_42: '42',

        /** 회신, 개별 회신, 별도 회신, 재회신, 회신 필요없음 */
        CODE_90: '90',
        CODE_91: '91',
        CODE_92: '92',
        CODE_93: '93',
        CODE_94: '94'
    },

    statusConverter: function (code) {
        switch (code) {
            case DEFINE.STATUS_CD.CODE_01:
                return '접수';
            case DEFINE.STATUS_CD.CODE_02:
                return '재접수';
            case DEFINE.STATUS_CD.CODE_03:
                return '접수취소';
            case DEFINE.STATUS_CD.CODE_10:
                return '내부 검토중';
            case DEFINE.STATUS_CD.CODE_11:
                return '내부 검토완료 - 승인';
            case DEFINE.STATUS_CD.CODE_12:
                return '내부 검토완료 - 수정';
            case DEFINE.STATUS_CD.CODE_13:
                return '내부 검토완료 - 반송요청';
            case DEFINE.STATUS_CD.CODE_20:
                return '사업주 검토중';
            case DEFINE.STATUS_CD.CODE_21:
                return '사업주 검토완료 - 승인';
            case DEFINE.STATUS_CD.CODE_22:
                return '사업주 검토완료 - 수정';
            case DEFINE.STATUS_CD.CODE_23:
                return '사업주 검토완료 - 반송요청';
            case DEFINE.STATUS_CD.CODE_30:
                return '내부 재검토중';
            case DEFINE.STATUS_CD.CODE_31:
                return '내부 재검토완료 - 승인';
            case DEFINE.STATUS_CD.CODE_32:
                return '내부 재검토완료 - 수정';
            case DEFINE.STATUS_CD.CODE_40:
                return '사업주 재검토중';
            case DEFINE.STATUS_CD.CODE_41:
                return '사업주 재검토완료 - 승인';
            case DEFINE.STATUS_CD.CODE_42:
                return '사업주 재검토완료 - 수정';
            case DEFINE.STATUS_CD.CODE_90:
                return '회신';
            case DEFINE.STATUS_CD.CODE_91:
                return '개별 회신';
            case DEFINE.STATUS_CD.CODE_92:
                return '별도 회신';
            case DEFINE.STATUS_CD.CODE_93:
                return '재회신';
            case DEFINE.STATUS_CD.CODE_94:
                return '회신 필요없음';
            default:
                return code;
        }
    },

    RESULT_CD: {
        APPROVED: '01',
        WITH_COMMENT: '02',
        REJECT: '03'
    },

    resultCodeConverter: function (code) {
        switch (code) {
            case DEFINE.RESULT_CD.APPROVED:
                return 'Approved';

            case DEFINE.RESULT_CD.WITH_COMMENT:
                return 'Approved with Comment';

            case DEFINE.RESULT_CD.REJECT:
                return 'Reject';
        }
    },

    REPLY_CD: {
        ALL: '01',
        PARTIAL: '02',
        NON_OFFICIAL: '03',
        NONE: '04'
    },

    replyCodeConverter: function (code) {
        switch (code) {
            case DEFINE.REPLY_CD.ALL:
                return '전체';
            case DEFINE.REPLY_CD.PARTIAL:
                return '부분';
            case DEFINE.REPLY_CD.NON_OFFICIAL:
                return '비공식';
            case DEFINE.REPLY_CD.NONE:
                return '회신 필요없음';
        }
    },

    DELAY_GB: {
        LAZY: '01',
        NEAR: '02',
        NOW: '03',
        DELAY: '04'
    },

    delayGbConverter: function (code) {
        switch (code) {
            case DEFINE.DELAY_GB.LAZY:
                return '여유';
            case DEFINE.DELAY_GB.NEAR:
                return '임박';
            case DEFINE.DELAY_GB.NOW:
                return '오늘';
            case DEFINE.DELAY_GB.DELAY:
                return '지연';
        }
    },

    isDelay: function (target, lastStatus) {
        if (lastStatus.match(new RegExp(/^9/g))) {
            return {
                remain: '-',
                delayGb: '회신'
            };
        }

        const targetDt = moment(target, 'YYYY-MM-DD');
        const today = this.dateNow();
        const remain = Math.ceil(targetDt.diff(today, 'hours') / 24);

        const delayGb = remain === 0 ? '03' : (remain < 0 ? '04' : remain > 3 ? '01' : '02');

        return {
            remain,
            delayGb: DEFINE.delayGbConverter(delayGb)
        };
    },

    dateNow: function () {
        return moment.tz(Date.now(), 'Asia/Seoul');
    },

    datePeriod: function (start, end) {
        const startDt = moment(start, 'YYYY-MM-DD');
        const endDt = moment(end, 'YYYY-MM-DD');
        const today = this.dateNow();

        const total = endDt.diff(startDt, 'days');
        const untilNow = today.diff(startDt, 'days');
        const leftMonth = endDt.diff(today, 'months');
        const percent = Math.round((untilNow / total) * 100);

        return {
            total,
            untilNow,
            leftMonth,
            percent
        };
    },

    dateConverter: function (date) {
        return moment(date).format('YYYY-MM-DD H:mm:ss');
    },

    VENDOR_GB: {
        CONTRACTOR: '01',
        MANAGEMENT: '02'
    },

    vendorGbConverter: function (code) {
        switch (code) {
            case DEFINE.VENDOR_GB.CONTRACTOR:
                return '계약';
            case DEFINE.VENDOR_GB.MANAGEMENT:
                return '관리';
        }
    },

    COUNTRY_CD: {
        DOMESTIC: '01',
        FOREIGN: '02'
    },

    countryCodeConverter: function (code) {
        switch (code) {
            case DEFINE.COUNTRY_CD.DOMESTIC:
                return '국내';

            case DEFINE.COUNTRY_CD.FOREIGN:
                return '해외';
        }
    },

    LETTER_GB: {
        EAMIL: '01',
        TRANSMITTAL: '02'
    },

    letterGbConverter: function (code) {
        switch (code) {
            case DEFINE.LETTER_GB.EAMIL:
                return 'E-mail';

            case DEFINE.LETTER_GB.TRANSMITTAL:
                return 'TR';

            default:
                return code;
        }
    },

    SENDER_RECEIVER_GB: {
        CLIENT: '01',
        CONTRACTOR: '02',
        VENDOR: '03'
    },

    senderReceiverGbConverter: function (code) {
        switch (code) {
            case DEFINE.SENDER_RECEIVER_GB.CLIENT:
                return 'CLIENT';

            case DEFINE.SENDER_RECEIVER_GB.CONTRACTOR:
                return 'CONTRACTOR';

            case DEFINE.SENDER_RECEIVER_GB.VENDOR:
                return 'VENDOR';
        }
    },

    levelConverter: function (level) {
        switch (level) {
            case 1:
                return {
                    number: level,
                    description: '낮음'
                };

            case 2:
                return {
                    number: level,
                    description: '다소 낮음'
                };

            case 3:
                return {
                    number: level,
                    description: '보통'
                };

            case 4:
                return {
                    number: level,
                    description: '다소 높음'
                };

            case 5:
                return {
                    number: level,
                    description: '높음'
                };
        }
    }
};

export default DEFINE;