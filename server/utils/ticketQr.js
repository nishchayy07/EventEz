import QRCode from 'qrcode';

const getBaseUrl = () => {
    const fromEnv = process.env.CLIENT_APP_URL || process.env.APP_URL || process.env.FRONTEND_URL;
    if (fromEnv) {
        return fromEnv.replace(/\/+$/, '');
    }
    return 'http://localhost:5173';
};

export const buildVerificationUrl = (token) => `${getBaseUrl()}/verify/${token}`;

export const generateTicketQrDataUrl = async (token) => {
    const verifyUrl = buildVerificationUrl(token);
    return QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        width: 320
    });
};

