const { isEmpty } = require('lodash');
const { AWS_S3_HOST_NAME } = require('../configs/env');
const db = require('../db');
const { listImageChapter } = require('../helpers/utilities');

class Manga {
    constructor(id) {
        this.id = id;
    }
    async listChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT id, name, mangaID, maxID FROM chapter WHERE mangaID = ? AND maxID > 0", [this.id]);

        list.sort((b, a) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
        });

        await Promise.all(list.map(async e => {
            e.url = listImageChapter(this.id, e.id, e.maxID);
        }))
        return list;
    }

    async minListChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT id, name, mangaID, maxID FROM chapter WHERE mangaID = ? AND maxID > 0", [this.id]);

        list.sort((b, a) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
        });

        return list;
    }

    async lastChapter() {
        const list = await db.queryPlaceholdersAsync("SELECT id, name, mangaID FROM chapter WHERE mangaID = ? AND maxID > 0", [this.id]);
        if (isEmpty(list)) return null;
        // list.sort((b, a) => {
        //     return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
        // });
        return list[list.length - 1];
    }

    async getTeam() {
        const result = await db.queryPlaceholdersAsync("SELECT t.id, t.name, t.url FROM team t, manga_team mt WHERE t.id = mt.teamID AND mt.mangaID = ? LIMIT 1", [this.id]);
        return result;
    }

    async getAuthor() {
        const result = await db.queryPlaceholdersAsync("SELECT id, name, url FROM author WHERE id in (SELECT authorID FROM manga_author WHERE mangaID = ?)", [this.id]);
        return result;
    }

    async getTag() {
        const result = await db.queryPlaceholdersAsync("SELECT id, name, url FROM tag WHERE id IN (SELECT tagID FROM manga_tag WHERE mangaID = ?)", [this.id])
        return result;
    }
    async getOrigin() {
        const result = await db.queryPlaceholdersAsync("SELECT id, name, url FROM origin WHERE id IN (SELECT originID FROM manga_origin WHERE mangaID = ?)", [this.id])
        return result;
    }
    async getCouple() {
        const result = await db.queryPlaceholdersAsync("SELECT id, name, url FROM couple WHERE id IN (SELECT coupleID FROM manga_couple WHERE mangaID = ?)", [this.id])
        return result;
    }
}


module.exports = Manga