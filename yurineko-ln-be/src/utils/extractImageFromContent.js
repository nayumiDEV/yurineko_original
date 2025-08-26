const config = require("../config/config");

const imageUrlRegex = new RegExp(`^${config.host.storage}/storage/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}.jpeg$`);
const slicePath = (url) => url.slice(config.host.storage.length + 1);

/**
 * Extract image of yurineko in content and get its path
 * @param {*} content 
 * @returns {Array<String>}
 */
module.exports = ({ blocks = [] }) => {
    const paths = [];
    blocks.map(e => {
        if (e.type === "image" && imageUrlRegex.test(e.data.file.url)) {
            paths.push(slicePath(e.data.file.url));
        }
    })

    return paths;
}