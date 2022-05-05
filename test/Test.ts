interface e {
  a: [number, string];
  b: [string];
  c: [string, number];
}

const x = <K extends keyof e>(e: K, ec: (...e: e[K]) => void) => {};

x("a", (n, s) => {
  
});
