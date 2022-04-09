# The Internationale Screeps Arena Bot

My Screeps: Arena bot.

## Usage

```bash
# NPM
npm install

# Rollup
npm install -g rollup

# Yarn
yarn

# Typings
npm install @types/screeps-arena --save-dev
```

- arenas are located in `src/arena_*`any folder you create in `src` with a name starting with `arena_` will result in a `main.mjs` in the `dist/arena_*` folder.
- Run `npm run build` to generate all arenas to `/dist/*`

- `npm run build` - everything is build, the player can change their arena to look at the specific `/dist/arena*` directory
  - this template produces the following as an example `/dist/alpha_capture_the_flag/main.mjs`
- `npm run build capture` - a specific arena is build, the player can change their arena to look at the specific `/dist/arena*` directory knowing only that arena was updated