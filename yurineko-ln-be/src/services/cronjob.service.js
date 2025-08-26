const { queryPlaceholdersAsync } = require("../db");

const dailyReset = async () => {
    try {
        await queryPlaceholdersAsync("UPDATE ln SET dailyView = 0");
        await queryPlaceholdersAsync("DELETE FROM history_ln WHERE lastRead < DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
        await queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset LN Daily TOP', 'reset_ln_d')");
    } catch (error) {
        console.error("Daily LN Reset: ", error);
    }
};

const weeklyReset = async () => {
    try {
        await queryPlaceholdersAsync("UPDATE ln SET weeklyView = 0");
        await queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset LN Weekly TOP', 'reset_ln_w')");
    } catch (error) {
        console.error("Weekly LN Reset: ", error);
    }
}

const monthlyReset = async () => {
    try {
        await queryPlaceholdersAsync("UPDATE ln SET monthlyView = 0");
        await queryPlaceholdersAsync("INSERT INTO log_process_server (description, param) VALUE ('Reset LN Monthly TOP', 'reset_ln_m')");
    } catch (error) {
        console.error("Monthly LN Reset: ", error);
    }
}

module.exports = {
    daily: dailyReset,
    weekly: weeklyReset,
    monthly: monthlyReset
}