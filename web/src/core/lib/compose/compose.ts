type FunctionType<Arg, T> = (arg: Arg | T) => T;

/** The function combines many functions into one implementing them in reverse order */
export const compose = <Arg, T>(...functions: FunctionType<Arg, T>[]) => {
    return function (arg: Arg): Arg | T {
        let result: Arg | T = arg
        functions.reverse().forEach((func) => (result = func(result)))
        return result
    }
}
