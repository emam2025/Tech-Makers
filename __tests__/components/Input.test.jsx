import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/ui/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="الاسم" />);
    expect(screen.getByText('الاسم')).toBeDefined();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="أدخل الاسم" />);
    expect(screen.getByPlaceholderText('أدخل الاسم')).toBeDefined();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'أحمد' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input error="حقل مطلوب" />);
    expect(screen.getByText('حقل مطلوب')).toBeDefined();
  });

  it('renders with icon', () => {
    render(<Input icon="search" />);
    expect(screen.getByText('search')).toBeDefined();
  });

  it('can be disabled', () => {
    render(<Input disabled value="نص" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders required indicator', () => {
    render(<Input label="الاسم" required />);
    expect(screen.getByText('*')).toBeDefined();
  });
});
