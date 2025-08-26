const rp = require('request-promise');
const { InternalServerError, Unauthorized, BadRequest, Forbidden } = require('../../helpers/response');
const { AsyncCatch } = require('../../helpers/utilities');
const db = require('../../db');
const { HashPassword, signData } = require('../../helpers/jwt');
const { v4: uuidv4 } = require('uuid');

function getInfoFacebookByToken(accessToken, facebookID) {
    return new Promise((resolve, reject) => {
        let options = {
            uri: `https://graph.facebook.com/${facebookID}`,
            qs: {
                fields: 'id,name,email',
                access_token: accessToken
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        rp(options)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                resolve(err.error);
            });
    })
}

function downloadAvt(accessToken, facebookID) {
    return new Promise((resolve, reject) => {
        let options = {
            uri: `https://graph.facebook.com/${facebookID}/picture`,
            qs: {
                height: '200',
                width: '200',
                access_token: accessToken

            },
            headers: {
                'User-Agent': 'Request-Promise'
            }
        };

        rp(options)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                resolve(err.error);
            });
    })
}

const createAccount = async ({ name, email, id: facebook, accessToken }) => {
    const userName = uuidv4().toString('hex');
    const password = HashPassword('qwErtY@4321');
    let account = await db.queryPlaceholdersAsync('INSERT INTO user (email, name, password, role, lastLogin, createAt, facebook, accessToken, teamID, userName, confirmToken, confirmed) VALUES(?, ?, ?, 1, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?, ?, 1, ?, null, 1)', [email, name, password, facebook, accessToken, userName]);
    await db.queryPlaceholdersAsync("INSERT into user_config (userID) VALUES (?)",[account.insertId])

    // địt mẹ facebook trả file jfif, sharp đéo nhận dcm. Đéo làm thêm đâu dcm
    // const buffer = Buffer.from(await downloadAvt(accessToken, facebookID));
    // await compress(buffer, `uploads/avatars/${account.insertId}`);
    // await db.queryPlaceholdersAsync("UPDATE user SET avatar = ? WHERE id = ?", [path, account.insertId]);
    
    const user = await db.queryPlaceholdersAsync("SELECT id, name, email, avatar, role, money, username, (bannedTime > CURRENT_TIMESTAMP()) as isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE id = ?", [account.insertId]);
    return user[0];
}

module.exports = AsyncCatch(async (req, res, next) => {
    const { facebookID, accessToken } = req.body;
    if (!facebookID || !accessToken) throw new BadRequest("dsd");

    const data = await getInfoFacebookByToken(accessToken, facebookID);
    
    if (data.error) {
        console.error(data.error);
        throw new BadRequest('Có lỗi xảy ra, liên hệ với admin để báo lỗi!');
    }
    const { id, name, email } = data;
    if (!email) throw new Unauthorized('Tài khoản facebook của bạn chưa liên kết email! Vui lòng liên kết email với tài khoản facebook của bạn!');
    if (!id || !name) throw new BadRequest('Có lỗi xảy ra, liên hệ với admin hoặc thử lại với email nhé!');

    const user = await db.queryPlaceholdersAsync('SELECT id, name, email, password, role, money, username, (bannedTime > CURRENT_TIMESTAMP()) as isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE email = ?', [email]);
    if (user.length === 0) {
        const u = await createAccount({ name, email, id, accessToken });
        res.send({
            ...u,
            token: signData(u)
        })
    }
    else {
        if (user[0].isBanned == true){
            const ban = await db.queryPlaceholdersAsync("SELECT reason, expireAt FROM user_ban WHERE userID = ? AND status = 'ACTIVE' ORDER BY createdAt DESC LIMIT 1", [user[0].id]);
            throw new Forbidden({
                message: 'Bạn đã bị ban',
                ...ban[0]
            });
        }

        await db.queryPlaceholdersAsync('UPDATE user SET lastLogin = CURRENT_TIMESTAMP(), facebook = ?, accessToken = ? WHERE id = ?', [id, accessToken, user[0].id]);
        await db.queryPlaceholdersAsync("UPDATE user_ban SET status = 'REMOVED' WHERE userID = ? AND status = 'ACTIVE'", [user[0].id]);

        res.send({
            ...user[0],
            token: signData(user[0])
        });
    }
})
