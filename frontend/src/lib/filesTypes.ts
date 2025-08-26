/* eslint-disable @typescript-eslint/ban-ts-comment */

const friendlyAllowed = "PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX";


  // File type configurations
  const fileTypeConfig = {
    resume: {
      label: 'Resume',
      accept: '.pdf,.doc,.docx',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedExtensions: ['pdf', 'doc', 'docx']
    },
    profile_photo: {
      label: 'Profile Photo',
      accept: '.jpg,.jpeg,.png,.gif',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
    },
    cover_letter: {
      label: 'Cover Letter',
      accept: '.pdf,.doc,.docx,.txt',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt']
    },
    company_logo: {
      label: 'Company Logo',
      accept: '.jpg,.jpeg,.png,.svg',
      maxSize: 1 * 1024 * 1024, // 1MB
      allowedExtensions: ['jpg', 'jpeg', 'png', 'svg']
    },
    job_attachment: {
      label: 'Job Attachment',
      accept: '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
    },
    document: {
      label: 'Document',
      accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']
    }
  };

    // Get correct MIME type based on file extension
    const getCorrectMimeType = (file: File): string => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
          // Images - be very specific about JPEG
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          // Documents
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'txt': 'text/plain',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        
        // For JPEG files, always return image/jpeg regardless of what the browser thinks
        if (extension === 'jpg' || extension === 'jpeg') {
          return 'image/jpeg';
        }
        
        //@ts-ignore
        return mimeTypes[extension] || file.type || 'application/octet-stream';
      };
    

// Validate file
const validateFile = (file:File) => {
    //@ts-ignore
    const config = fileTypeConfig[fileType];
     //@ts-ignore
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Check file extension
    if (!config.allowedExtensions.includes(fileExtension)) {
      throw new Error(`Invalid file type. Allowed: ${config.allowedExtensions.join(', ')}`);
    }

    // Check file size
    if (file.size > config.maxSize) {
      throw new Error(`File too large. Maximum size: ${(config.maxSize / (1024 * 1024)).toFixed(1)}MB`);
    }

    return true;
  };

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed MIME types + extensions
const ACCEPTED_TYPES = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "text/plain": [".txt"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
} as const;


  export default {fileTypeConfig,getCorrectMimeType,validateFile,MAX_SIZE,ACCEPTED_TYPES,friendlyAllowed};



