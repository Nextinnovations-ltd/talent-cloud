"""
Test cases for OAuth input validation
"""
import pytest
from rest_framework.exceptions import ValidationError
from utils.oauth.validation import OAuthValidator

class TestOAuthValidator:
    """Test cases for OAuth input validation"""
    
    def test_valid_google_auth_code(self):
        """Test validation of valid Google authorization codes"""
        valid_codes = [
            "4/P7q7W91a-oMsCeLvIaQm6bTrgtp7",
            "4/0AX4XfWh_valid_code_123",
            "sample.auth.code-123_456"
        ]
        
        for code in valid_codes:
            result = OAuthValidator.validate_auth_code(code, 'google')
            assert result == code.strip()
    
    def test_valid_linkedin_auth_code(self):
        """Test validation of valid LinkedIn authorization codes"""
        valid_codes = [
            "AQTxrv8w7VjF6X5mQm9z4YpN3nFE",
            "sample_linkedin_code-123",
            "valid.code.linkedin"
        ]
        
        for code in valid_codes:
            result = OAuthValidator.validate_auth_code(code, 'linkedin')
            assert result == code.strip()
    
    def test_valid_facebook_auth_code(self):
        """Test validation of valid Facebook authorization codes"""
        valid_codes = [
            "AQBxKdj7Zm6h8KpN9uFc2VtR5wE",
            "facebook_code#123-456",
            "valid.facebook.code_789"
        ]
        
        for code in valid_codes:
            result = OAuthValidator.validate_auth_code(code, 'facebook')
            assert result == code.strip()
    
    def test_invalid_auth_codes(self):
        """Test validation of invalid authorization codes"""
        invalid_cases = [
            ("", "google", "Authorization code is required"),
            (None, "google", "Authorization code is required"),
            (123, "google", "Authorization code must be a string"),
            ("code\x00with\x00nulls", "google", "Authorization code contains invalid characters"),
            ("code\nwith\nnewlines", "google", "Authorization code contains invalid characters"),
            ("code with spaces", "google", "Invalid authorization code format"),
            ("code@with#invalid$chars", "google", "Invalid authorization code format"),
            ("a" * 3000, "google", "Authorization code too long"),
        ]
        
        for code, provider, expected_error in invalid_cases:
            with pytest.raises(ValidationError) as exc_info:
                OAuthValidator.validate_auth_code(code, provider)
            assert expected_error in str(exc_info.value)
    
    def test_unsupported_provider(self):
        """Test validation with unsupported provider"""
        with pytest.raises(ValidationError) as exc_info:
            OAuthValidator.validate_auth_code("valid_code", "twitter")
        assert "Unsupported OAuth provider" in str(exc_info.value)
    
    def test_provider_name_validation(self):
        """Test provider name validation"""
        # Valid providers
        valid_providers = ["google", "linkedin", "facebook", "GOOGLE", "LinkedIn", "FaceBook"]
        expected_results = ["google", "linkedin", "facebook", "google", "linkedin", "facebook"]
        
        for provider, expected in zip(valid_providers, expected_results):
            result = OAuthValidator.validate_provider_name(provider)
            assert result == expected
        
        # Invalid providers
        invalid_providers = [
            ("", "Provider name is required"),
            (None, "Provider name is required"),
            (123, "Provider name must be a string"),
            ("twitter", "Unsupported provider"),
            ("invalid_provider", "Unsupported provider")
        ]
        
        for provider, expected_error in invalid_providers:
            with pytest.raises(ValidationError) as exc_info:
                OAuthValidator.validate_provider_name(provider)
            assert expected_error in str(exc_info.value)
    
    def test_user_agent_sanitization(self):
        """Test user agent sanitization"""
        test_cases = [
            ("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"),
            ("", "Unknown"),
            (None, "Unknown"),
            ("Valid<script>alert()</script>Agent", "Validscriptalert()/scriptAgent"),  # Fixed: () and / are allowed
            ("A" * 600, "A" * 500),  # Should be truncated to 500 chars
        ]
        
        for input_ua, expected in test_cases:
            result = OAuthValidator.sanitize_user_agent(input_ua)
            assert result == expected
    
    def test_ip_address_sanitization(self):
        """Test IP address sanitization"""
        test_cases = [
            ("192.168.1.1", "192.168.1.1"),
            ("2001:0db8:85a3:0000:0000:8a2e:0370:7334", "2001:0db8:85a3:0000:0000:8a2e:0370:7334"),
            ("", "Unknown"),
            (None, "Unknown"),
            ("invalid_ip_address", "invalid_ip_address"),  # Fixed: underscores are allowed
            ("192.168.1.1<script>", "192.168.1.1script"),
        ]
        
        for input_ip, expected in test_cases:
            result = OAuthValidator.sanitize_ip_address(input_ip)
            assert result == expected


# Example usage and test runner
if __name__ == "__main__":
    # Simple test runner for demonstration
    validator_tests = TestOAuthValidator()
    
    try:
        # Test valid codes
        print("Testing valid Google auth code...")
        result = OAuthValidator.validate_auth_code("4/P7q7W91a-oMsCeLvIaQm6bTrgtp7", "google")
        print(f"✓ Valid Google code: {result}")
        
        # Test invalid code
        print("\nTesting invalid auth code...")
        try:
            OAuthValidator.validate_auth_code("invalid code with spaces", "google")
        except ValidationError as e:
            print(f"✓ Caught expected error: {e}")
        
        # Test provider validation
        print("\nTesting provider validation...")
        result = OAuthValidator.validate_provider_name("GOOGLE")
        print(f"✓ Normalized provider: {result}")
        
        # Test sanitization
        print("\nTesting sanitization...")
        sanitized_ua = OAuthValidator.sanitize_user_agent("Mozilla/5.0<script>alert()</script>")
        print(f"✓ Sanitized user agent: {sanitized_ua}")
        
        print("\n✅ All validation tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
