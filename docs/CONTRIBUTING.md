# Contributing to MarketProphet

## Branching Strategy (Git Flow)

```
main          ← production only, protected branch
  └── develop ← integration branch, all PRs merge here
        ├── feature/mp-12-lstm-training     ← new features
        ├── fix/mp-34-cors-error            ← bug fixes
        ├── chore/mp-45-update-deps         ← maintenance
        └── docs/mp-56-api-docs             ← documentation
```

### Branch Naming
```
feature/<ticket-id>-short-description
fix/<ticket-id>-short-description
chore/<ticket-id>-short-description
```

## Commit Messages (Conventional Commits)

```
feat(ml): add LSTM training pipeline for BTC
fix(api): resolve CORS error on /predict endpoint
chore(deps): bump tensorflow to 2.15.0
docs(readme): update local setup instructions
test(backend): add unit tests for data normalisation
refactor(frontend): extract PriceChart into reusable component
```

Format: `type(scope): description`
Types: `feat` | `fix` | `chore` | `docs` | `test` | `refactor` | `perf`

## Pull Request Process

1. Branch off `develop`, never off `main`
2. Keep PRs small — one feature or fix per PR
3. Fill in the PR template (auto-loaded from .github/)
4. All CI checks must pass before review
5. At least 1 approval required to merge
6. Squash and merge into develop

## Code Standards

### Python (Backend / ML)
- Formatter: `black` (line length 88)
- Linter: `flake8` + `isort` for imports
- Type hints required on all function signatures
- Docstrings required on all public functions

```python
# Good
def normalise_prices(prices: list[float], window: int = 60) -> np.ndarray:
    """
    Normalise price series using min-max scaling over a sliding window.

    Args:
        prices: Raw closing prices in chronological order.
        window: Number of timesteps per training sequence.

    Returns:
        Numpy array of shape (n_samples, window, 1) ready for LSTM input.
    """
    ...

# Bad — no types, no docstring
def normalise(p, w=60):
    ...
```

### TypeScript (Frontend)
- Formatter: `prettier`
- Linter: `eslint` with airbnb config
- No `any` types — define interfaces
- Components in PascalCase, hooks prefixed with `use`

```tsx
// Good
interface PriceChartProps {
  historicalPrices: PricePoint[];
  predictedPrice: number;
  asset: AssetSymbol;
}

export const PriceChart: React.FC<PriceChartProps> = ({ ... }) => { ... }

// Bad
export default function chart(props: any) { ... }
```

## Local Development Checklist

Before opening a PR:
- [ ] `npm run lint` passes (frontend)
- [ ] `black --check .` passes (backend)
- [ ] `pytest` passes (backend)
- [ ] No hardcoded secrets or API keys
- [ ] `.env.example` updated if new env vars added
