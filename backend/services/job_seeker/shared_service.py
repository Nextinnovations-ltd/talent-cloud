from rest_framework import serializers
from django.utils import timezone

class JobSeekerSharedService:
     @staticmethod
     def validate_date_range(start_date, end_date, is_ongoing=False):
          """Validate the start date and enddate"""

          # If it is ongoing, end_date should be None
          if is_ongoing and end_date:
               raise serializers.ValidationError("Ongoing should not have an end date.")
          
          # If it is not ongoing, it should have an end date
          if not is_ongoing and not end_date and start_date:
               raise serializers.ValidationError("Completed one must have an end date.")
          
          # Validate date logic
          if start_date and end_date:
               if start_date > end_date:
                    raise serializers.ValidationError("Start date cannot be after end date.")
               
               # Check if dates are not in the future (unless ongoing)
               today = timezone.now().date()
               
               if end_date > today and not is_ongoing:
                    raise serializers.ValidationError("End date cannot be in the future.")
          
          return True