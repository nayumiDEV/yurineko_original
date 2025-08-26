require("dotenv").config();

const amqp = require("amqp-connection-manager");

const connection = amqp.connect([process.env.RABBITMQ_URL]);

const channelWrapper = connection.createChannel({
    json: true,
    setup: function (channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        // Note that `this` here is the channelWrapper instance.
        return channel.assertQueue("yurineko::notification::::", {
            durable: true,
        });
    },
});

module.exports = {
    sendToNotificationQueue: async (data) =>
        channelWrapper.sendToQueue("yurineko::notification::::", {
            pattern: {
                cmd: "create-notification",
            },
            data: data,
        }),
};
