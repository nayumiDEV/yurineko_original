const { default: axios } = require("axios")

const makeNotification = async (payload) => {
  try {
    await axios.post('https://api.yurineko.net/push', payload, {
      headers: {
        auth: '^?+C+5=LvF7$!R#ym$cxsF#K^2Ja3nu58Z@xT6UyyrY_sG2*ZP'
      }
    });
  } catch (error) {
    console.error("Notif Error: ", error);
  }
}

module.exports = makeNotification;
