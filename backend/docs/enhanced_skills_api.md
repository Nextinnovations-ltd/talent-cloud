# Enhanced Job Seeker Skills Update API

## Overview
The job seeker skills update endpoint now supports both existing skill IDs and creating new skills on-the-fly. This allows users to add skills that don't exist in the system yet.

## Endpoint
```
POST /job-seekers/skills/
```

## Request Format

### New Enhanced Format (Recommended)
```json
{
  "skill_list": [
    {
      "id": 1  // Existing skill by ID
    },
    {
      "title": "New Skill Name"  // Create new skill if doesn't exist
    },
    {
      "id": 5  // Another existing skill
    },
    {
      "title": "Docker Containerization"  // Another new skill
    }
  ]
}
```

### Backward Compatibility Format (Still Supported)
```json
{
  "skill_list": [
    1,  // Existing skill ID
    "New Skill Name",  // Will create new skill
    5   // Another existing skill ID
  ]
}
```

## Response Format
```json
{
  "success": true,
  "message": "Successfully updated job seeker skills.",
  "data": {
    "skill_ids": [1, 15, 5, 16],  // All assigned skill IDs
    "created_skills": [            // Newly created skills
      {
        "id": 15,
        "title": "New Skill Name"
      },
      {
        "id": 16,
        "title": "Docker Containerization"
      }
    ],
    "total_skills": 4              // Total number of skills assigned
  }
}
```

## Features

### 1. **Duplicate Prevention**
- If a skill title already exists (case-insensitive), it will use the existing skill instead of creating a duplicate
- Example: "React" and "react" will be treated as the same skill

### 2. **Flexible Input**
- Accepts both objects with `id` or `title` properties
- Accepts simple integers (skill IDs) for backward compatibility
- Accepts simple strings (skill titles) for backward compatibility

### 3. **Atomic Operations**
- All updates happen within a database transaction
- If any skill fails to create or assign, the entire operation is rolled back

### 4. **Clear Feedback**
- Response includes which skills were newly created
- Total count of skills assigned
- List of all skill IDs assigned to the user

## Error Handling

### Invalid Skill ID
```json
{
  "success": false,
  "message": "Skill with ID 999 does not exist"
}
```

### Invalid Data Format
```json
{
  "success": false,
  "message": "Each skill must have either 'id' or 'title'"
}
```

### Missing Data
```json
{
  "success": false,
  "message": "Invalid skill data format"
}
```

## Migration Guide for Frontend

### Before (Old Format)
```javascript
const skillData = {
  skill_list: [1, 2, 3]  // Only existing skill IDs
};
```

### After (New Format)
```javascript
const skillData = {
  skill_list: [
    { id: 1 },                    // Existing skill
    { id: 2 },                    // Existing skill
    { title: "New Custom Skill" } // New skill to be created
  ]
};
```

### Backward Compatibility
The old format still works, but you can now mix in new skills:
```javascript
const skillData = {
  skill_list: [
    1,                           // Old format: existing skill ID
    { id: 2 },                   // New format: existing skill
    "Custom New Skill",          // Old format: will create new skill
    { title: "Another New Skill" } // New format: create new skill
  ]
};
```

## Implementation Notes

1. **Skill Creation**: New skills are created with just the title. Additional properties can be added later if needed.

2. **Case Insensitive**: Skill title matching is case-insensitive to prevent duplicates like "JavaScript" and "javascript".

3. **Whitespace Handling**: Skill titles are trimmed of leading/trailing whitespace.

4. **Performance**: The method efficiently handles both existing and new skills in a single database transaction.

5. **Validation**: Comprehensive validation ensures data integrity and provides clear error messages.
