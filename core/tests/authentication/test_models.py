class TestAuthenticationModels:
    def inc(self, x):
        return x + 1


    def test_answer(self):
        assert self.inc(3) == 4