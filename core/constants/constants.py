# ROLES
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
    image_url = 'https://picsum.photos/200/200'
    website = "https://example.com"
    industry = "Technology"
    size = "1-10"
    tagline = "Innovate. Create. Lead."
    address = 'Room No (602), Gandamar Residence, Gandamar Road, Mayangone Township, , Yangon, Myanmar'
    contact_email = "info@example.com"
    contact_phone = "555-123-4567"
    founded_date = "2010-05-15"