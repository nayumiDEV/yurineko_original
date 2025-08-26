const { purgeCloudFlare, compress } = require("../../helpers/process");
const { BadRequest } = require("../../helpers/response");
const upload = require("../../helpers/upload");
const { AsyncCatch, validator } = require("../../helpers/utilities");
const teamValidator = require("../../validators/team.validator");
const { v4: uuidv4 } = require('uuid');
const db = require('../../db');
const { AWS_S3_HOST_NAME, HOST, STORAGE_DIR } = require("../../configs/env");
const fs = require("fs-extra");
const teamService = require('../../services/team.service');

const editTeamProfile = AsyncCatch(async (req, res, next) => {
    try {
        const tid = req.userData.teamID;
        const { url, description } = validator(teamValidator(['url', 'description']), req.body);
        const { social } = validator(teamValidator(['social']), { social: JSON.parse(req.body.social ?? '[]') });
        // const desc = description.replace(/\n/g, "<br />");
        const team = await db.queryPlaceholdersAsync("SELECT id, cover FROM team WHERE url = ?", [url]);
        if (team.length > 1 || (team.length === 1 && team[0].id !== tid)) throw new BadRequest("Url đã bị trùng!");

        await db.queryPlaceholdersAsync("UPDATE team SET url = ?, description = ? WHERE id = ?",
            [url, description, tid]
        );

        if (req.files.cover && req.files.cover[0]) {
            const oldPath = `${STORAGE_DIR}/${team[0].cover}`;
            const path = `team/${uuidv4()}.jpeg`;
            const newPath = `${STORAGE_DIR}/${path}`;
            await compress(req.files.cover[0].buffer, newPath).then(async err => {
                await db.queryPlaceholdersAsync("UPDATE team SET cover = ? WHERE id = ?",
                    [path, tid]);
                fs.ensureFileSync(oldPath);
                if (team[0].cover !== 'cover/team.jpeg') {
                    fs.rmSync(oldPath);
                }
            })
        }

        if (req.files.avatar && req.files.avatar[0]) {
            const oldPath = `${STORAGE_DIR}/${team[0].avatar}`;
            const path = `team/${uuidv4()}.jpeg`;
            const newPath = `${STORAGE_DIR}/${path}`;
            await compress(req.files.avatar[0].buffer, newPath).then(async err => {
                await db.queryPlaceholdersAsync("UPDATE team SET avatar = ? WHERE id = ?",
                    [path, tid]);
                fs.ensureFileSync(oldPath);
                if (team[0].avatar !== 'images/team.jpeg') {
                    fs.rmSync(oldPath);
                }
            })
        }

        if (social.length) {
            await db.queryPlaceholdersAsync("DELETE FROM team_social WHERE teamID = ?", [tid]);
            const linkToInsert = social.map(e => [tid, e.type, e.link]);
            await db.queryPlaceholdersAsync("INSERT INTO team_social(teamID, type, link) VALUES ?", [linkToInsert]);
        }

        res.send("Success!");
    } catch (error) {
        next(error);
    }
})

const infoTeamProfile = AsyncCatch(async (req, res, next) => {
    const tid = req.userData.teamID;
    const result = await db.queryPlaceholdersAsync(
        "SELECT name, url, avatar, cover, description FROM team WHERE id = ?",
        [tid]
    );
    result[0].avatar = `${AWS_S3_HOST_NAME}/${result[0].avatar}`;
    result[0].cover = `${AWS_S3_HOST_NAME}/${result[0].cover}`;
    result[0].social = await teamService.getTeamSocialLink(tid);
    res.send(result[0]);
})

module.exports = {
    edit: editTeamProfile,
    info: infoTeamProfile
}