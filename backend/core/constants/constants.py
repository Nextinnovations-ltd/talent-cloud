class ROLES:
    ADMIN = 'admin'
    SUPERADMIN = 'superadmin'
    USER = 'user'

ROLE_CHOICE = {
    ROLES.SUPERADMIN: 1, 
    ROLES.ADMIN: 2,
    ROLES.USER: 3
}

ROLE_LIST = [ ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER ]

AUTO_GENERATED_USERNAME_PREFIX = 'tc_usn_'

# RESPONSE STATUS
SUCCESS = 'success'
FAILED = 'failed'
ERROR = 'error'

# Company

class PARENT_COMPANY:
    """
    Represents a parent company associated with admin/superadmin users.
    """
    name = 'Next Innovations'
    description = "We are a leading tech company specializing in innovative solutions."
    industry = "Technology"
    size = "1-10"
    tagline = "Innovate. Create. Lead."
    city = "389453"
    country = "1034"
    address = "Mayangone"
    contact_phone = "09-451663606"
    founded_date = "2020-05-05"
    contact_email = "talentcloud-contact@next-innovations.ltd"
    image_url = 'NI_Company_Info/ni_logo.png'
    cover_image_url = 'NI_Company_Info/ni_cover_image.jpeg'
    company_image_urls = [
        'NI_Company_Info/company_image_1.jpeg',
        'NI_Company_Info/company_image_1.jpeg',
        'NI_Company_Info/company_image_2.jpeg',
        'NI_Company_Info/company_image_2.jpeg'
    ]
    website = "http://next-innovations.ltd"
    facebook_url = "https://www.facebook.com/profile.php?id=61578628769861"
    linkedin_url = "https://www.linkedin.com/company/next-innovations2020"
    instagram_url = "https://www.instagram.com/next_innovations_myanmar"
    
class OAUTH_PROVIDERS:
    GOOGLE = 'google'
    GITHUB = 'github'
    LINKEDIN = 'linkedin'
    FACEBOOK = 'facebook'
    