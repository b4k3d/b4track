// Safe clipboard helpers. In some Android WebViews `navigator.clipboard` is
// undefined or its methods reject sync, which would crash a handler before it
// finishes (e.g. before the result modal renders). These wrappers never throw
// synchronously and always resolve — reads still reject (caught by callers).

export function clipboardWritable() {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

export function writeClipboardText(text) {
  try {
    if (!clipboardWritable()) return Promise.resolve();
    const result = navigator.clipboard.writeText(text);
    return result && typeof result.then === 'function'
      ? result.catch(() => {})
      : Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

export function clipboardReadable() {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard &&
    typeof navigator.clipboard.readText === 'function'
  );
}

export async function readClipboardText() {
  if (!clipboardReadable()) {
    throw new Error('Clipboard read not supported in this context');
  }
  return await navigator.clipboard.readText();
}