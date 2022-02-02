interface e
{
    a: [number, string];
    b: [string];
    c: [string, number];
}

let x = <K extends keyof e>(e: K, ec: (...e: e[K]) => void) => {

};

x("a", (n, s) => {

});