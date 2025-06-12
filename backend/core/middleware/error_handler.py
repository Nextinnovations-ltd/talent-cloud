class CustomError:
     def set(error):
          """ Get every first error from the error response

          Args:
              error

          Returns:
              string
          """
          if isinstance(error, dict):
               if hasattr(error, 'detail'):
                    error_detail = error.get('detail', None)
               else:
                    for key, value in error.items():
                         if isinstance(value, list) and len(value) > 0:
                              return str(value[0])
                         return str(value)
                    
          elif isinstance(error, list):
               error_detail = error[0]
          elif hasattr(error, 'message'):
               error_detail = error.message
          else:
               error_detail = error.detail
               
          if isinstance(error_detail, dict):  # Handle dictionary errors
               # Extract the first error message from the first key
               for key, value in error_detail.items():
                    if isinstance(value, list) and len(value) > 0:
                         return str(value[0])  # Convert ErrorDetail or message to string
                    return str(value)
          elif isinstance(error_detail, list):  # Handle list errors
               return str(error_detail[0])
          elif isinstance(error_detail, str):  # Handle string errors
               return error_detail
          
          return str(error_detail)  # Fallback to string conversion