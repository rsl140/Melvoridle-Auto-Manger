export default function XButton (props) {
  return {
    $template: '#x-slayer-btn',
    lang: props.lang,
    dialog: props.dialog,
    handleClick () {
      this.dialog.open();
    }
  };
}