import VendorLetter from 'models/vendorLetter/vendorLetter';

/**
 * @author minz-logger
 * @date 2019. 08. 23
 * @description 업체 공식 문서 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    try {
        const vendorLetters = await VendorLetter
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        ctx.res.ok({
            data: vendorLetters,
            message: 'Success - vendorLetterCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - vendorLetterCtrl > list'
        });
    }
};