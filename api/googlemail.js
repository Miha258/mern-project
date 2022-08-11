const nodemailer = require('nodemailer')
const googleapis = require('googleapis')


const CLIENT_ID = '342093261656-dr2s6jtu8cs9kgsg7cnrucgcv658nlfm.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REFRESH_TOKEN = '1//04vSSkCSka2UaCgYIARAAGAQSNwF-L9IrPfb6g7i__esXMQfpxid-Jn9WvlnWXoJd9l7s_Ss7QOx7AK9pfOIhrbXsacmw1gqaX1Y'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'


const oAuth2Client = new googleapis.Auth.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const sendMail = async (to, html) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: 'rizoks29@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            },
        })

        const options = {
            from: 'MERN BANK <rizoks29@gmail.com>',
            subject: 'MERN BANK NOTIFICATION',
            to,
            html
        }
        const result = await transport.sendMail(options)
        return result
    } catch (err) {
        return err
    }
}

module.exports = sendMail