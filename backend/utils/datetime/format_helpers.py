from datetime import datetime, date

def get_formatted_date_range(start_date, end_date, is_ongoing):
     if not start_date:
          return ''
     
     formatted_start_date = format_date_for_display(start_date)
     
     if is_ongoing:
          return f"{formatted_start_date} - Present"
     elif end_date:
          formatted_end_date = format_date_for_display(end_date)
          return f"{formatted_start_date} - {formatted_end_date}"
     else:
          return formatted_start_date

def format_date_for_display(date_obj, input_format='month_year'):
     """Format date for UI display"""
     if not date_obj:
          return ''
     
     if isinstance(date_obj, str):
          try:
               date_obj = datetime.strptime(date_obj, '%Y-%m-%d').date()
          except ValueError:
               return date_obj

     if isinstance(date_obj, date) and not isinstance(date_obj, datetime):
          datetime_obj = datetime.combine(date_obj, datetime.min.time())
     else:
          datetime_obj = date_obj
     
     # Format based on type
     format_map = {
          'default': '%Y-%m-%d',           # 2020-02-02
          'short': '%m/%d/%Y',             # 02/02/2020
          'long': '%B %d, %Y',             # February 02, 2020
          'custom_display': '%B %d %Y',    # February 02 2020
          'month_year': '%b %Y',           # Feb 2020
          'year': '%Y',                    # 2020
          'display': '%d %b %Y',           # 02 Feb 2020
          'iso': '%Y-%m-%d',               # 2020-02-02
          'us': '%m/%d/%Y',                # 02/02/2020
          'eu': '%d/%m/%Y',                # 02/02/2020
     }
     
     format_string = format_map.get(input_format, input_format)
     
     return datetime_obj.strftime(format_string)