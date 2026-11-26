import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Chip, TextField, StatusMessage, Logo, SegmentedControl } from '../../index';

describe('Button', () => {
  it('fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders secondary and ghost variants', () => {
    const { rerender } = render(<Button variant="secondary">A</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    rerender(<Button variant="ghost">A</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('Chip', () => {
  it('renders children and a labelled remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Chip onRemove={onRemove} removeLabel="Remove cancer">
        cancer
      </Chip>,
    );
    expect(screen.getByText('cancer')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove cancer' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('renders without a remove button when no handler is given', () => {
    render(<Chip>plain</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('TextField', () => {
  it('associates the label, hint and error with the input', () => {
    render(<TextField id="f" label="Field" hint="a hint" error="an error" />);
    const input = screen.getByLabelText('Field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('a hint')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('an error');
  });
});

describe('StatusMessage', () => {
  it('uses role alert for errors', () => {
    render(<StatusMessage tone="error" role="alert" icon={<span />} title="Boom" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
  });
});

describe('Logo', () => {
  it('renders the EMBL-EBI wordmark', () => {
    render(<Logo />);
    expect(screen.getByText('EMBL-EBI')).toBeInTheDocument();
  });
});

describe('SegmentedControl', () => {
  it('renders options and marks the selected one', () => {
    render(
      <SegmentedControl
        label="Operator"
        value="AND"
        options={[
          { value: 'AND', label: 'AND' },
          { value: 'OR', label: 'OR' },
        ]}
        onChange={() => {}}
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Operator' });
    expect(within(group).getByRole('radio', { name: 'AND' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(within(group).getByRole('radio', { name: 'OR' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('calls onChange when a segment is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Operator"
        value="AND"
        options={[
          { value: 'AND', label: 'AND' },
          { value: 'OR', label: 'OR' },
        ]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole('radio', { name: 'OR' }));
    expect(onChange).toHaveBeenCalledWith('OR');
  });
});
