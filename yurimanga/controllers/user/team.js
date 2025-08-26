const { PAGE_SIZE, AWS_S3_HOST_NAME } = require('../../configs/env');
const db = require('../../db')
const { AsyncCatch, validator, pagination } = require('../../helpers/utilities')
const teamValidator = require('../../validators/team.validator')

const listFollowTeam = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    const list = await db.queryPlaceholdersAsync(
        "SELECT id, name, url, cover, followCount follower FROM team, team_follow WHERE id = teamID AND userID = ? ORDER BY id DESC LIMIT ?, ?",
        [req.userData.id, SKIP, PAGE_SIZE]
    );

    const resultCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(1) AS resultCount FROM team, team_follow WHERE id = teamID AND userID = ?",
        [req.userData.id]
    );

    await Promise.all(list.map(async e => {
        const subscribe = await db.queryPlaceholdersAsync("SELECT EXISTS(SELECT 1 FROM team_subscribe WHERE userID = ? AND teamID = ?) AS subscribe",
            [req.userData.id, e.id]);
        e.cover = `${AWS_S3_HOST_NAME}/${e.cover}`;
        e.subscribe = subscribe[0].subscribe;
        e.follow = true;
    }));

    const data = {};
    data.list = list;
    data.resultCount = resultCount[0].resultCount;

    res.send(data);
})

const followTeam = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.body);
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("INSERT INTO team_follow (userID, teamID) VALUES(?, ?)", [uid, id]);
    await db.queryPlaceholdersAsync("UPDATE team SET followCount = followCount + 1 WHERE id = ?", [id]);
    res.send("Success!");
})

const unfollowTeam = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.body);
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("DELETE FROM team_follow WHERE userID = ? AND teamID = ?", [uid, id]);
    await db.queryPlaceholdersAsync("UPDATE team SET followCount = followCount - 1 WHERE id = ?", [id]);
    res.send("Success!");
})

const subscribeTeam = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.body);
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("INSERT INTO team_subscribe (userID, teamID) VALUES(?, ?)", [uid, id]);
    res.send("Success!");
})

const unsubscribeTeam = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.body);
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("DELETE FROM team_subscribe WHERE userID = ? AND teamID = ?", [uid, id]);
    res.send("Success!");
})

module.exports = {
    listFollow: listFollowTeam,
    follow: followTeam,
    unfollow: unfollowTeam,
    subscribe: subscribeTeam,
    unsubscribe: unsubscribeTeam
}