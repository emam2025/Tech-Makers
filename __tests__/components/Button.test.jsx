import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>حفظ</Button>);
    expect(screen.getByText('حفظ')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>اضغط</Button>);
    fireEvent.click(screen.getByText('اضغط'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>حفظ</Button>);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
  });

  it('is disabled when loading', () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>حفظ</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with icon', () => {
    render(<Button icon="save">حفظ</Button>);
    expect(screen.getByText('save')).toBeDefined();
    expect(screen.getByText('حفظ')).toBeDefined();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="danger">حذف</Button>);
    expect(screen.getByText('حذف').className).toContain('danger');

    rerender(<Button variant="secondary">إلغاء</Button>);
    expect(screen.getByText('إلغاء').className).toContain('bg-[var(--color-surface)]');
  });

  it('can be disabled', () => {
    render(<Button disabled>حذف</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
