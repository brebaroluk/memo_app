import React from "react";
import { useEffect, useState} from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import {memo_app_backend} from "../../../declarations/memo_app_backend/index"
import { Buffer } from 'buffer'
import LoadingSpinner from "./spinner/spinner";

function App() {
  window.global=window;
  window.buffer=Buffer
  const [raw_memos, setMemos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(-1);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getMemos()
  }, []);
  //fetching data from backend canister using get_all_memos method
  const getMemos = async () => {
    setLoading(true);
    const memos = await memo_app_backend.get_all_memos();
    setMemos(memos);
    const notes_array = memos.map((e)=>{
      return {
        id: Number(e.id),
        title: e.title,
        body: e.body,
        lastModified: new Date(Number(e.last_updated)/1000000),
      };
    });
    setNotes(notes_array);
    setLoading(false);
  };

  // handles add note
  const onAddNote = async () => {
    if(await controlUnsaved()){
      return;
    };
    const newNote = {
      id: uuid(),
      title: "Untitled Memo",
      body: "",
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };
  //handles save note
  //using the change_existing_memo method on backend canister
  const onSaveNote = async (id) => {
    if(getNoteWithId(id).title === "" || getNoteWithId(id).body === ""){ alert("Title or body can not be empty!"); return;};
    if(isNumber(id)){
      if(getMemoWithId(id).title === getNoteWithId(id).title && getMemoWithId(id).body === getNoteWithId(id).body){
        alert("You didn't make any change");
        return;
      };
      setLoading(true);
      await memo_app_backend.change_existing_memo(BigInt(id), getNoteWithId(id).title, getNoteWithId(id).body);
    }
    else{
      setLoading(true);
      await memo_app_backend.create_new_memo(getNoteWithId(id).title, getNoteWithId(id).body);
    };
    await getMemos();
    setActiveNote(-1);
    setLoading(false);
  };
  //Handles update WITHOUT contacting backend canister
  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }

      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getMemoWithId = (index) => {
    var i = 0;
    while(i < raw_memos.length){
      if(Number(raw_memos[i].id)===index){
        return raw_memos[i];
      };
      i+=1;
    };
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  const getNoteWithId = (noteId) => {
    return notes.find(({ id }) => id === noteId);
  };



  const isNumber = function isNumber(value) 
  {
    return typeof value === 'number' && isFinite(value);
  }


  //If there is any unsaved change, prompts to the user with questions
  const controlUnsaved = async () => {
    if(isNumber(activeNote)){
      if(activeNote!=-1){
        if(getMemoWithId(activeNote).title != getNoteWithId(activeNote).title || getMemoWithId(activeNote).body != getNoteWithId(activeNote).body){
          if(confirm("You have some unsaved changes. You want to save? IF YOU DON'T YOU WILL LOSE THE UNSAVED CHANGES!!!")){
            await onSaveNote(activeNote);
            return true;;
          }
          else{
            synchronize()
            setActiveNote(-1);
            return true;
          };
        };
      };
    }
    else{
      if(confirm("You have some unsaved changes. You want to save? IF YOU DON'T YOU WILL LOSE THE UNSAVED CHANGES!!!")){
        await onSaveNote(activeNote);
        return true;;
      }
      else{
        deleteActive();
        setActiveNote(-1);
        return true;
      };
    };
  };
  // handles some frontend stuff unprofessionally
  const synchronize = () =>{
    const memo_local = getMemoWithId(activeNote);
    const note_local = getNoteWithId(activeNote);
    note_local.title = memo_local.title;
    note_local.body = memo_local.body;
    var i = 0;
    var new_notes = []
    while(i<notes.length){
      if(notes[i].id===activeNote){new_notes.push(note_local)}
      else{new_notes.push(notes[i])};
      i+=1;
    };
    setNotes(new_notes);

  };

  const deleteActive = () =>{
    var i = 0;
    var new_notes = []
    while(i<notes.length){
      if(notes[i].id!=activeNote){new_notes.push(notes[i])}
      i+=1;
    };
    setNotes(new_notes);

  };

  const screen = (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onSaveNote={onSaveNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );

  return (
    <div>
      {isLoading ? <LoadingSpinner/> : screen}
    </div>
  );
}

export default App;
