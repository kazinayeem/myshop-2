import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";


function RichTextEditor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
      ["table"],
      ["color"],
      ["align"],
      ["direction"],
      ["clipboard"],
      ["code-block"],
      ["formula"],
      ["emoji"],
      ["video"],
      ["clear"],
      ["undo"],
      ["redo"],
      ["fullscreen"],
      ["code"],
      ["print"],
    ],
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Unmerge",
          },
        },
      },
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "table",
    "align",
    "direction",
    "clipboard",
    "code-block",
    "formula",
    "emoji",
    "video",
    "clear",
    "undo",
    "redo",
    "fullscreen",
    "code",
    "print",
    "better-table",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
}
export default RichTextEditor;
RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
