# Job Post Status Management System

## Overview

Your job posting system now has a comprehensive status management system that handles both manual and automatic job expiration. This document explains how to use the different status fields and methods.

## Status Fields

### 1. `job_post_status` (Manual Status)
- **Purpose**: Company/Admin controlled status
- **Values**: `active`, `expired`, `draft`, `pending`
- **Usage**: Companies can manually set job status

### 2. `last_application_date` (Automatic Expiration)
- **Purpose**: Date-based automatic expiration
- **Values**: Date field (nullable)
- **Usage**: Jobs automatically expire after this date

### 3. `is_accepting_applications` (Application Control)
- **Purpose**: Toggle application acceptance
- **Values**: Boolean
- **Usage**: Can temporarily stop applications without changing status

## Status Checking Logic

The system uses a **priority-based approach**:

1. **Manual Status Check**: If `job_post_status = 'expired'` → Job is expired
2. **Date-based Check**: If `last_application_date < today` → Job is expired
3. **Application Check**: If `is_accepting_applications = False` → Job cannot receive applications

## Model Methods

### New Methods Added to JobPost Model

```python
# Check if job is expired (manual or automatic)
job.is_expired()  # Returns True/False

# Check if job can effectively receive applications
job.is_effectively_active()  # Returns True/False

# Get the effective status (considers expiration)
job.get_effective_status()  # Returns 'active', 'expired', 'draft', or 'pending'
```

## Manager Methods

### Enhanced JobPost.objects Methods

```python
# Get jobs that can receive applications
JobPost.objects.effectively_active()

# Get all expired jobs (manual + automatic)
JobPost.objects.auto_expired()

# Original methods still work
JobPost.objects.active()    # Manual status = 'active'
JobPost.objects.expired()   # Manual status = 'expired'
JobPost.objects.draft()     # Manual status = 'draft'
JobPost.objects.pending()   # Manual status = 'pending'
```

## Serializer Fields

### Available Fields for API Responses

```python
# Boolean fields
is_expired        # True if job is expired (manual or automatic)
is_bookmarked     # True if current user bookmarked this job
is_applied        # True if current user applied to this job
is_new            # True if current user hasn't viewed this job

# Status fields
effective_status  # The actual status considering expiration
job_post_status   # The manual status set by company
```

## Usage Examples

### 1. For Job Seekers (Frontend)

```javascript
// Show job status badge
if (job.is_expired) {
    showStatusBadge('Expired', 'red');
} else if (job.effective_status === 'active') {
    showStatusBadge('Active', 'green');
} else {
    showStatusBadge(job.effective_status, 'yellow');
}

// Show user-specific indicators
if (job.is_bookmarked) showBookmarkIcon();
if (job.is_applied) showAppliedBadge();
if (job.is_new) showNewBadge();
```

### 2. For Job Listings (Backend)

```python
# Get jobs for job seeker listings
available_jobs = JobPost.objects.effectively_active()

# Get all jobs for company dashboard
company_jobs = JobPost.objects.filter(posted_by=company_admin)

# Get expired jobs for cleanup
expired_jobs = JobPost.objects.auto_expired()
```

### 3. For Company Dashboard

```python
# Show different job categories
active_jobs = JobPost.objects.filter(posted_by=user, job_post_status='active')
draft_jobs = JobPost.objects.filter(posted_by=user, job_post_status='draft')
expired_jobs = JobPost.objects.filter(posted_by=user).filter(
    Q(job_post_status='expired') | Q(last_application_date__lt=date.today())
)
```

## Status Scenarios

| Scenario | job_post_status | last_application_date | is_accepting_applications | Result |
|----------|-----------------|----------------------|---------------------------|---------|
| Normal Active Job | active | Future date | True | ✅ Can receive applications |
| Auto-Expired Job | active | Past date | True | ❌ Cannot receive applications |
| Manually Expired | expired | Future date | True | ❌ Cannot receive applications |
| Draft Job | draft | Future date | True | ❌ Cannot receive applications |
| Paused Job | active | Future date | False | ❌ Cannot receive applications |

## Frontend Implementation

### Job Card Component

```javascript
const JobCard = ({ job }) => {
  const getStatusBadge = () => {
    if (job.is_expired) {
      return <Badge color="red">Expired</Badge>;
    }
    if (job.effective_status === 'active') {
      return <Badge color="green">Active</Badge>;
    }
    return <Badge color="yellow">{job.effective_status}</Badge>;
  };

  const getUserIndicators = () => {
    return (
      <div className="user-indicators">
        {job.is_new && <Badge color="blue">New</Badge>}
        {job.is_bookmarked && <BookmarkIcon filled />}
        {job.is_applied && <Badge color="purple">Applied</Badge>}
      </div>
    );
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.title}</h3>
        {getStatusBadge()}
      </div>
      <div className="job-details">
        <p>{job.company_name}</p>
        <p>{job.location}</p>
        <p>{job.display_salary}</p>
      </div>
      {getUserIndicators()}
    </div>
  );
};
```

## Backend API Updates

### Views That Use New Logic

1. **JobSearchListAPIView** - Now uses `effectively_active()` queryset
2. **MatchedJobPostAPIView** - Uses `effectively_active()` for matching
3. **NewestJobPostAPIView** - Uses `effectively_active()` for recent jobs

### Updated Serializers

- `JobPostListSerializer` - Added `is_expired` and `effective_status` fields
- `JobPostDetailSerializer` - Added `is_expired` and `effective_status` fields

## Best Practices

### 1. For Job Seekers Views
- Always use `JobPost.objects.effectively_active()` for job listings
- Use `is_expired` field to show job status to users
- Use `effective_status` for detailed status display

### 2. For Company Views
- Use original manager methods (`active()`, `expired()`, etc.) for admin dashboards
- Allow companies to manually set `job_post_status` for full control
- Use `auto_expired()` to show jobs that need status updates

### 3. For Automatic Maintenance
- Run periodic tasks to update `job_post_status` for auto-expired jobs
- Consider email notifications for soon-to-expire jobs
- Implement cleanup for very old expired jobs

## Migration Considerations

The changes are backwards compatible:
- ✅ Existing API endpoints continue to work
- ✅ Existing queryset methods still function
- ✅ New fields are added without breaking existing code
- ✅ Default values ensure existing data works correctly

## Recommendation

**Use this approach for job status checking:**

1. **For job seekers**: Use `JobPost.objects.effectively_active()` and `is_expired` field
2. **For companies**: Use both `job_post_status` and `last_application_date` for control
3. **For APIs**: Include both `is_expired` and `effective_status` fields in responses
4. **For maintenance**: Run periodic tasks to sync statuses

This gives you the flexibility of manual control while providing automatic expiration based on dates.
