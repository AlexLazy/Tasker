import React, { Component } from "react";

import tinymce, { Editor as tinymceEditor } from "tinymce";
import "tinymce/themes/silver";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link";
import "tinymce/plugins/charmap";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/media";
import "tinymce/plugins/hr";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";

interface EditorProps {
  content?: string;
  height: string | number;
  onEditorChange(congent: string): void;
}

interface State {
  editor: tinymceEditor | null;
}

export default class Editor extends Component<EditorProps, State> {
  state: State = {
    editor: null,
  };

  componentDidMount() {
    tinymce.init({
      selector: "#editor",
      plugins:
        "image table autolink link, charmap emoticons media hr lists advlist",
      toolbar:
        "undo redo | styleselect | bold italic | link image | numlist bullist | hr forecolor backcolor",
      height: this.props.height,
      setup: (editor) => {
        this.setState({
          editor,
        });
        editor.on("keyup change setcontent", () => {
          this.props.onEditorChange(editor.getContent());
        });
      },
    });
  }

  componentWillUnmount() {
    if (this.state.editor !== null) {
      this.state.editor.destroy();
    }
  }

  render() {
    const { editor } = this.state;
    const { content } = this.props;
    editor && editor.setMode("design");
    return <textarea id="editor" defaultValue={content} />;
  }
}
