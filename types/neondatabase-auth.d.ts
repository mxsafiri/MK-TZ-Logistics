// Shim module declarations for @neondatabase/auth subpath entries.
//
// The package ships type definitions as `.d.mts` files referenced via the
// `exports` map in its `package.json`. Our `tsconfig.json` uses
// `moduleResolution: "node"` (classic) which does not honour exports maps, so
// tsc cannot discover `@neondatabase/auth/next` or
// `@neondatabase/auth/next/server` on its own. We can't switch to `bundler`
// without breaking `@shipixen/pliny` subpath imports elsewhere in the repo, so
// we redirect the subpath specifiers to the physical `.d.mts` files here.
//
// Next.js's own bundler resolves the actual runtime modules correctly — this
// shim only exists to satisfy the TypeScript type checker.

declare module '@neondatabase/auth/next/server' {
  export * from '@neondatabase/auth/dist/next/server/index.d.mts';
}

declare module '@neondatabase/auth/next' {
  export * from '@neondatabase/auth/dist/next/index.d.mts';
}
