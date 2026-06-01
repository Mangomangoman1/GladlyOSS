# Contributing to Gladly

Thank you for helping make open source easier to join. Gladly is early enough that thoughtful improvements can shape the project in meaningful ways.

## Before you begin

- Use an existing issue when one fits your idea.
- Open a feature request before starting a large change.
- Keep pull requests focused enough to review comfortably.
- Be kind and constructive. Read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Local setup

```bash
git clone https://github.com/Mangomangoman1/GladlyOSS.git
cd GladlyOSS
npm install
npm run dev
```

## Verify your change

Run the full local checks before opening a pull request:

```bash
npm test -- --run
npm run check
npm run build
```

Include screenshots when changing the interface. Test both a desktop-sized window and a narrow mobile-sized window when your change affects layout.

## Where to contribute

Some especially useful areas:

- Add an audit rule with a clear rationale and test coverage.
- Improve a generated starter template.
- Add a report export format.
- Improve API error handling and rate-limit guidance.
- Tighten responsive behavior or accessibility.
- Prototype the local-folder CLI or GitHub Action from the roadmap.

## Pull requests

Explain the problem, the approach, and how you verified the result. Small pull requests are easier to review and more likely to land quickly.
