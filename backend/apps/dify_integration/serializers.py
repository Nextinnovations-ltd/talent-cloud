from rest_framework import serializers

TASK_TYPE_CHOICES = [
    'bio_description',
    'job_description',
    'project_description',
    'experience_description',
    'education_description',
    'test_description'
]

class DifyGenerationSerializer(serializers.Serializer):
     """
     Validates the request body sent from the frontend.
     """
     task_type = serializers.ChoiceField(choices=TASK_TYPE_CHOICES)
     input_text = serializers.CharField(trim_whitespace=True)
     max_output_length = serializers.IntegerField(required=False, allow_null=True)
