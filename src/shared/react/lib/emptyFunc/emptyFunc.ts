export function emptyFunc<T = any>(contextName: string, functionName: string) {
    return function (...args: any[]): T {
        console.log(`${contextName}: not implemented ${functionName} with args:`, args)
        return null as any
    }
}
