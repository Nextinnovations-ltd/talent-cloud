class CustomResponse:
    def __init__(self, status, message, data=None):
        self.status = status
        self.message = message
        self.data = data

    def to_dict(self):
        return {
            'status': self.status,
            'message': self.message,
            'data': self.data
        }

    @classmethod
    def success(cls, message, data=None):
        return cls(True, message, data).to_dict()

    @classmethod
    def error(cls, message, data=None):
        return cls(False, message, data).to_dict()