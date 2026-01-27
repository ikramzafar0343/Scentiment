import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  it('renders the hero value proposition and primary CTA', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /premium home fragrance, made effortless\./i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /browse collection/i })).toBeTruthy();
  });

  it('renders key conversion sections', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /from discovery to delight in 4 steps/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /everything you need to buy with confidence/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /trusted by customers who care about quality/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /answers to common questions/i })).toBeTruthy();
  });

  it('allows toggling FAQ items', () => {
    renderHome();
    const question = screen.getByRole('button', { name: /how fast is shipping\?/i });
    expect(question.getAttribute('aria-expanded')).toBe('false');
    const panelId = question.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    if (panelId) {
      const panel = document.getElementById(panelId);
      expect(panel?.className.includes('hidden')).toBe(true);
    }
    fireEvent.click(question);
    expect(question.getAttribute('aria-expanded')).toBe('true');
    if (panelId) {
      const panel = document.getElementById(panelId);
      expect(panel?.className.includes('hidden')).toBe(false);
    }
  });
});
