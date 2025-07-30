#!/usr/bin/env python
"""
Test script for the enhanced job seeker skills update functionality

This script demonstrates how the new skill update method handles:
1. Existing skill IDs
2. New skill titles (creates them if they don't exist)
3. Mixed data formats
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')
django.setup()

from apps.users.models import TalentCloudUser
from apps.job_seekers.models import JobSeekerSkill
from services.job_seeker.job_seeker_service import JobSeekerService

def test_enhanced_skills_update():
     """Test the enhanced skills update functionality"""
     print("🧪 Testing Enhanced Job Seeker Skills Update")
     print("=" * 50)
     
     # Get a job seeker user
     job_seeker_user = TalentCloudUser.objects.filter(
          role__name='user', 
          is_active=True
     ).first()
     
     if not job_seeker_user or not hasattr(job_seeker_user, 'jobseeker'):
          print("❌ No job seeker user found. Please create a job seeker user first.")
          return
     
     print(f"📧 Testing with job seeker: {job_seeker_user.email}")
     
     # Get some existing skills
     existing_skills = list(JobSeekerSkill.objects.all()[:2])
     print(f"📊 Found {len(existing_skills)} existing skills")
     
     # Test Case 1: Mixed data - existing IDs and new skill names
     print("\n🧪 Test Case 1: Mixed existing IDs and new skills")
     
     test_data = {
          "skill_list": [
               # Existing skill by ID
               {"id": existing_skills[0].id} if existing_skills else {"title": "Python"},
               # New skill by title
               {"title": "Advanced React Hooks"},
               # Another new skill
               {"title": "Docker Containerization"},
               # Existing skill by ID (if available)
               {"id": existing_skills[1].id} if len(existing_skills) > 1 else {"title": "JavaScript"},
               # Test duplicate prevention
               {"title": "Advanced React Hooks"},  # Should not create duplicate
          ]
     }
     
     try:
          result = JobSeekerService.perform_job_seeker_skills_update(
               job_seeker_user, 
               test_data
          )
          
          print("✅ Skills update successful!")
          print(f"📊 Total skills assigned: {result['data']['total_skills']}")
          print(f"🆕 New skills created: {len(result['data']['created_skills'])}")
          
          for created_skill in result['data']['created_skills']:
               print(f"   - Created: {created_skill['title']} (ID: {created_skill['id']})")
          
     except Exception as e:
          print(f"❌ Error: {str(e)}")
     
     # Test Case 2: Backward compatibility - simple ID list
     print("\n🧪 Test Case 2: Backward compatibility (simple ID list)")
     
     if existing_skills:
          backward_compat_data = {
               "skill_list": [existing_skills[0].id, "New Backend Skill"]
          }
          
          try:
               result = JobSeekerService.perform_job_seeker_skills_update(
                    job_seeker_user, 
                    backward_compat_data
               )
               
               print("✅ Backward compatibility test successful!")
               print(f"📊 Skills processed: {result['data']['total_skills']}")
               
          except Exception as e:
               print(f"❌ Error: {str(e)}")
     
     # Test Case 3: All new skills
     print("\n🧪 Test Case 3: All new skills")
     
     new_skills_data = {
          "skill_list": [
               {"title": "Kubernetes"},
               {"title": "GraphQL"},
               {"title": "Machine Learning"},
          ]
     }
     
     try:
          result = JobSeekerService.perform_job_seeker_skills_update(
               job_seeker_user, 
               new_skills_data
          )
          
          print("✅ New skills test successful!")
          print(f"🆕 New skills created: {len(result['data']['created_skills'])}")
          
     except Exception as e:
          print(f"❌ Error: {str(e)}")
     
     # Show final skill count
     final_skill_count = JobSeekerSkill.objects.count()
     print(f"\n📊 Total skills in system: {final_skill_count}")
     
     print("\n🎉 Enhanced skills update testing completed!")

if __name__ == "__main__":
     try:
          test_enhanced_skills_update()
     except Exception as e:
          print(f"❌ Test failed: {str(e)}")
          import traceback
          traceback.print_exc()
