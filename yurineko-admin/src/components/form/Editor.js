import React, { useEffect } from "react";
import "draft-js/dist/Draft.css";
import ReactQuill from "react-quill";
// import dynamic from 'next/dynamic'
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function Editor({ onChange, value }) {
  const [text, setText] = React.useState("");
  useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);

  function handleChange(value) {
    setText(value);
    onChange(value);
    // console.log(text)
  }
  return <ReactQuill value={text} onChange={handleChange} className="bg-white"/>;
}
