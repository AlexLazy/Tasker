import React, { FC, useState, useEffect } from 'react';

import tinymce from 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/media';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/lists';

interface EditorProps {
  content?: string;
  disabled?: boolean;
  height: string | number;
  onEditorChange(congent: string): void;
}

const Editor: FC<EditorProps> = ({
  content,
  disabled = false,
  height,
  onEditorChange
}) => {
  const [editor, setEditor] = useState<tinymce.Editor | null>(null);

  useEffect(() => {
    !editor &&
      tinymce.init({
        selector: '#editor',
        plugins:
          'image table autolink link, charmap emoticons media hr lists advlist',
        toolbar:
          'undo redo | styleselect | bold italic | link image | numlist bullist | hr forecolor backcolor',
        height: height,
        setup: editor => {
          setEditor(editor);
          editor.on('keyup change', () => {
            onEditorChange(editor.getContent());
          });
        }
      });

    return () => {
      editor && editor.destroy();
    };
  }, [editor]);

  editor && (disabled ? editor.setMode('readonly') : editor.setMode('design'));

  return <textarea id='editor' defaultValue={content} />;
};

export default Editor;
