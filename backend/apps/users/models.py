from django.db import models, transaction
from django.contrib.auth.models import AbstractUser, BaseUserManager
from rest_framework.exceptions import ValidationError
from core.constants.constants import PARENT_COMPANY, ROLES, ROLE_LIST
from services.company.company_service import get_or_create_parent_company
from services.models import TimeStampModel
from utils.user.user import generate_unique_username

class CustomQuerySet(models.QuerySet):
    def active(self):
        return self.filter(status=True)

class CustomUserManager(BaseUserManager):
    def get_verified_user(self):
        return self.get_queryset().filter(is_verified=True)

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field is required.')
        
        email = self.normalize_email(email)
        
        user = self.model(email=email, **extra_fields)
        
        user.set_password(password)
        
        user.save(using=self._db)
        
        return user
    
    def create_admin_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field is required.')
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)

        try:
            role = Role.objects.get(name=ROLES.ADMIN)
        except Role.DoesNotExist:
            print("Admin Role does not exist. Creating Admin Role")
            role, created = Role.objects.get_or_create(name=ROLES.ADMIN)

        extra_fields.setdefault('role', role)
        extra_fields.setdefault('is_verified', False)
        
        email = self.normalize_email(email)
        
        user = self.model(email=email, **extra_fields)
        
        user.set_password(password)
        
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        from apps.users.models import Role
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        try:
            role = Role.objects.get(name=ROLES.SUPERADMIN)
        except Role.DoesNotExist:
            print("SuperAdmin Role does not exist. Creating SuperAdmin Role")
            role, created = Role.objects.get_or_create(name=ROLES.SUPERADMIN)

        extra_fields.setdefault('role', role)
        extra_fields.setdefault('is_verified', True)

        return self.create_user(email, password, **extra_fields)

    def create_user_with_role(self, email, password=None, role_name = ROLES.USER, **extra_fields): 
        if not email:
            raise ValueError("Email cannot be empty")
        
        from apps.users.models import Role
        
        if role_name not in ROLE_LIST:
            raise ValidationError(f"Invalid role: {role_name}")

        try:
            role = Role.objects.get(name=role_name)
        except Role.DoesNotExist:
            print(f"{role_name} Role does not exist. Creating {role_name} Role")
            role, created = Role.objects.get_or_create(name=role_name)
        
        # Generate unique password with prefix for register user
        auto_generated_password = generate_unique_username()
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('role', role)
        extra_fields.setdefault('username', auto_generated_password)
        
        # Check if Superuser and change the flag value for superuser
        if role_name == ROLES.SUPERADMIN:
            extra_fields.setdefault('is_superuser', True)
            
        with transaction.atomic():
            from apps.job_seekers.models import JobSeeker
            
            if role_name == ROLES.USER:
                # Create directly from JobSeeker since it inherit TalentCloudUser
                email = self.normalize_email(email)
                
                job_seeker = JobSeeker(email=email, **extra_fields)
                
                job_seeker.set_password(password)
                
                job_seeker.save(using=self.db)
                
                return job_seeker
            else:
                user = self.create_user(email=email, password=password, **extra_fields)
                
                return user

class Role(TimeStampModel):
    ROLE_CHOICES = (
        (ROLES.ADMIN, 'Admin'),
        (ROLES.SUPERADMIN, 'SuperAdmin'),
        (ROLES.USER, 'User'),
    )

    name = models.CharField(max_length=100, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.name

class Country(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    code2 = models.CharField(max_length=2, unique=True)
    code3 = models.CharField(max_length=3, blank=True, null=True)
    continent = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    def __str__(self):
        return f"{self.name}, {self.country.code2}"

class Address(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    address = models.CharField(max_length=250, null=True, blank=True)
    
    def __str__(self):
        return f"{self.address or 'No Address'}, {self.city.name}, {self.country.name}"

    def save(self, *args, **kwargs):
        if self.country is None:
            raise ValidationError("Country must not be empty.")
        
        if self.country.id == 1034 and self.city is None:
            raise ValidationError("You need to select residing city if your country location is Myanmar.")
        
        if self.city is not None:
            if self.city.country != self.country:
                raise ValidationError("Selected city does not belong to the selected country.")
        
        super().save(*args, **kwargs)
    
class TalentCloudUser(TimeStampModel, AbstractUser):
    from apps.companies.models import Company
    
    first_name = None
    last_name = None
    name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True, null=False, blank=False, db_index=True)
    username = models.CharField(unique=True, max_length=100, null=False, blank=False)
    country_code = models.CharField(max_length=4, null=True, blank=True)
    phone_number = models.CharField(max_length=11, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, related_name='users', null= True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_image_url = models.URLField(null=True, blank=True, max_length=200)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        related_name='users',
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f'{self.email}'
    
    def save(self, *args, **kwargs):
        try:
            user = TalentCloudUser.objects.get(pk=self.pk)
            role = user.role
        except TalentCloudUser.DoesNotExist:
            role = None

        # Check if the role has changed or if it's a new user
        role_changed = role != self.role
        is_new_user = self.pk is None

        # Perform role-based company assignment logic if role changed or new user
        if role_changed or is_new_user:
            if self.role:
                if self.role.name == ROLES.SUPERADMIN:
                    parent_company = get_or_create_parent_company(name=PARENT_COMPANY.name)
                    self.company = parent_company
                elif self.role.name == ROLES.ADMIN:
                    # Later
                    pass
                
                    # self.company = None
                elif self.role.name == ROLES.USER:
                    self.company = None
            else:
                 self.company = None
        elif self.role and self.role.name == ROLES.SUPERADMIN:
            parent_company = get_or_create_parent_company(name=PARENT_COMPANY.name)
            
            if self.company != parent_company:
                self.company = parent_company

        # Call the original save method to persist the changes
        super().save(*args, **kwargs)
    
    @property
    def has_company(self):
        return self.company is not None

class Token(TimeStampModel):
    user = models.ForeignKey(TalentCloudUser, on_delete=models.CASCADE) 
    token = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()

class VerifyRegisteredUser(TimeStampModel):

    objects = CustomQuerySet.as_manager()

    email = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    verification_code = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()

class VerifyLoggedInUser(TimeStampModel):

    objects = CustomQuerySet.as_manager()

    email = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    verification_code = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()

class PasswordReset(TimeStampModel):
    #Custom query set for filtering only active rows
    objects = CustomQuerySet.as_manager()

    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()