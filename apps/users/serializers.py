from rest_framework import serializers
from .models import TalentCloudUser

class TalentCloudUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TalentCloudUser
        fields = '__all__'