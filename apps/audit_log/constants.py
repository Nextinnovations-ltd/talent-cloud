class ActivityActions:
     LOGIN = "LOGIN"
     LOGOUT = "LOGOUT"
     REGISTER = "REGISTER"
     APPLY_JOB = "APPLY_JOB"
     UPDATE_PROFILE = "UPDATE_PROFILE"

     CHOICES = [
          (LOGIN, "User Logged In"),
          (LOGOUT, "User Logged Out"),
          (REGISTER, "User Registered"),
          (APPLY_JOB, "Applied for Job"),
          (UPDATE_PROFILE, "Updated Profile"),
     ]

     @classmethod
     def list(cls):
          """Returns a list of action keys."""
          return [action[0] for action in cls.CHOICES]
