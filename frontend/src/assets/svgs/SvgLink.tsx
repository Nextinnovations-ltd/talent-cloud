const SvgLink = ({ size = 24, color = "#6B6B6B" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M13 6L15 4C16 3 18 3 19 4L20 5C21 6 21 8 20 9L15 14C14 15 12 15 11 14M11 18L9 20C8 21 6 21 5 20L4 19C3 18 3 16 4 15L9 10C10 9 12 9 13 10" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    )
}

export default SvgLink;