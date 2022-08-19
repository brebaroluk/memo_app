import ReactMarkdown from "react-markdown";
import React from "react";

const Main = ({ activeNote, onUpdateNote }) => {
  const onEditField = (field, value) => {
    console.log(activeNote);
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: new Date(activeNote.lastModified),
    });
  };

  if (!activeNote) return <div className="no-active-note">No Active Memo</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Memo Title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your memo here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;
