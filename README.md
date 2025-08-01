# Introduction

👋 A <b>fast eslint config boot</b> for `chanyuxi`.

😘 Thanks for [@antfu/eslint-config](https://github.com/antfu/eslint-config)

# Features

At present, the following modes are supported, and more features are under development

- ✅ Javascript
- ✅ Typescript
- ✅ Stylistic
- ✅ Json
- ✅ Import
- ✅ React
- 🕐 <i>Continuously updating...</i>

# Usage

#### Install

Install from `npm` | `pnpm` | `yarn`

```bash
npm i -D @chanyuxi/eslint-waltz
```        

#### Configuration

Create a `eslint.config.ts` file in the project root directory and configure it as follows:

```ts
import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
    // enable typescript lint
    ts: true,
})
```
