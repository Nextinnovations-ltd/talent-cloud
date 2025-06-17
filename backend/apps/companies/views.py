from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from apps.companies.serializers import CompanySerializer, IndustrySerializer
from utils.response import CustomResponse
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import TalentCloudSuperAdminPermission
from .models import Company, Industry
from rest_framework.permissions import AllowAny

class IndustryListAPIView(views.APIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get(self, request):
          """
          List all industries.
          """
          industries = Industry.objects.all()
          serializer = IndustrySerializer(industries, many=True)
          
          return Response(serializer.data)

class CompanyCreateAPIView(views.APIView):
     """
     API view to create a new company.
     Handles POST (create) request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def post(self, request):
          """
          Create a new company.
          """
          serializer = CompanySerializer(data=request.data)
          if serializer.is_valid():
               serializer.validated_data['is_verified'] = True
               
               serializer.save()
               
               return Response(serializer.data, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyListAPIView(views.APIView):
     """
     API view to list all companies.
     Handles GET request.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get(self, request):
          """
          List all companies.
          """
          companies = Company.objects.all()
          serializer = CompanySerializer(companies, many=True)
          
          return Response(serializer.data)

class CompanyDetailAPIView(views.APIView):
     """
     API view to retrieve, update, or delete a specific company.
     """
     authentication_classes = [TokenAuthentication]
     permission_classes = [TalentCloudSuperAdminPermission]

     def get_object(self, slug):
          """
          Helper method to retrieve a company by slug.
          """
          try:
               company = Company.objects.get(slug=slug)
               return company
          except Company.DoesNotExist:
               raise Http404

     def get(self, request, slug):
          """
          Retrieve a specific company by slug.
          """
          company = self.get_object(slug)
          serializer = CompanySerializer(company)
          return Response(serializer.data)

     def put(self, request, slug):
          """
          Update a specific company by slug.
          """
          company = self.get_object(slug)
          serializer = CompanySerializer(company, data=request.data, partial=True)
          
          if serializer.is_valid():
               serializer.save()
               
               return Response(serializer.data, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     def delete(self, request, slug):
          """
          Delete a specific company by slug.
          """
          company = self.get_object(slug)
          company.delete()
          
          # Return a 204 No Content status for successful deletion
          return Response(CustomResponse.success("Deleted successfully."), status=status.HTTP_200_OK)

class UnauthenticatedCompanyCreateAPIView(views.APIView):
     authentication_classes = []  # Disable all authentication
     permission_classes = [AllowAny]
     
     def get(self, request):
          return Response("Hello")

     def post(self, request):
          """
          Create a new company for unauthenticated users.
          'is_verified' will default to False.
          """
          serializer = CompanySerializer(data=request.data)

          if serializer.is_valid():
               serializer.validated_data['is_verified'] = False

               serializer.save()

               return Response(serializer.data, status=status.HTTP_201_CREATED)

          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)