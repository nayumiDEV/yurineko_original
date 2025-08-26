const { AsyncCatch } = require("./utilities");
const db = require('../db');
const fs = require('fs-extra');
const { STORAGE_DIR } = require("../configs/env");

const dailyReset = AsyncCatch(async () => {
    try {
        await db.queryPlaceholdersAsync("UPDATE manga SET dailyView = 0");
        await db.queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset Daily TOP', 'reset_d')");
        const temp = await db.queryPlaceholdersAsync("SELECT path FROM temp WHERE createAt < CURRENT_TIMESTAMP()");
        temp.map(({ path }) => {
            fs.rmSync(`${STORAGE_DIR}/${path}`);
        });
    } catch (error) {
        console.error("Daily Reset: ", error);
    }
});
const weeklyReset = AsyncCatch(async () => {
    try {
        await db.queryPlaceholdersAsync("UPDATE manga SET weeklyView = 0");
        await db.queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset Weekly TOP', 'reset_w')");
    } catch (error) {
        console.error("Weekly Reset: ", error);
    }
})
const monthlyReset = AsyncCatch(async () => {
    try {
        await db.queryPlaceholdersAsync("UPDATE manga SET monthlyView = 0");
        await db.queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset Monthly TOP', 'reset_m')");
    } catch (error) {
        console.error("Monthly Reset: ", error);
    }
})

module.exports = {
    daily: dailyReset,
    weekly: weeklyReset,
    monthly: monthlyReset
}