import * as yup from 'yup';


export const PortfolioYupSchema = yup.object({
    facebook_url: yup.string(),
    linkedin_url: yup.string(),
    behance_url: yup.string(),
    portfolio_url: yup.string(),
    github_url: yup.string()
})