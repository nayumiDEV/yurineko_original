const db = require('../db');

class Lightnovel {
    constructor(id) {
        this.id = id;
    }
    async listChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT * FROM lchapter WHERE lnID = ? ORDER BY sequence DESC", [this.id]);
        return list;
    }

    async minListChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT id, name, updateAt FROM lchapter WHERE lnID = ? AND publish = 1 ORDER BY sequence DESC", [this.id]);
        return list;
    }

    async lastChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT id, name FROM lchapter WHERE lnID = ? AND publish = 1 ORDER BY sequence DESC LIMIT 1", [this.id]);
        if(list.length === 0) {
            return null;
        }
        return list[0];
    }

    async lastReadChapter() {
        const chapter = db.queryPlaceholdersAsync(
            "SELECT h.* FROM history h JOIN lchapter c ON h.chapterID = c.id WHERE h.lnID = ? LIMIT 1",
            [this.id]
        );

        return chapter[0] ?? null;
    }

    /**
     * Get tag/author/origin/couple by type input
     * @param {String} type 
     * @returns
     */
    async getTagByType(type = 'tag') {
        const result = await db.queryPlaceholdersAsync(`SELECT t.id, t.name, t.url FROM ${type} t JOIN ln_${type} l ON t.id = l.${type}ID WHERE l.lnID = ?`, [this.id]);
        return result;
    }
}


module.exports = Lightnovel