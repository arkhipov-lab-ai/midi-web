import {emptyFunc} from '../emptyFunc'

describe('emptyFunc', () => {
    const context = 'TestContext'
    const fnName = 'someFn'

    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        })
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    it('should return a function', () => {
        const fn = emptyFunc(context, fnName)
        expect(typeof fn).toBe('function')
    })

    it('should log context, functionName and args when called', () => {
        const fn = emptyFunc(context, fnName)
        fn(1, 2, 3)

        expect(consoleSpy).toHaveBeenCalledWith(
            `${context}: not implemented ${fnName} with args:`,
            [1, 2, 3]
        )
    })

    it('should return null by default', () => {
        const fn = emptyFunc(context, fnName)
        const result = fn('abc', 123)
        expect(result).toBeNull()
    })

    it('should typecast return value to generic <T>', () => {
        const fn = emptyFunc<number>(context, fnName)
        const result = fn('x')
        expect(result).toBeNull()

        const check: number = result
        expect(check).toBeNull()
    })
})
