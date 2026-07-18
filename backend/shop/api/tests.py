from base64 import b64decode

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.test import TestCase


class ProfileApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='profile-user', password='secret1234')
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_profile_patch_accepts_avatar_and_updates_name_fields(self):
        avatar_bytes = b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAIAAeIhvAAAAAElFTkSuQmCC')
        avatar = SimpleUploadedFile('avatar.png', avatar_bytes, content_type='image/png')

        response = self.client.patch(
            '/api/auth/profile/',
            {
                'first_name': 'Ali',
                'last_name': 'Rahimi',
                'avatar': avatar,
            },
            format='multipart',
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Ali')
        self.assertEqual(self.user.last_name, 'Rahimi')
        self.assertTrue(self.user.profile.avatar.name)
