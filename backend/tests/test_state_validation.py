#!/usr/bin/env python
"""
Quick test for state parameter validation with LinkedIn and Facebook formats
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/khant-hmue/Projects/Next Innovations/tc/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.config.settings.development')
django.setup()

from utils.oauth.validation import OAuthValidator

def test_state_formats():
    print("Testing state parameter validation with different formats...")
    
    # Test cases
    test_cases = [
        ("LinkedIn state", "foobar"),
        ("Facebook state", "st=sdkjfsldfjasldfjlj329472394,ds=123456789"),
        ("Our generated state", "abc123.def456.1234567890"),
        ("Simple alphanumeric", "state123"),
        ("With underscores", "state_123"),
        ("With hyphens", "state-123"),
    ]
    
    for name, state_value in test_cases:
        try:
            result = OAuthValidator.validate_state_parameter(state_value)
            print(f"✅ {name}: '{state_value}' -> VALID")
        except Exception as e:
            print(f"❌ {name}: '{state_value}' -> FAILED: {e}")
    
    print("\nTesting invalid states...")
    
    invalid_cases = [
        ("Empty string", ""),
        ("None", None),
        ("With dangerous chars", "state\x00test"),
        ("With newline", "state\ntest"),
        ("Too long", "a" * 250),
        ("Invalid chars", "state<script>alert()</script>"),
    ]
    
    for name, state_value in invalid_cases:
        try:
            result = OAuthValidator.validate_state_parameter(state_value)
            print(f"❌ {name}: '{state_value}' -> UNEXPECTEDLY VALID")
        except Exception as e:
            print(f"✅ {name}: '{state_value}' -> CORRECTLY FAILED: {e}")

if __name__ == "__main__":
    test_state_formats()
