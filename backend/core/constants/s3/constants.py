class FILE_TYPES:
     RESUME = 'resume'
     APPLICATION_RESUME = 'application_resume'
     PROFILE_IMAGE = 'profile_image'
     COVER_LETTER = 'cover_letter'
     COMPANY_LOGO = 'company_logo'
     COMPANY_ENVIRONMENT = 'company_environment'
     PROJECT_IMAGE = 'project_image'
     
class ALLOWED_CONTENT_TYPES:
     DOCUMENT = [
          # PDF
          "application/pdf",
          "application/x-pdf",
          "application/acrobat",
          "applications/vnd.pdf",
          "text/pdf",
          "text/x-pdf",

          # Microsoft Word (old .doc)
          "application/msword",
          "application/doc",
          "application/ms-doc",

          # Microsoft Word (new .docx)
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

          # Plain text
          "text/plain",
          "application/txt"
     ]
     IMAGE = [
          'image/jpeg', 
          'image/jpg', 
          'image/png', 
          'image/webp',
          'image/svg+xml',
     ]

class FILE_SIZE_LIMITS:
    # Sizes in bytes (1 MB = 1024 * 1024)
    PROFILE_IMAGE = 3 * 1024 * 1024     # 3 MB
    PROJECT_IMAGE = 3 * 1024 * 1024     # 3 MB
    COVER_LETTER = 3 * 1024 * 1024      # 3 MB
    RESUME = 5 * 1024 * 1024            # 5 MB

class UPLOAD_MAPPER:     
     TYPE_MAP = {
          FILE_TYPES.PROFILE_IMAGE: {
               'content_types': ALLOWED_CONTENT_TYPES.IMAGE,
               'max_size': FILE_SIZE_LIMITS.PROFILE_IMAGE
          },
          FILE_TYPES.RESUME: {
               'content_types': ALLOWED_CONTENT_TYPES.DOCUMENT,
               'max_size': FILE_SIZE_LIMITS.RESUME
          },
          FILE_TYPES.APPLICATION_RESUME: {
               'content_types': ALLOWED_CONTENT_TYPES.DOCUMENT,
               'max_size': FILE_SIZE_LIMITS.RESUME
          },
          FILE_TYPES.COVER_LETTER: {
               'content_types': ALLOWED_CONTENT_TYPES.DOCUMENT,
               'max_size': FILE_SIZE_LIMITS.COVER_LETTER
          },
          FILE_TYPES.PROJECT_IMAGE: {
               'content_types': ALLOWED_CONTENT_TYPES.IMAGE,
               'max_size': FILE_SIZE_LIMITS.PROJECT_IMAGE
          },
     }

OVERRIDE_FILE_TYPES = [
     FILE_TYPES.PROFILE_IMAGE,
     FILE_TYPES.RESUME
]

class UPLOAD_STATUS:
     PENDING = 'pending'
     PENDING_APPLICATION = 'pending_application'
     CANCELLED = 'cancelled'
     UPLOADED = 'uploaded'
     FAILED = 'failed'
     DELETED = 'deleted'
     DELETION_FAILED = 'deletion_failed'
     ORPHANED = 'orphaned'
     MARKED_FOR_DELETION = 'marked_for_deletion'