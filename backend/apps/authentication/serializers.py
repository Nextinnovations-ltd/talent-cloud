from rest_framework import serializers
from apps.users.models import TalentCloudUser, Role, PasswordReset, VerifyRegisteredUser
from django.contrib.auth import authenticate
from apps.authentication.models import UserInvitation
from core.constants.constants import ROLES
from services.auth.auth_service import AuthenticationService

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.SlugRelatedField(slug_field='name', queryset=Role.objects.all())
    class Meta:
        model = TalentCloudUser
        fields = ('id', 'username', 'email', 'password', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'role')
    
    def validate(self, attrs):
        requrested_user = self.context['request'].user
        
        if 'email' in attrs and attrs['email'] != requrested_user.email:
            raise serializers.ValidationError("You can't change the email of the user")
        
        return attrs

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = TalentCloudUser
        fields = ('email', 'password', 'role')

    def validate_email(self, value):
        # Check if the email already exists in the database
        if TalentCloudUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Talent cloud user with this email already exists.")
        return value

    def validate_password(self, value):
        # Custom validation for password if needed
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value
    
    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        role = validated_data.pop('role', ROLES.USER)

        token = AuthenticationService.register_user_with_role(email, password, role)
        
        return token

class VerifyRegistrationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(
        write_only=True, 
        error_messages={
            'blank': "Token is required.",
            'invalid': "Please provide a valid token.",
        }
    )
    verification_code = serializers.CharField(
        write_only=True,
        error_messages={
            'blank': "Verification Code is required.",
            'invalid': "Please provide a valid verification code",
        }
    )

    class Meta:
        model = VerifyRegisteredUser
        fields = ('token', 'verification_code', 'expired_at')
        extra_kwargs = {
            'expired_at': { 'read_only': True }
        }
    
    def create(self, validated_data):
        token = validated_data.get('token')
        verification_code = validated_data.get('verification_code')
        
        try:
            user = AuthenticationService.verify_registered_user(token, verification_code)
            
            return user
        except ValueError as e:
            raise serializers.ValidationError(e)

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = TalentCloudUser
        fields = ('email', 'password')
        extra_kwargs = {
            'email': { 'validators': [] },
            'password': { 'write_only': True }
        }

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({'detail': 'Invalid credentials or user is not verified.'})

        if not user.is_verified:
            raise serializers.ValidationError({'detail': 'User is not verified. Please verify your email.'})

        attrs['user'] = user
        return attrs
    
class ForgetPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        error_messages={
            'blank': "Email field cannot be empty.",
            'invalid': "Please provide a valid email address.",
        }
    )

    class Meta:
        model = PasswordReset
        fields = ['email']

    def create(self, validated_data):
        email = validated_data.get('email', None)
 
        try:
            reset_token = AuthenticationService.create_password_reset_request(email)
            
            return reset_token
        except ValueError as e:
            raise serializers.ValidationError(e)

class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # token = serializers.CharField(write_only=True, required=False)
    
    token = serializers.CharField(
        write_only=True,
        required=False,
        error_messages={
            'blank': "Token is required to reset password.",
            'invalid': "Token is invalid.",
        }
    )

    class Meta:
        model = TalentCloudUser
        fields = ('password', 'token')

    def get_token(self, obj):
        return self.context.get('token', None)

    def create(self, validated_data):
        password = validated_data.get('password')
        token = validated_data.pop('token', None)

        try:
            token = AuthenticationService.perform_reset_password(password, token)
            
            return token
        except ValueError as e:
            raise serializers.ValidationError(e)

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserInvitation
        fields= [ 'email', 'token', 'invited_by', 'target_company', 'invitation_status', 'expires_at']