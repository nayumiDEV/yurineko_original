const { HOST } = require("../configs/env");
const db = require("../db");
const webpush = require("./push");

const CLIENT_URL = "https://yurineko2-client.herokuapp.com";

class notification {
  userSubscribe = [];

  constructor({ type, title, body, url = "", objectID = "" }) {
    this.type = type;
    this.title = title;
    this.body = body;
    this.objectID = objectID;
    this.url = HOST + url;
  }
  findUserSubscribe = async () => {
    try {
      let result = [];
      if (this.type == "web") {
        result = await db.queryPlaceholdersAsync("SELECT id from user");
      }
      if (this.type == "manga") {
        result = await db.queryPlaceholdersAsync(
          `SELECT l.userID as id from user_list l, user_config c where l.userID = c.userID AND c.manga = 1 AND l.listKey != "stop" AND l.mangaID = ?`,
          [this.objectID]
        );
      }
      if (this.type == 'team') {
        result = await db.queryPlaceholdersAsync(
          "SELECT ts.userID AS id FROM team_subscribe ts, user_config uc WHERE ts.userID = uc.userID AND ts.teamID = ? AND uc.team = 1",
          [this.objectID]
        );
      }
      if (this.type == "chapter") {
        result = await db.queryPlaceholdersAsync(
          "SELECT ms.userID id FROM manga_subscribe ms, user_config c WHERE ms.userID = c.userID AND c.manga = 1 AND ms.mangaID = ?",
          [this.objectID]
        )
      }
      if (this.type == "comment") {
        result = await db.queryPlaceholdersAsync("SELECT u.id FROM user u, user_config uc WHERE u.id = uc.userID AND uc.comment = 1 AND u.id = ? LIMIT 1",
          [this.objectID]);
      }

      if (this.type == "comment_team") {
        result = await db.queryPlaceholdersAsync(
          "SELECT u.id FROM user u, manga_team mt, user_config uc WHERE u.teamID = mt.teamID AND u.id = uc.userID AND uc.comment_team = 1 AND mt.mangaID = ?",
          [this.objectID]
        );
      }

      if (this.type == "comment_like") {
        result = await db.queryPlaceholdersAsync(
          "SELECT u.id FROM user u, user_config uc WHERE u.id = uc.userID AND uc.comment_like = 1 AND u.id = ? LIMIT 1",
          [this.objectID]
        );
      }

      this.userSubscribe = result.map((item) => item.id);
    } catch (err) {
      console.log(err);
      throw new Error("Không tìm thấy người nhận");
    }
  };

  save = async () => {
    try {
      if (this.userSubscribe.length == 0) {
        await this.findUserSubscribe();
      }
      const result = await db.queryPlaceholdersAsync(
        "INSERT into notification (title, body, url, type, objectID) VALUES (?, ?, ?, ?, ?)",
        [this.title, this.body, this.url, this.type, this.objectID]
      );
      return result.insertId;
      // await this.link(result.insertId);
    } catch (err) {
      console.log(err);
      throw new Error("Không thể thêm thông báo");
    }
  };

  link = async (notificationID) => {
    try {
      if (this.userSubscribe.length == 0) {
        await this.findUserSubscribe();
}
        if (this.userSubscribe.length != 0){
          await db.queryPlaceholdersAsync(
            `INSERT INTO user_notification (userID, notificationID) SELECT id, ${notificationID} from user u, user_config c where u.id = c.userID and u.id in (?)`,
            [this.userSubscribe]
          );
      }
      // console.log(result);
      // this.push();
    } catch (err) {
      console.log(err);
      throw new Error("Không thể thêm thông báo cho người dùng");
    }
  };
  push = async () => {
    try {
if(this.userSubscribe.length == 0){
	await this.findUserSubscribe();
}
if(this.userSubscribe.length != 0){  
      const result = await db.queryPlaceholdersAsync(
        `SELECT pushData from user_push where userID in (?)`,
        [this.userSubscribe]
      );
      result.map((item) => {
        const pushData = JSON.parse(item.pushData);
        webpush
          .sendNotification(
            pushData,
            JSON.stringify({
              title: this.title,
              body: this.body,
              url: this.url,
            })
          )
          .then((res) => console.log("thanh cong"))
          .catch(async (err) => {
            await db.queryPlaceholdersAsync(
              "DELETE FROM user_push where id = ?",
              [item.id]
            );
          });
      });
}
    } catch (err) {
      console.log(err);
      throw new Error("Không thể đẩy thông báo cho người dùng");
    }
  };
}

module.exports = notification;
