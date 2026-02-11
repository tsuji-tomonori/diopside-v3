import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedTags } from '../SelectedTags';

describe('SelectedTags', () => {
  test('renders nothing when tags array is empty', () => {
    const { container } = render(<SelectedTags tags={[]} onToggle={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders chips with data-on="true" for selected tags', () => {
    render(<SelectedTags tags={['企画', 'トーク']} onToggle={() => {}} />);

    const chips = screen.getAllByRole('button');
    expect(chips).toHaveLength(2);

    // Each chip should have data-on="true" to indicate selected state
    chips.forEach((chip) => {
      expect(chip).toHaveAttribute('data-on', 'true');
    });
  });

  test('displays tag name with × symbol', () => {
    render(<SelectedTags tags={['企画']} onToggle={() => {}} />);

    const chip = screen.getByRole('button');
    expect(chip).toHaveTextContent('企画 ×');
  });

  test('calls onToggle when chip is clicked', async () => {
    const user = userEvent.setup();
    const toggled: string[] = [];

    render(<SelectedTags tags={['企画', 'トーク']} onToggle={(t) => toggled.push(t)} />);

    await user.click(screen.getByText(/企画/));
    expect(toggled).toEqual(['企画']);

    await user.click(screen.getByText(/トーク/));
    expect(toggled).toEqual(['企画', 'トーク']);
  });

  test('has correct aria-label for accessibility', () => {
    render(<SelectedTags tags={['企画']} onToggle={() => {}} />);

    const container = screen.getByLabelText('選択中のタグ');
    expect(container).toBeInTheDocument();
  });
});
