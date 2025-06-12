def format_salary(value):
     if value is None:
          return None
     # Remove trailing .00 by converting to int if it's an integer value
     if value == int(value):
          return str(int(value))
     return str(value)