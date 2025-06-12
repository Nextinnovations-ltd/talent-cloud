import { SVGProps } from 'react'

export type SVGElementProps = SVGProps<SVGSVGElement> & {
    active?: boolean
    activeColor?: string
    defaultColor?: string
}
