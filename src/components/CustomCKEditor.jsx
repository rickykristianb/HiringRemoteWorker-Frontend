import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CustomCKEditor = ({data, onChange}) => {

    const backend = async() => {
        const response = await fetch("http://127.0.0.1:8000/ckeditor/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              // Add any additional headers as needed
          },
          body: JSON.stringify({ content: data }),
        })
    }

  return (
    <CKEditor
            editor={ClassicEditor}
            data={data}
            onChange={(event, editor) => {
                const newData = editor.getData();
                onChange(newData);
            }}
        />
  )
}

export default CustomCKEditor;