export default function Counter(props) {
  return {
    $template: '#x-dialog',
    modalID: props.modalID,
    modalTitle: props.modalTitle,
    modalContent: props.modalContent,
    close() {
      $(`#${this.modalID}`).remove();
    },
    add() {
      this.modalContent = 'html';
    }
  };
}