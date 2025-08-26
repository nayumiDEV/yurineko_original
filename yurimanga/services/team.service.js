const Manga = require("../class/manga");
const {
    AWS_S3_HOST_NAME
} = require("../configs/env")
const {
    queryPlaceholdersAsync
} = require("../db")

const getTeamSocialLink = async(teamId) =>{
    const result = await queryPlaceholdersAsync("SELECT type, link FROM team_social WHERE teamID = ?", [teamId]);
    return result;
}

const getTeamRanking = async (teamId, type, userId) => {
    const checkId = /^\d+$/.test(teamId);
    
    const result = await queryPlaceholdersAsync(
        `SELECT manga.id, originalName, thumbnail, ${type} as counter 
        FROM manga 
        LEFT JOIN 
            ( SELECT DISTINCT m.mangaID FROM manga_tag m 
                JOIN blacklist b 
                ON m.tagID = b.tagID 
                WHERE b.userID = ? ) bl 
            ON manga.id = bl.mangaID 
        JOIN manga_team mt 
            ON manga.id = mt.mangaID 
        JOIN team t 
            ON t.id = mt.teamID
        WHERE 
            ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) 
            AND bl.mangaID IS NULL
            AND (? = 0 AND url = ?) OR (? = 1 AND t.id = ?)
        ORDER BY ${type} DESC LIMIT 5`,
        [userId, checkId, teamId, checkId, teamId]
    );

    await Promise.all(result.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }));

    return result;
}

module.exports = {
    getTeamRanking,
    getTeamSocialLink
}