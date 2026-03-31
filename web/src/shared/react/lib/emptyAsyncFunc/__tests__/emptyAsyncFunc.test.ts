import {emptyAsyncFunc} from '../emptyAsyncFunc'

describe('emptyAsyncFunc', () => {
    const context = 'TestContext'
    const fnName = 'someAsyncFn'

    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        })
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    it('should return an async function', () => {
        const fn = emptyAsyncFunc(context, fnName)
        expect(typeof fn).toBe('function')
        expect(fn.constructor.name).toBe('AsyncFunction')
    })

    it('should log context, functionName and args when called', async () => {
        const fn = emptyAsyncFunc(context, fnName)
        await fn(42, 'hello')

        expect(consoleSpy).toHaveBeenCalledWith(
            `${context}: not implemented async ${fnName} with args:`,
            [42, 'hello']
        )
    })

    it('should resolve to null by default', async () => {
        const fn = emptyAsyncFunc(context, fnName)
        const result = await fn('abc', 123)
        expect(result).toBeNull()
    })

    it('should typecast return value to generic <T>', async () => {
        const fn = emptyAsyncFunc<number>(context, fnName)
        const result = await fn('test')
        expect(result).toBeNull()

        const check: number = result
        expect(check).toBeNull()
    })
})
