import {compose} from '../compose'

function add_3(num: number): number {
    return num + 3
}

function multiply_4(num: number): number {
    return num * 4
}

const initialNumberValue = 2
const expectedNumberValue_case_1 = 11
const expectedNumberValue_case_2 = 20

function add_a(str: string): string {
    return str + 'a'
}

function mult_4(str: string): string {
    return str + str + str + str
}

const initialStringValue = 'b'
const expectedStringValue_case_1 = 'bbbba'
const expectedStringValue_case_2 = 'babababa'

describe('compose function', () => {
    it('compose works with numbers | case 1', () => {
        expect(compose(add_3, multiply_4)(initialNumberValue)).toBe(expectedNumberValue_case_1)
    })

    it('compose works with numbers | case 2', () => {
        expect(compose(multiply_4, add_3)(initialNumberValue)).toBe(expectedNumberValue_case_2)
    })

    it('compose works with string | case 1', () => {
        expect(compose(add_a, mult_4)(initialStringValue)).toBe(expectedStringValue_case_1)
    })

    it('compose works with string | case 2', () => {
        expect(compose(mult_4, add_a)(initialStringValue)).toBe(expectedStringValue_case_2)
    })
})
