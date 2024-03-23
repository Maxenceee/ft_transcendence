from django import forms
from .models import User

class UserProfilePictureForm(forms.ModelForm):
    class Meta:
        model = User
        fields = []  # Exclure tous les champs du modèle

    def clean(self):
        cleaned_data = super().clean()
        if 'profile_picture_image' not in self.files:
            raise forms.ValidationError("Aucune image fournie.")
        return cleaned_data