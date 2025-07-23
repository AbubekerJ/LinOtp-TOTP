

const axios = require('axios');
const { randomUUID } = require('crypto');
const qs = require('querystring');
require('dotenv').config();




const LINOTP_SERVER = process.env.LINOTP_SERVER ;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ;

async function createLinOTPToken() {

    try {
        // authenticate  admin user to get access and CSRF tokens
        const authResponse = await axios.post(`${LINOTP_SERVER}/admin/login`, qs.stringify({
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const setCookies = authResponse.headers['set-cookie'];

        const accessTokenCookie = setCookies.find(cookie => cookie.startsWith('access_token_cookie='));
        const csrfCookie = setCookies.find(cookie => cookie.startsWith('csrf_access_token='));

        const accessToken = accessTokenCookie?.split(';')[0]?.split('=')[1];
        const csrfToken = csrfCookie?.split(';')[0]?.split('=')[1];

        console.log('Access Token:', accessToken);
        console.log('CSRF Token:', csrfToken);

        const tokenParams = {
            serial : 'TOK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
            genkey: 1, // Generate a key
            keysize: 20, // 20 bytes (160 bits)
            type: 'totp', // Token type (hmac, totp, etc.)
            otplen: 6, // 6-digit OTP
            hashlib: 'sha1', // SHA-1 algorithm
            description: 'Node.js generated token',
            user: 'abubeker.jemal03@gmail.com@realm_remitance_local'

        };

        // Create the token
        const response = await axios.post(
            `${LINOTP_SERVER}/admin/init`,
            qs.stringify(tokenParams),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': `access_token_cookie=${accessToken}`,
                    'X-CSRF-TOKEN': csrfToken
                }
            }
        );
        if (response.data.result.status && response.data.result.value) {
            console.log("token created successfully")
            const otpAuthUrl = response.data.detail.googleurl.value;

            const url = new URL(otpAuthUrl);
            const secret = url.searchParams.get('secret');
            const img = response.data.detail.googleurl.img
            console.log("secret key.........", secret)
            console.log("image url.........", img)
        }
        else if (!response.data.result.status && response.data.result.error) {
            console.error('Error creating token:', response.data.result.error);

            return;

        }

        //console.log(response.data);

    } catch (error) {
        console.error('Error creating token:');
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status code:', error.response.status);
        } else {
            console.error(error.message);
        }
    }
}

createLinOTPToken();
