const { queryPlaceholdersAsync } = require("../db");
const { sanitizeHtml } = require("../helpers/utilities");
const webpush = require("../helpers/push");
const { sendToNotificationQueue } = require("../services/notification.service");

module.exports = class Notification {
    subscriber = [];
    notificationId = null;

    constructor({
        type,
        title,
        body,
        url,
        objectId,
        senderId = 0,
        thumbnail,
        icon = "",
    }) {
        this.type = type;
        this.title = title;
        this.body = body;
        this.objectId = objectId;
        this.senderId = senderId;
        this.url = url;
        this.thumbnail = thumbnail;
        this.icon = icon;
    }

    findSubscriber = async () => {
        try {
            let result = [];
            switch (this.type) {
                case "test":
                    this.subscriber = [this.objectId];
                    return;
                    break;

                // - Publish notification
                case "TEAM_FOLLOWING_MANGA_PUBLISH":
                    result = await queryPlaceholdersAsync(
                        "SELECT ts.userID AS id FROM team_subscribe ts JOIN (SELECT teamID FROM manga_team WHERE mangaID = ?) mt ON ts.teamID = mt.teamID",
                        [this.objectId]
                    );
                    break;
                case "ln_publish":
                    result = await queryPlaceholdersAsync(
                        "SELECT ts.userID AS id FROM team_subscribe ts JOIN (SELECT teamID FROM ln_team WHERE lnID = ?) mt ON ts.teamID = mt.teamID",
                        [this.objectId]
                    );
                    break;

                //- New chapter notification
                case "MANGA_FOLLOWING_NEW_CHAPTER":
                    result = await queryPlaceholdersAsync(
                        "SELECT ms.userID AS id FROM manga_subscribe ms JOIN chapter ch ON ms.mangaID = ch.mangaID WHERE ch.id = ?",
                        [this.objectId]
                    );
                    break;
                case "ln_new_chapter":
                    result = await queryPlaceholdersAsync(
                        "SELECT ls.userID AS id FROM ln_subscribe ls JOIN lchapter ch ON ms.lnID = ch.lnID WHERE ch.id = ?",
                        [this.objectId]
                    );
                    break;

                //- Reply owner notification
                case "manga_comment_reply":
                    result = await queryPlaceholdersAsync(
                        "SELECT c.userID AS id FROM comment c WHERE AND c.id = ? LIMIT 1",
                        [this.objectId]
                    );
                    break;
                case "ln_comment_reply":
                    result = await queryPlaceholdersAsync(
                        "SELECT c.userID AS id FROM lcomment c WHERE AND c.id = ? LIMIT 1",
                        [this.objectId]
                    );
                    break;

                //- Reply comment followers notification
                case "manga_comment_reply_following":
                    result = await queryPlaceholdersAsync(
                        "SELECT DISTINCT c.userID AS id FROM comment c WHERE c.replyID = ? AND c.userID != (SELECT cc.userID FROM comment cc WHERE cc.id = ?)",
                        [this.objectId, this.objectId]
                    );
                    break;
                case "ln_comment_reply_following":
                    result = await queryPlaceholdersAsync(
                        "SELECT DISTINCT c.userID AS id FROM lcomment c WHERE c.replyID = ? AND c.userID != (SELECT cc.userID FROM lcomment cc WHERE cc.id = ?)",
                        [this.objectId, this.objectId]
                    );
                    break;

                //- Like comment notification
                case "manga_comment_like":
                    result = await queryPlaceholdersAsync(
                        "SELECT c.userID AS id FROM comment c WHERE c.id = ? LIMIT 1",
                        [this.objectId]
                    );
                    break;
                case "ln_comment_like":
                    result = await queryPlaceholdersAsync(
                        "SELECT c.userID AS id FROM lcomment c WHERE c.id = ? LIMIT 1",
                        [this.objectId]
                    );
                    break;

                //- Comment to team manga/ln notification
                case "manga_comment_team":
                    result = await queryPlaceholdersAsync(
                        "SELECT u.id FROM user u JOIN manga_team mt ON u.teamID = mt.teamID WHERE mt.mangaID = ?",
                        [this.objectId]
                    );
                    break;
                case "ln_comment_team":
                    result = await queryPlaceholdersAsync(
                        "SELECT u.id FROM user u JOIN ln_team mt ON u.teamID = mt.teamID WHERE mt.lnID = ?",
                        [this.objectId]
                    );
                    break;

                //- Report
                // case "manga_report_team":
                //   result = await queryPlaceholdersAsync("SELECT u.id FROM user u JOIN manga_team mt ON u.teamID = mt.teamID JOIN (SELECT mangaID FROM log_report_error WHERE chapterID = ?) r ON mt.mangaID = c.mangaID JOIN user_config uc ON u.id = uc.userID WHERE uc.report_team = 1", [this.objectId]);
                //   break;
                // case "ln_report_team":
                //   result = await queryPlaceholdersAsync("SELECT u.id FROM user u JOIN manga_team mt ON u.teamID = mt.teamID JOIN (SELECT mangaID FROM log_report_error WHERE chapterID = ?) r ON mt.mangaID = c.mangaID JOIN user_config uc ON u.id = uc.userID WHERE uc.report_team = 1", [this.objectId]);
                //   break;
            }
            this.subscriber = result
                .filter((e) => e.id != this.senderId)
                .map((e) => e.id);
        } catch (error) {
            console.error("Notification.findSubscribeUser: ", error);
            throw error;
        }
    };

    /*
    export interface CreateNotificationDto {
        receiptentId: number[];

        mTitle: string;

        mBody: string;

        mType: NotificationType;

        mUrl: string;

        mIcon: NotificationIcon;

        mImage: string;

        mObjectId?: number;

        mSenderId?: number;
    }
*/

    save = async () => {
        try {
            if (this.subscriber.length === 0) {
                await this.findSubscriber();
            }

            if (this.subscriber.length !== 0) {
                await sendToNotificationQueue({
                    receiptentId: this.subscriber,
                    mTitle: this.title,
                    mBody: this.body,
                    mType: this.type,
                    mUrl: this.url,
                    mIcon: this.icon,
                    mImage: this.thumbnail,
                    mObjectId: this.objectId,
                    mSenderId: this.senderId,
                });
                const notification = await queryPlaceholdersAsync(
                    "CALL CREATE_NOTIFICATION( ?, ?, ?, ?, ?, ?, ?, ? )",
                    [
                        this.title,
                        this.body,
                        this.url,
                        this.type,
                        this.objectId,
                        this.senderId,
                        this.thumbnail,
                        this.icon,
                    ]
                );
            }
        } catch (error) {
            console.error("Notification.save: ", error);
            throw error;
        }
    };
};
