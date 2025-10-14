import re
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from nltk import pos_tag
from nltk.tokenize import word_tokenize

lemmatizer = WordNetLemmatizer()

def get_wordnet_pos(tag):
     """Maps NLTK POS tags to WordNet POS tags for better lemmatization."""
     if tag.startswith('J') or tag in ('JJR', 'JJS', 'RBR', 'RBS'):
          return wordnet.ADJ
     elif tag.startswith('V'):
          return wordnet.VERB
     elif tag.startswith('N'):
          return wordnet.NOUN
     elif tag.startswith('R'):
          return wordnet.ADV
     return wordnet.NOUN

def get_canonical_keyword(keyword: str) -> str:
     """
     Cleans, tokenizes, and lemmatizes the keyword to find its canonical form.
     """
     try:
          text = keyword.lower().strip()
          text = re.sub(r'[^a-z0-9\s]', '', text)

          tokens = word_tokenize(text)
          
          if not tokens:
               return ""

          pos_tags = pos_tag(tokens)
          
          lemmatized = [
               lemmatizer.lemmatize(word, pos=get_wordnet_pos(tag))
               for word, tag in pos_tags
          ]

          canonical_form = " ".join(lemmatized)

          print(canonical_form)
          return canonical_form
     except Exception as e:
          print(f"Error {str(e)}")