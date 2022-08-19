import React from "react";
const Sidebar = ({
  notes,
  onAddNote,
  onSaveNote,
  activeNote,
  setActiveNote,
}) => {
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Memos</h1>
        <button onClick={onAddNote}>New</button>
      </div>
      <div className="app-sidebar-notes">
        {sortedNotes.map(({ id, title, body, lastModified }, i) => (
          <div
            className={`app-sidebar-note ${id === activeNote && "active"}`}
            onClick={() => setActiveNote(id)}
          >
            <div className="sidebar-note-title">
              <strong>{title}</strong>
              <button className="sidebar-save-button" onClick={(e) => onSaveNote(id, title, body)}>Save</button>
            </div>

            <p>{body && body.substr(0, 100) + "..."}</p>
            <small className="note-meta">
              Last Modified{" "}
              {new Date(lastModified).toLocaleDateString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
            <strong className="note-meta">
              {(typeof id === 'number' && isFinite(id)) ? "#".concat(id) : "It is not created on motoko-canister so there is no id right now!"}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
