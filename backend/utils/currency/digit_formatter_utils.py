def format_currency(amount, currency_symbol='MMK', decimal_places=0):
     """
     Format currency with comma separators after every 3 digits
     
     Args:
          amount: The numeric amount to format
          currency_symbol: Currency symbol or code (default: 'MMK')
          decimal_places: Number of decimal places to show (default: 0)
     
     Returns:
          Formatted currency string
     
     Examples:
          format_currency(1234567) -> "1,234,567 MMK"
          format_currency(1234567.89, 'USD', 2) -> "1,234,567.89 USD"
          format_currency(None) -> "0 MMK"
     """
     if amount is None or amount == '':
          return f"0 {currency_symbol}"
     
     try:
          # Convert to float if it's a string
          if isinstance(amount, str):
               amount = float(amount.replace(',', ''))
          
          # Format with comma separators
          if decimal_places > 0:
               formatted_amount = f"{amount:,.{decimal_places}f}"
          else:
               formatted_amount = f"{int(amount):,}"
          
          return f"{formatted_amount} {currency_symbol}"
     
     except (ValueError, TypeError):
          return f"0 {currency_symbol}"

def format_money_only(amount, decimal_places=0):
     """
     Format money amount with commas only (no currency symbol)
     
     Args:
          amount: The numeric amount to format
          decimal_places: Number of decimal places to show (default: 0)
     
     Returns:
          Formatted number string with commas
     
     Examples:
          format_money_only(1234567) -> "1,234,567"
          format_money_only(1234567.89, 2) -> "1,234,567.89"
     """
     if amount is None or amount == '':
          return "0"
     
     try:
          # Convert to float if it's a string
          if isinstance(amount, str):
               amount = float(amount.replace(',', ''))
          
          # Format with comma separators
          if decimal_places > 0:
               return f"{amount:,.{decimal_places}f}"
          else:
               return f"{int(amount):,}"
     
     except (ValueError, TypeError):
          return "0"

def format_myanmar_currency(amount, show_symbol=True):
     """
     Format amount specifically for Myanmar currency (MMK)
     
     Args:
          amount: The numeric amount to format
          show_symbol: Whether to show MMK symbol (default: True)
     
     Returns:
          Formatted Myanmar currency string
     
     Examples:
          format_myanmar_currency(1234567) -> "1,234,567 MMK"
          format_myanmar_currency(1234567, False) -> "1,234,567"
     """
     formatted = format_money_only(amount)
     return f"{formatted} MMK" if show_symbol else formatted

def parse_currency_input(input_value):
     """
     Parse currency input by removing commas and converting to number
     
     Args:
          input_value: String input that may contain commas
     
     Returns:
          Numeric value or None if invalid
     
     Examples:
          parse_currency_input("1,234,567") -> 1234567
          parse_currency_input("1,234,567.89") -> 1234567.89
     """
     if not input_value:
          return None
     
     try:
          # Remove commas and currency symbols
          cleaned = str(input_value).replace(',', '').replace('MMK', '').replace('USD', '').strip()
          return float(cleaned)
     except (ValueError, TypeError):
          return None

def format_salary_range(min_salary, max_salary, currency='MMK'):
     """
     Format salary range with proper currency formatting
     
     Args:
          min_salary: Minimum salary amount
          max_salary: Maximum salary amount
          currency: Currency symbol (default: 'MMK')
     
     Returns:
          Formatted salary range string
     
     Examples:
          format_salary_range(500000, 800000) -> "500,000 - 800,000 MMK"
          format_salary_range(500000, None) -> "500,000+ MMK"
     """
     if not min_salary:
          return f"Negotiable {currency}"
     
     min_formatted = format_money_only(min_salary)
     
     if not max_salary:
          return f"{min_formatted}+ {currency}"
     
     max_formatted = format_money_only(max_salary)
     return f"{min_formatted} - {max_formatted} {currency}"