// Force NODE_ENV=test so React loads its development build.
// Next.js SWC inlines process.env.NODE_ENV as 'production' in compiled files,
// but non-compiled node_modules (react/index.js, etc.) read the actual runtime
// value — so we set it here before any modules are required.
process.env.NODE_ENV = 'test';
