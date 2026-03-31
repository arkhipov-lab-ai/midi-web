export function emptyAsyncFunc<T = any>(contextName: string, functionName: string) {
    return async function (...args: any[]): Promise<T> {
        return new Promise<T>((resolve) => {
            console.log(`${contextName}: not implemented async ${functionName} with args:`, args)
            resolve(null as any)
        })
    }
}
