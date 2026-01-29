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
    expect(screen.getByRole('heading', { name: /transform your space with premium home fragrance\./i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /shop collection/i })).toBeTruthy();
  });

  it('renders key conversion sections', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /your journey to premium home fragrance/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /what makes scentiment different/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /what our customers say/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /everything you need to know/i })).toBeTruthy();
  });

  it('allows toggling FAQ items', () => {
    renderHome();
    const question = screen.getByRole('button', { name: /how fast is shipping\?/i });
    expect(question.getAttribute('aria-expanded')).toBe('false');
    const panelId = question.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    if (panelId) {
      const panel = document.getElementById(panelId);
      expect(panel?.className.includes('max-h-0')).toBe(true);
    }
    fireEvent.click(question);
    expect(question.getAttribute('aria-expanded')).toBe('true');
    if (panelId) {
      const panel = document.getElementById(panelId);
      expect(panel?.className.includes('max-h-96')).toBe(true);
    }
  });
});
