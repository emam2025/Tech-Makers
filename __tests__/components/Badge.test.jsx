import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>نشط</Badge>);
    expect(screen.getByText('نشط')).toBeDefined();
  });

  it('applies default variant class', () => {
    render(<Badge>test</Badge>);
    const badge = screen.getByText('test');
    expect(badge.className).toContain('status-badge');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">مقبول</Badge>);
    const badge = screen.getByText('مقبول');
    expect(badge.className).toContain('active');
  });

  it('applies danger variant', () => {
    render(<Badge variant="danger">مرفوض</Badge>);
    const badge = screen.getByText('مرفوض');
    expect(badge.className).toContain('expired');
  });

  it('applies custom className', () => {
    render(<Badge className="custom">test</Badge>);
    const badge = screen.getByText('test');
    expect(badge.className).toContain('custom');
  });
});
