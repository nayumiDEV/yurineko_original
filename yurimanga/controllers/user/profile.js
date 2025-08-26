const { AWS_S3_HOST_NAME, STORAGE_DIR } = require('../../configs/env');
const db = require('../../db');
const { compareHashString, HashPassword } = require('../../helpers/jwt');
const { purgeCloudFlare, compress } = require('../../helpers/process');
const { Unauthorized, BadRequest } = require('../../helpers/response');
const { AsyncCatch, validator, uploadErrHandler, sanitizeHtml } = require('../../helpers/utilities');
const userValidator = require('../../validators/user.validator');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const me = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;

    const profile = await db.queryPlaceholdersAsync(
        " SELECT id, name, email, username, phone, gender, shortBio, dob, place_of_birth, love, bio, role, teamID, avatar, cover, money, createAt, premiumTime, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE id = ? LIMIT 1",
        [uid]
    )

    const result = profile[0];
    result.avatar = `${AWS_S3_HOST_NAME}/${result.avatar}`;
    result.cover = `${AWS_S3_HOST_NAME}/${result.cover}`;
    const team = await db.queryPlaceholdersAsync(
        "SELECT id, name, url FROM team WHERE id = ?",
        [result.teamID]
    );
    delete result.teamID;
    result.edit = false;
    result.team = team[0];
    res.send(result);
})

const updateProfile = AsyncCatch(async (req, res, next) => {
    let { name, gender, love, dob } = validator(userValidator(['name', 'gender', 'love', 'dob']), req.body);
    let { shortBio, placeOfBirth, bio } = req.body;

    const user = await db.queryPlaceholdersAsync(
        "SELECT id, name, shortBio, gender, dob, place_of_birth, love, bio FROM user WHERE id = ? LIMIT 1",
        [req.userData.id]
    );

    name = name ?? sanitizeHtml(user[0].name);
    shortBio = shortBio ?? user[0].shortBio;
    gender = gender ?? user[0].gender;
    dob = dob ?? user[0].dob;
    placeOfBirth = placeOfBirth ?? user[0].placeOfBirth;
    love = love ?? user[0].love;
    bio = bio ?? user[0].bio;

    await db.queryPlaceholdersAsync(
        "UPDATE user SET name = ?, shortBio = ?, gender = ?, dob = ?, place_of_birth = ?, love = ?, bio = ? WHERE id = ?",
        [name, shortBio, gender, dob, placeOfBirth, love, bio, req.userData.id]
    );

    res.send("Success!");
})

const updateAvatar = AsyncCatch(async (req, res, next) => {
    try {
        if (!req.file) throw new BadRequest('Thiếu ảnh avatar!');
        // if (req.userData.avatar != "images/defaultAvatar.png") {
        //     fs.ensureFileSync(`${STORAGE_DIR}/${req.userData.avatar}`);
        //     fs.rmSync(`${STORAGE_DIR}/${req.userData.avatar}`);
        // }
        const path = `avatar/${uuidv4()}.jpeg`;
        await compress(req.file.buffer, `${STORAGE_DIR}/${path}`, { width: 90, height: 90 }).then(async () => {
            await db.queryPlaceholdersAsync(
                "UPDATE user SET avatar = ? WHERE id = ?",
                [path, req.userData.id]
            );
            res.send("Success!");
        })
            .catch(err => { throw err })
    } catch (error) {
        next(error);
    }
})


const updateCover = AsyncCatch(async (req, res, next) => {
    try {
        if (!req.file) throw new BadRequest('Thiếu ảnh cover!');
        if (req.userData.cover != "cover/profile.jpeg") {
            fs.ensureFileSync(`${STORAGE_DIR}/${req.userData.cover}`);
            fs.rmSync(`${STORAGE_DIR}/${req.userData.cover}`);
        }
        const path = `cover/${uuidv4()}.jpeg`;
        const realPath = `${STORAGE_DIR}/${path}`;
        await compress(req.file.buffer, realPath).then(async () => {
            await db.queryPlaceholdersAsync(
                "UPDATE user SET cover = ? WHERE id = ?",
                [path, req.userData.id]
            );
            res.send("Success!");
        })
            .catch(err => { throw err; })
    } catch (error) {
        next(error);
    }
})

const changePassword = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    const uinfo = await db.queryPlaceholdersAsync("SELECT password FROM user WHERE id = ?", [uid]);
    const { oldPass } = req.body;
    if (await compareHashString(oldPass, uinfo[0].password) == false) throw new BadRequest('Mật khẩu không đúng!');

    const { password } = validator(userValidator(['password']), req.body);

    db.queryPlaceholdersAsync("UPDATE user SET password = ? WHERE id = ?", [HashPassword(password), uid]);
    res.send("Success!");
})

const getNotificationOption = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    const u_config = await db.queryPlaceholdersAsync("SELECT manga, team, comment, web, comment_team, report_team, comment_like FROM user_config WHERE userID = ?", [uid]);
    const result = u_config[0];

    if (req.userData.role < 2) {
        delete result.comment_team;
        delete result.report_team;
    }
    res.send(result);
})

const setNotificationOption = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    let { manga, team, comment, web, comment_team, report_team, comment_like } = req.body;
    const u_config = await db.queryPlaceholdersAsync("SELECT manga, team, comment, web, comment_like, comment_team, report_team FROM user_config WHERE userID = ?", [uid]);

    manga = manga ?? u_config[0].manga;
    team = team ?? u_config[0].team;
    comment = comment ?? u_config[0].comment;
    web = web ?? u_config[0].web;
    comment_like = comment_like ?? u_config[0].comment_like;

    if (req.userData.role > 1) {
        comment_team = comment_team ?? u_config[0].comment_team;
        report_team = report_team ?? u_config[0].report_team;
    }
    else {
        comment_team = u_config[0].comment_team;
        report_team = u_config[0].comment_team;
    }

    await db.queryPlaceholdersAsync("UPDATE user_config SET manga = ?, team = ?, comment = ?, web = ?, comment_team = ?, report_team = ?, comment_like = ? WHERE userID = ?", [manga, team, comment, web, comment_team, report_team, comment_like, uid]);
    res.send("Success!");
})

const updateUsername = AsyncCatch(async (req, res, next) => {
    const { username } = validator(userValidator(['username']), req.body);

    const user = await db.queryPlaceholdersAsync("SELECT 1 FROM user WHERE username = ? AND id != ?", [username, req.userData.id]);
    if (user.length != 0) {
        throw new BadRequest("Username đã được sử dụng!");
    }

    await db.queryPlaceholdersAsync("UPDATE user SET username = ? WHERE id = ?", [username, req.userData.id]);
    res.send('Success!');
})

module.exports = {
    me,
    updateProfile,
    updateUsername,
    updateAvatar,
    updateCover,
    changePassword,
    getNotificationOption,
    setNotificationOption
}