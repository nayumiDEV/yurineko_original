import reactStringReplace from "react-string-replace"

const BASE_STORAGE = process.env.BASE_STORAGE;
const BASE_HOST = process.env.BASE_HOST;

function getUserMentionSpan(mentionUser = [], userId) {
  const mentionedUser = mentionUser.find((user) => user.mId === parseInt(userId));
  if (!mentionedUser) return <></>;
  return <a href={`${BASE_HOST}/profile/${userId}`} className="">
    <span className="bg-pink-200 px-1 rounded-sm font-semibold text-gray-600 mention__text">
      @{mentionedUser?.mName}
    </span>
  </a>
}

export default function parseComment(comment = "", mentionUser = []) {
  let component = reactStringReplace(comment, /<@#(\d+)>/g, (match) => getUserMentionSpan(mentionUser, match));
  component = reactStringReplace(component, /\[\*(\d+)\*\]/g, (match) => <img src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${match}.gif`} alt="emoji" className="inline-sticker" />);
  return component;
}
