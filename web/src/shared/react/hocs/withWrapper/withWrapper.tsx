import {WithWrapper} from './interfaces'

/** The function returns HOC included target Wrapper component*/
export const withWrapper: WithWrapper = (Wrapper) => {
    return function (Component) {
        return function (props) {
            return (
                <Wrapper {...props}>
                    <Component {...props} />
                </Wrapper>
            )
        }
    }
}
