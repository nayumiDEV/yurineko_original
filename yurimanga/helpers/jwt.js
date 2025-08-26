
const { JWT_SECRET, JWT_TIMEOUT_DURATION } = require('../configs/env');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HashPassword = (password) => {
	const round = 10;
	const salt = bcrypt.genSaltSync(round);
	return bcrypt.hashSync(password, salt);
}
const signData = ({ id, role }) => {
	const jwtPayload = {
		id, role
	};
	const jwtData = {
		expiresIn: JWT_TIMEOUT_DURATION,
	};
	const secret = JWT_SECRET;
	let token = jwt.sign(jwtPayload, secret, jwtData);
	return token;
};
const compareHashString = async (currentString, originalString) => {
	const isCorrect = await bcrypt.compare(currentString, originalString);
	return isCorrect;
};
module.exports = {
	HashPassword,
	signData,
	compareHashString
};