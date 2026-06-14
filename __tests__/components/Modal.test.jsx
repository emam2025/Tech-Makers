import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="تأكيد">
        <p>محتوى</p>
      </Modal>
    );
    expect(screen.getByText('تأكيد')).toBeDefined();
    expect(screen.getByText('محتوى')).toBeDefined();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="تأكيد">
        <p>محتوى</p>
      </Modal>
    );
    expect(screen.queryByText('تأكيد')).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="تأكيد">
        <p>محتوى</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('إغلاق'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="تأكيد">
        <p>محتوى</p>
      </Modal>
    );
    fireEvent.click(document.querySelector('.modal-overlay'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not close when content clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="تأكيد">
        <p>محتوى</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('محتوى'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="تأكيد" footer={<button>حفظ</button>}>
        <p>محتوى</p>
      </Modal>
    );
    expect(screen.getByText('حفظ')).toBeDefined();
  });
});
