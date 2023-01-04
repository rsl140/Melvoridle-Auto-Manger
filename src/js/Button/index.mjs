export default function XButton (props) {
  return {
    $template: '#x-slayer-btn',
    dialog: props.dialog,
    handleClick () {
      this.dialog.open();
    }
  };
}