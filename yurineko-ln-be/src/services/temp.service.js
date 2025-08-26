const { queryPlaceholdersAsync } = require("../db");
const fs = require('fs-extra');
const config = require("../config/config");

const removeTemp = async (paths = []) => {
    if (paths.length !== 0) {
        await queryPlaceholdersAsync(
            "DELETE FROM temp WHERE path IN (?)",
            [paths]
        )
    }
}

const removeFiles = (files = []) => {
    files.map(e => {
        const path = `${config.dir.storage}/${e}`;
        if (fs.existsSync(path) === true) {
            fs.rmSync(path);
        }
    })
}

const countTemp = async (files = []) => {
    const queryCount = await queryPlaceholdersAsync(
        "SELECT COUNT(*) AS tempCount FROM temp WHERE path IN (?)",
        [files]
    );

    return queryCount[0].tempCount;
}

module.exports = {
    removeFiles,
    removeTemp,
    countTemp
}