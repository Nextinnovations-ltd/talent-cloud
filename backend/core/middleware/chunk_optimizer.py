from django.db.models import QuerySet

def chunked_queryset(queryset: QuerySet, chunk_size: int):
     start = 0
     end = chunk_size
     
     # break users into chunks to avoid memory overload
     while True:
          chunk = list(queryset[start:end])
          if not chunk:
               break
          yield chunk
          start = end
          end += chunk_size