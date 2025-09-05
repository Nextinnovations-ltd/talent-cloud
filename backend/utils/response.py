from typing import Any, Dict, Optional, Union, List
from datetime import datetime

class CustomResponse:
    """
    Simple and standardized API response format
    """
    
    @classmethod
    def success(
        cls, 
        message: str = "Operation completed successfully", 
        data: Any = None
    ) -> Dict[str, Any]:
        """
        Create a standardized success response
        
        Args:
            message (str): Success message
            data (Any): Response data (optional)
            
        Returns:
            Dict: Standardized success response
        """
        response = {
            "status": True,
            "message": message
        }
        
        # Only include data if it's not None (allows empty lists/dicts)
        # if data is not None:
        
        response["data"] = data
            
        return response

    @classmethod
    def error(
        cls, 
        message: str = "Operation failed", 
        errors: Optional[Union[Dict, List, str]] = None,
        data: Any = None
    ) -> Dict[str, Any]:
        """
        Create a standardized error response
        
        Args:
            message (str): Error message
            errors (Union[Dict, List, str]): Detailed error information (optional)
            data (Any): Additional data (optional)
            
        Returns:
            Dict: Standardized error response
        """
        response = {
            "status": False,
            "message": message
        }
        
        # Include detailed errors if provided
        if errors is not None:
            response["errors"] = errors
        
        # Include additional data if provided
        if data is not None:
            response["data"] = data
            
        return response