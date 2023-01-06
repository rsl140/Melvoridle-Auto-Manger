export default function Counter (props) {
  return {
    $template: '#x-dialog',
    modalShow: props.modalShow,
    modalID: props.modalID,
    modalTitle: props.modalTitle,
    modalContent: props.modalContent,
    close () {
      // $(`#${this.modalID}`).remove();
      this.modalShow = false
    },
    open () {
      this.modalShow = true
    },
    add () {
      this.modalContent = 'html';
    }
  };
}