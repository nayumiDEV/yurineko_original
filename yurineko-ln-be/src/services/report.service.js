const { queryPlaceholdersAsync } = require("../db")

const createReport = async ({ chapterId, lightnovelId, type, detail }) => {
    await queryPlaceholdersAsync(
        "INSERT INTO ln_report(chapterID, lnID, type, detail) VALUES(?, ?, ?, ?)",
        [chapterId, lightnovelId, type, detail]
    );
}

const getReport = async (teamId, { skip, limit }) => {
    const result = await queryPlaceholdersAsync(
        "SELECT r.*, ln.originalName lightnovelName, c.name chapterName FROM ln_report r JOIN ln_team lt ON r.lnID = lt.lnID JOIN ln ON ln.id = r.lnID JOIN lchapter c ON c.id = r.chapterID WHERE lt.teamID = ? LIMIT ?, ?",
        [teamId, skip, limit]
    );

    const resultCount = await queryPlaceholdersAsync(
        "SELECT COUNT(*) AS resultCount FROm ln_report r JOIn ln_team lt ON r.lnID = lt.lnID WHERE lt.teamID = ?",
        [teamId]
    );

    return {
        result,
        resultCount: resultCount[0].resultCount
    }
}

module.exports = {
    create: createReport,
    get: getReport
}

